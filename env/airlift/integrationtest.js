
var print = function print(_message)
{
	Packages.java.lang.System.out.println(_message);
};

var createContext = function createContext()
{
		//Do not try to manage the context ... as it is managed by
		//Rhino already.  Trying to check to see is the current context
		//is used and using that instead will circumvent Rhino context
		//context counting mechanism.  This could lead to strange issues
		//popping up like disappearing object references and staying up
		//late at night :) ... Bediako 06/18/2011 5:49 am.

	var context = (new Packages.org.mozilla.javascript.ContextFactory()).enterContext();
	context.setLanguageVersion(180);
	context.setOptimizationLevel(-1);   //in app engine it turns out that interpreted mode is fastest for handler execution.
	
	return context;
};

var resetScope = function resetScope(_context, _sharedScope)
{	
	var scriptable = _context.newObject(_sharedScope);
	
	scriptable.setPrototype(_sharedScope);
	scriptable.setParentScope(null);
	return scriptable;
};

importClass(Packages.com.google.appengine.tools.development.DevAppServerFactory);
importClass(Packages.com.google.appengine.tools.development.DevAppServer);
importClass(Packages.com.google.appengine.tools.development.DevAppServerImpl);
importClass(Packages.com.google.appengine.tools.info.SdkInfo);
importClass(Packages.java.net.URL);
importClass(Packages.java.net.URI);
importClass(Packages.airlift.util.SharedRequire);
importClass(Packages.airlift.util.Require);
importClass(Packages.org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider);
importClass(Packages.airlift.util.UrlModuleSourceProvider);

var USER_CODE_CLASSPATH_MANAGER_PROP = "devappserver.userCodeClasspathManager";
var USER_CODE_CLASSPATH = USER_CODE_CLASSPATH_MANAGER_PROP + ".classpath";
var USER_CODE_REQUIRES_WEB_INF = USER_CODE_CLASSPATH_MANAGER_PROP + ".requiresWebInf";

var SDK_ROOT_PROP = "appengine.sdk.root"
var originalSdkRoot;
try{ var appDir = new Packages.java.io.File((project.getBaseDir() + "/war"));} catch(e){ print(e.message); print(e.stack);}
try{ var sdkRoot = new Packages.java.io.File(project.getProperty('newsdk.dir'));} catch(e){print(e.message); print(e.stack);}

var jsClassPathArray = new Packages.java.util.ArrayList();
var jsAllClassPath = project.getProperty("appserver.classpath");
print("Obtained appserver.classpath property inserted");
var classPathFiles = jsAllClassPath.split(':');

classPathFiles.forEach(function(path){

    if(((path.indexOf(".jar")) !== -1) && ((path.indexOf("/WEB-INF/")) !== -1)){
	path = path.substring(path.lastIndexOf("/WEB-INF/"));
	path= "jar:file://" + path + "!/";
	print("The url is equal to: " + path);
    var url = new URL(path);
    jsClassPathArray.add(url);
    }
    else if(path.endsWith(".jar") === true){
	path = path.substring(path.lastIndexOf("/lib/"));
	path= "jar:file://" + path + "!/";
	print("The url is equal to: " + path);
    var url = new URL(path);
    jsClassPathArray.add(url);
    }
    else if(new Packages.java.io.File(path).isDirectory() === true){

	print("Begin folder scan...");
	var classScanner = new org.apache.tools.ant.DirectoryScanner();
	var classIncludes = Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.String, 1);
	classIncludes[0] = "**/*.*";

	classScanner.setIncludes(classIncludes);
	classScanner.setBasedir(new Packages.java.io.File(path));
	classScanner.setCaseSensitive(true);
	classScanner.scan();

	var classFolderFiles = classScanner.getIncludedFiles();
	
	classFolderFiles.forEach(function(path){
		 path= "file:///" + path;
		 print("The url is equal to: " + path);
		 var url = new URL(path);
		 jsClassPathArray.add(url);
	});
    }
    else{
	print("The Path was not entered.  It is equal to: " + path);
    }
});

print("Successfully set up DevAppServerTestConfig");

    try {
	//Convert URL Collection into a containerConfigProps HashMap
	var containerConfigProps = new Packages.java.util.HashMap();
	var userCodeClasspathManagerProps = new Packages.java.util.HashMap();
	userCodeClasspathManagerProps.put(USER_CODE_CLASSPATH, jsClassPathArray);
	userCodeClasspathManagerProps.put(USER_CODE_REQUIRES_WEB_INF, false); //Test later
	containerConfigProps.put(USER_CODE_CLASSPATH_MANAGER_PROP, userCodeClasspathManagerProps);
	
	var started = false;
	originalSdkRoot = Packages.java.lang.System.getProperty(SDK_ROOT_PROP);
	Packages.java.lang.System.setProperty(SDK_ROOT_PROP, sdkRoot.getAbsolutePath());
	SdkInfo.includeTestingJarOnSharedPath(true);

	var address = "127.0.0.1";
	print("Right Before Setup");
	var server = new DevAppServerImpl(appDir, sdkRoot, null, null, address, 8080, false, containerConfigProps);
	print("Right Before Start");
	var countdownLatch = server.start();
	Packages.java.lang.System.setProperty("airlift.devtest.port", server.getPort());
	print("The server port is: " + server.getPort());
    } catch (e) {
        print(e.message);
	print(e.stack);
      }
finally {
    if (!started) {
        server = null;
        SdkInfo.includeTestingJarOnSharedPath(false);
      }
    }
print("Test server has just been set up");

var context = createContext();
var sharedScope = context.initStandardObjects();

context.evaluateString(sharedScope, Packages.airlift.util.JavaScriptingUtil.shim, "shim", 1, null);

var uris = new Packages.java.util.HashSet();

//Note that we are really not calling out to the
//http ... we ultimately just use the path of this
//URI to find the resource in the jar.
uris.add(new URI("http://localhost:80/test/airlift/"));
uris.add(new URI("http://localhost:80/test/airlift/test"));
uris.add(new URI("http://localhost:80/airlift"));
uris.add(new URI("http://localhost:80//airlift/lib/"));
uris.add(new java.net.URI("http://localhost:80/handler/"));
uris.add(new java.net.URI("http://localhost:80/extlib/"));
uris.add(new java.net.URI("http://localhost:80/gen/"));
uris.add(new URI("http://localhost:80//node_modules/"));
uris.add(new URI("http://localhost:80//"));

var sharedRequire = new SharedRequire(
	context, sharedScope, new StrongCachingModuleScriptProvider(
	new UrlModuleSourceProvider(null, uris)), null, null, false);

var testDir = project.getProperty("src.test");

var directoryScanner = new org.apache.tools.ant.DirectoryScanner();
var includes = 	Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.String, 2);
includes[0] = "test*.js";
includes[1] = "**/test*.js";

var baseDir = project.getBaseDir().getPath() + "/src/test/airlift/test/";
directoryScanner.setIncludes(includes);
directoryScanner.setBasedir(new Packages.java.io.File(baseDir));
directoryScanner.setCaseSensitive(true);
directoryScanner.scan();

print("Executing tests ...");
var files = directoryScanner.getIncludedFiles();

var totalFailedAssertions = 0;
var totalAssertions = 0;
var totalTestCount = 0;

for (var i = 0; i < files.length; i++)
{
	var testScript = new Packages.java.lang.String(files[i]);
	var harness = "var harness = require('harness'); var name = \"" + testScript.replaceAll(".js$", "") + "\"; var test = require(name); this.stats = harness.run(name, test);";	
    print("...Now running: " + testScript.replaceAll(".js$", "") + "...");

	var scope = resetScope(context, sharedScope);
	var require = new Require(scope, sharedRequire, new Packages.java.util.HashMap(), true);
	require.install(scope);

	print('');
   
	context.evaluateString(scope, harness, files[i], 1, null);

	var scriptableObject = Packages.org.mozilla.javascript.ScriptableObject;

	var stats = scope.get("stats", scope);

	if (stats)
	{
		var failed = stats.get("failed", stats);
		var total = stats.get("total", stats);
		var testCount = stats.get("testCount", stats);

		totalFailedAssertions += parseInt(failed, 10);
		totalAssertions += parseInt(total, 10);
		totalTestCount += parseInt(testCount, 10);
	}
}

if (totalFailedAssertions > 0)
{
	print('');
	throw new Error('Test run ended with a total of ' + totalTestCount + ' tests with '+ totalFailedAssertions + ' failed assertions');
}
else
{
	print('');
	print(totalTestCount + ' test(s) with ' + totalAssertions + ' assertion(s) passed.');
}

print("Attempting to stop server...");
SdkInfo.includeTestingJarOnSharedPath(false);
Packages.java.lang.Thread.sleep(5000);
    if (server !== null) {
      try {
        server.shutdown();
        server = null;
      } catch (e) {
       print(e.message);
    print(e.stack);
      }
    }
if (originalSdkRoot == null) {
      Packages.java.lang.System.clearProperty(SDK_ROOT_PROP);
    } else {
      Packages.java.lang.System.setProperty(SDK_ROOT_PROP, originalSdkRoot);
    }