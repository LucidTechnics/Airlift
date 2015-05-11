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
uris.add(new URI("http://localhost:80/airlift"));
uris.add(new URI("http://localhost:80//airlift/lib/"));
uris.add(new java.net.URI("http://localhost:80/handler/"));
uris.add(new java.net.URI("http://localhost:80/extlib/"));
uris.add(new java.net.URI("http://localhost:80/gen/"));
uris.add(new URI("http://localhost:80//node_modules/"));
uris.add(new URI("http://localhost:80//"));

importClass(Packages.airlift.util.SharedRequire);
importClass(Packages.airlift.util.Require);
importClass(Packages.org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider);
importClass(Packages.airlift.util.UrlModuleSourceProvider);

var sharedRequire = new SharedRequire(
	context, sharedScope, new StrongCachingModuleScriptProvider(
	new UrlModuleSourceProvider(null, uris)), null, null, false);

var testDir = project.getProperty("src.test");
var script = project.getProperty("script");

var directoryScanner = new org.apache.tools.ant.DirectoryScanner();
var includes = 	Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.String, 1);
includes[0] = script + ".js";

var baseDir = project.getBaseDir().getPath() + "/src/script/javascript/";
directoryScanner.setIncludes(includes);
directoryScanner.setBasedir(new Packages.java.io.File(baseDir));
directoryScanner.setCaseSensitive(true);
directoryScanner.scan();

print("Executing script ...");
var files = directoryScanner.getIncludedFiles();
var scriptName = files[0];

var hack = "var name = \"" + script + "\"; var script = require(name);";	

var scope = resetScope(context, sharedScope);
var require = new Packages.airlift.util.Require(scope, sharedRequire, new Packages.java.util.HashMap(), true);
require.install(scope);

context.evaluateString(scope, hack, scriptName, 1, null);