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

var context = createContext();
var sharedScope = context.initStandardObjects();

context.evaluateString(sharedScope, Packages.airlift.util.JavaScriptingUtil.shim, "shim", 1, null);

var uris = new Packages.java.util.HashSet();
importClass(Packages.java.net.URI);

//Note that we are really not calling out to the
//http ... we ultimately just use the path of this
//URI to find the resource in the jar.
uris.add(new URI("http://localhost:80/test/airlift/"));
uris.add(new URI("http://localhost:80/test/airlift/test"));
uris.add(new URI("http://localhost:80/airlift"));
uris.add(new URI("http://localhost:80/"));
uris.add(new URI("http://localhost:80//airlift/lib/"));
uris.add(new URI("http://localhost:80//"));

//var javascriptingUtil = new
//Packages.airlift.util.JavaScriptingUtil();
importClass(Packages.airlift.util.SharedRequire);
importClass(Packages.airlift.util.Require);
importClass(Packages.org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider);
importClass(Packages.airlift.util.UrlModuleSourceProvider);

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

	var scope = resetScope(context, sharedScope);
	var require = new Require(scope, sharedRequire, new Packages.java.util.HashMap(), true);
	require.install(scope);

	print('');
	context.evaluateString(scope, harness, files[i], 1, null);

	var scriptableObject = Packages.org.mozilla.javascript.ScriptableObject;

	var stats = scope.get("stats", scope);
	var failed = stats.get("failed", stats);
	var total = stats.get("total", stats);
	var testCount = stats.get("testCount", stats);

	totalFailedAssertions += failed;
	totalAssertions += total;
	totalTestCount += testCount;
}

if (totalFailedAssertions > 0)
{
	print('');
	throw new Error('Test run ended with a total of ' + totalTestCount + ' tests with '+ totalFailedAssertions + ' failed assertions');
}


