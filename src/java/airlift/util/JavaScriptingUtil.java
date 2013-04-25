/*
 Copyright 2011, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.util;

import org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider;
import org.mozilla.javascript.*;

import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import org.mozilla.javascript.serialize.ScriptableInputStream;
import org.mozilla.javascript.serialize.ScriptableOutputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class JavaScriptingUtil
{
	private static Logger log = Logger.getLogger(JavaScriptingUtil.class.getName());

	private Map<String, Object> bindingsMap;
	private Scriptable scope;
	private static final ScriptableObject sharedScope;
	private static final SharedRequire sharedRequire;
	
	private Map<String, Object> getBindingsMap() { return bindingsMap; }
	private Scriptable getScope() { return scope; }
	public void setBindingsMap(Map<String, Object> _bindingsMap) { bindingsMap = _bindingsMap; }
	public void setScope(Scriptable _scope) { scope = _scope; }
	
	public java.util.List scriptStack = new java.util.ArrayList();
	private boolean cacheScript = false;

	public static final String shim = "Function.prototype.partial = function() { var fn = this, args = Array.prototype.slice.call(arguments); return function() { var arg = 0, length = args.length; var newArgs = Array.prototype.slice.call(arguments); for (var i = 0; i < args.length && arg < newArgs.length; i++ ) { if (args[i] === undefined){ args[i] = newArgs[arg++]; }} var remainingArgs = newArgs.slice(arg)||[]; return fn.apply(this, args.concat(remainingArgs));	};}; String.prototype.equalsIgnoreCase = function(_string) { return new Packages.java.lang.String(this).equalsIgnoreCase(_string); }; String.prototype.contains = function(_string) { return new Packages.java.lang.String(this).contains(_string); }; String.prototype.replaceAll = function(_regex, _replacement) { return new Packages.java.lang.String(this).replaceAll(_regex, _replacement); }; var __AIRLIFT_REPLACER = function __AIRLIFT_REPLACER(_key, _value) { var replacement = _value; if (_value instanceof java.util.Collection) { var list = []; for (var item in Iterator(_value)) { list.push(item); } replacement = list; } else if (_value instanceof java.util.Map) { var map = {}; for (var item in Iterator(_value.keySet())) { map[item] = _value.get(item); } replacement = map; } else if (_value instanceof java.util.Date) { replacement = new Date(_value.getTime()).toJSON(); } else if (_value instanceof java.lang.String) { replacement = new String(_value); } else if (_value && _value.getClass && _value.getClass().isArray() && _value.getClass().getComponentType() && \"java.lang.String\".equals(_value.getClass().getComponentType().getName()) === true) { var list = []; for (var i = 0, length = _value.length; i < length; i++) { list.push(_value[i]); } replacement = list; } else if (_value && _value.getClass && _value.getClass().isArray() === true) /* arrays other than java.lang.String[] are not supported */ { replacement = undefined; } else if (_value instanceof java.lang.Number) { replacement = new Number(_value); } else if (_value instanceof java.lang.Boolean) { replacement = _value.booleanValue(); } else if (_value instanceof java.lang.Character || _value instanceof java.lang.Byte) { /* do not show a property with this type. */ replacement = undefined; } else if (_value && _value.getClass) { util.info('No replacement for:', _value.getClass()); } return replacement; }; (function () { var old_prototype = JSON.stringify.prototype; var old_stringify = JSON.stringify; JSON.stringify = function () { var args = Array.prototype.slice.call(arguments); args[1] = args[1] || __AIRLIFT_REPLACER; return old_stringify.apply(this, args); }; JSON.stringify.prototype = old_prototype; }) ();";

	static
	{
		Context context = (new ContextFactory()).enterContext();
		
		try
		{
			sharedScope = context.initStandardObjects();
			context.evaluateString(sharedScope, shim, "JavaScriptingUtil initialization", 1, null);

			java.util.Set uris = new java.util.HashSet();

			try
			{
				//Note that we are really not calling out to the
				//http ... we ultimately just use the path of this
				//URI to find the resource in the jar.

				uris.add(new java.net.URI("http://localhost:80/handler/"));
				uris.add(new java.net.URI("http://localhost:80/lib/"));
				uris.add(new java.net.URI("http://localhost:80/gen/"));
				uris.add(new java.net.URI("http://localhost:80/"));
				uris.add(new java.net.URI("http://localhost:80//airlift/lib/"));
				uris.add(new java.net.URI("http://localhost:80//"));
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}

			sharedRequire = new SharedRequire(context, sharedScope, new StrongCachingModuleScriptProvider(new UrlModuleSourceProvider(null, uris)), null, null, false);
			//Cannot seem to safely execute scripts to be made available at the
			//shared scope level. :(   Never mind ... eliminating the
			//initStandardObjects call over and over saves quite a bit
			//of time on its own ...
		}
		finally
		{
			context.exit();
		}
	}
	
    /**
     * Instantiates a new javascripting util.
     */
    public JavaScriptingUtil()
	{
		this.cacheScript = false;
		setBindingsMap(new HashMap<String, Object>());
	}

	public JavaScriptingUtil(boolean _cacheScript)
	{
		this();
		this.cacheScript = _cacheScript;
	}

    /**
     * Bind.
     *
     * @param _name the _name
     * @param _value the _value
     */
    public void bind(String _name, Object _value)
    {
		getBindingsMap().put(_name, _value);
	}

	public void executeScript(String _scriptResource)
	{
		executeScript(_scriptResource, false, null);
	}

	public void executeScript(String _scriptResource, boolean _timeScript)
	{
		executeScript(_scriptResource, _timeScript, null);
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResource the _script resource
	 * @param _timeScript the _time script
	 * @param _context the _context
	 */
	public void executeScript(String _scriptResource, boolean _timeScript, Context _context)
	{
		Context context = (_context == null) ? createContext() : _context;
		
		long startTime = 0l;

		try
		{
			if (getScope() == null)
			{
				resetScope(context);
			}
			
			for (String key: getBindingsMap().keySet())
			{
				Object object = Context.javaToJS(getBindingsMap().get(key), getScope());
				ScriptableObject.putProperty(getScope(), key, object);
			}

			if (_timeScript == true)
			{
				startTime = System.currentTimeMillis();
			}

			scriptStack.add(_scriptResource);
			executeHandler(_scriptResource, context);

			if (_timeScript == true)
			{
				long total = System.currentTimeMillis() - startTime;
				log.info("Handler: " + _scriptResource + " took this many milliseconds to run: " + total);
			}
		}
		catch(RuntimeException h)
		{
			throw h;
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to execute handler for this reason: " + t.toString(), t);
		}
		finally
		{
			if (_context == null) { context.exit(); }
		}
	}

	public void executeScript(String[] _scriptResources)
	{
		executeScript(_scriptResources, false, null);
	}

	public void executeScript(String[] _scriptResources, boolean _timeScript)
	{
		executeScript(_scriptResources, _timeScript, null);
	}

	public void executeScript(String[] _scriptResources, boolean _timeScripts, Context _context)
	{
		Context context = (_context == null) ? createContext() : _context;
		long startTime = 0l;
		
		Object result = null;
		int i = 0;

		try
		{
			if (getScope() == null)
			{
				resetScope(context);
			}

			for (String key: getBindingsMap().keySet())
			{
				Object object = Context.javaToJS(getBindingsMap().get(key), getScope());
				ScriptableObject.putConstProperty(getScope(), key, object);
			}

			for (i = 0; i < _scriptResources.length; i++)
			{
				if (_timeScripts)
				{
					startTime = System.currentTimeMillis();
				}

				scriptStack.add(_scriptResources[i]);
				executeHandler(_scriptResources[i], context);
				
				if (_timeScripts)
				{
					long total = System.currentTimeMillis() - startTime;
					log.info("Handler: " + _scriptResources[i] + " took this many milliseconds to run: " + total);
				}
			}
		}

		catch(RuntimeException h)
		{
			throw h;
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to execute handler for this reason: " + t.toString(), t);
		}
		finally
		{
			if (_context == null) { context.exit(); }
		}
	}

	/**
	 * Creates the context.
	 *
	 * @return the context
	 */
	public Context createContext()
	{
		//Do not try to manage the context ... as it is managed by
		//Rhino already.  Trying to check to see is the current context
		//is used and using that instead will circumvent Rhino context
		//context counting mechanism.  This could lead to strange issues
		//popping up like disappearing object references and staying up
		//late at night :) ... Bediako 06/18/2011 5:49 am.
		
		Context context = (new ContextFactory()).enterContext();
		context.setLanguageVersion(180);
		context.setOptimizationLevel(-1);   //in app engine it turns out that interpreted mode is fastest for handler execution.

		return context;
	}

	public static String convertStreamToString(java.io.InputStream is)
	{
		java.util.Scanner s = new java.util.Scanner(is, "UTF-8").useDelimiter("\\A");
		return s.hasNext() ? s.next() : "";
	}

	private void executeHandler(String _scriptResource, Context _context)
	{
		try
		{
			String scriptResource = "/" + _scriptResource.replaceAll("^/", "");
			String requireHandler = "var handle = function(_WEB_CONTEXT) { var web = require('airlift/web').create(_WEB_CONTEXT); require(\"" + scriptResource.replaceAll(".js$", "") + "\").handle(web); }";
			
			Require require = new Require(getScope(), sharedRequire, getBindingsMap(), this.cacheScript);
			require.install(getScope());
			
			// Now evaluate the string we've collected. We'll ignore
			// the result.
			_context.evaluateString(getScope(), requireHandler, scriptResource, 1, null);

			Object handle = getScope().get("handle", getScope());
			java.util.ArrayList argumentList = new java.util.ArrayList();

			Scriptable webContext = _context.newObject(getScope());

			for (String key: this.bindingsMap.keySet())
			{
				Object object = Context.javaToJS(this.bindingsMap.get(key), getScope());
				ScriptableObject.putConstProperty(webContext, key, object);
			}

			argumentList.add(webContext);
			Object[] arguments = argumentList.toArray();
			
			((Function)handle).call(_context, getScope(), getScope(), arguments);
		}
		finally
		{
		}
	}

	/**
	 * Reset scope.
	 *
	 * @param _context the _context
	 */
	public void resetScope(Context _context)
	{
		Scriptable scriptable = _context.newObject(sharedScope);
		scriptable.setPrototype(sharedScope);
		scriptable.setParentScope(null);
		setScope(scriptable);
	}
}