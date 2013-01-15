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

public class JavascriptingUtil
{
	private static Logger log = Logger.getLogger(JavascriptingUtil.class.getName());

	private Map<String, Object> bindingsMap;
	private Scriptable scope;
	private static final ScriptableObject sharedScope;
	
	private Map<String, Object> getBindingsMap() { return bindingsMap; }
	private Scriptable getScope() { return scope; }
	public void setBindingsMap(Map<String, Object> _bindingsMap) { bindingsMap = _bindingsMap; }
	public void setScope(Scriptable _scope) { scope = _scope; }
	
	public java.util.List scriptStack = new java.util.ArrayList();
	private boolean cacheScript = false;

	static
	{
		log.info("running static");
		Context context = (new ContextFactory()).enterContext();
		
		try
		{
			sharedScope = context.initStandardObjects();
			//Cannot seem to safely execute scripts to be made available at the
			//shared scope level. :(   Never mind ... eliminating the
			//initStandardObjects call over and over saves quite a bit
			//of time on its own ...
		}
		finally
		{
			log.info("Closing static context");
			context.exit();
			log.info("Done closing static context");
		}
	}
	
    /**
     * Instantiates a new javascripting util.
     */
    public JavascriptingUtil()
	{
		this.cacheScript = false;
		setBindingsMap(new HashMap<String, Object>());
	}

	public JavascriptingUtil(boolean _cacheScript)
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

			log.info("script is running this scope object: " + getScope().getIds().length);

			if (_timeScript == true)
			{
				startTime = System.currentTimeMillis();
			}

			scriptStack.add(_scriptResource);
			executeHandler(_scriptResource, context);

			if (_timeScript == true)
			{
				long total = System.currentTimeMillis() - startTime;
				log.info("Script: " + _scriptResource + " took this many milliseconds to run: " + total);
			}
		}
		catch(RuntimeException h)
		{
			throw h;
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to execute script: " + _scriptResource + " for this reason: " + t.toString(), t);
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
				ScriptableObject.putProperty(getScope(), key, object);
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
					log.info("Script: " + _scriptResources[i] + " took this many milliseconds to run: " + total);
				}
			}
		}

		catch(RuntimeException h)
		{
			throw h;
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to execute script: " + _scriptResources[i] + " for this reason: " + t.toString(), t);
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
		context.setOptimizationLevel(-1);

		log.info("Using context: " + context); 
		
		return context;
	}

	public static String convertStreamToString(java.io.InputStream is)
	{
		java.util.Scanner s = new java.util.Scanner(is, "UTF-8").useDelimiter("\\A");
		return s.hasNext() ? s.next() : "";
	}

	/**
	 * Compile script.
	 *
	 * @param _scriptResource the _script resource
	 * @return the script
	 */
	public void executeHandler(String _scriptResource, Context _context)
	{
		try
		{
			String scriptResource = "/" + _scriptResource.replaceAll("^/", "");
			String handler = "require(\"" + scriptResource.replaceAll(".js$", "") + "\").handle(CONTENT_CONTEXT, REQUEST, RESPONSE, LOG);";

			Object requireFunction = org.mozilla.javascript.ScriptableObject.getProperty(sharedScope, "require");
			
			if (requireFunction == org.mozilla.javascript.UniqueTag.NOT_FOUND)
			{
				log.info("loading require for the first time into the shared scope");
				
				java.util.Set uris = new java.util.HashSet();

				try
				{
					//Note that we are really not calling out to the
					//http ... we ultimately just use the path of this
					//URI to find the resource in the jar.
					uris.add(new java.net.URI("http://localhost:80/handler/"));
					uris.add(new java.net.URI("http://localhost:80/lib/"));
					uris.add(new java.net.URI("http://localhost:80/"));
					uris.add(new java.net.URI("http://localhost:80//airlift/lib/"));
					uris.add(new java.net.URI("http://localhost:80//"));
				}
				catch(Throwable t)
				{
					throw new RuntimeException(t);
				}

				log.info("************ Caching has value: " + this.cacheScript + "*******************");

				Require require = new Require(_context, sharedScope, new StrongCachingModuleScriptProvider(
					new UrlModuleSourceProvider(null, uris), this.cacheScript), null, null, false, this.cacheScript) ;
				require.install(sharedScope);
				log.info("require loaded for the first time into the shared scope");
			}
			else
			{
				log.info("require already loaded into shared scope: " + requireFunction.toString());
			}

			log.info("_scriptResource: " + _scriptResource);
			log.info("scriptResource: " + scriptResource);
			log.info("handle script: " + handler);

			// Now evaluate the string we've collected. We'll ignore the result.
			_context.evaluateString(getScope(), handler, scriptResource, 1, null);
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