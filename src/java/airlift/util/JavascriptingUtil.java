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
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * The Class JavascriptingUtil provides javascript scripting functionality.
 */
public class JavascriptingUtil
{
	
	/** The log. */
	private static Logger log = Logger.getLogger(JavascriptingUtil.class.getName());

	/** The Constant scriptResourceMap. */
	private static final Map<String, Script> scriptResourceMap = new HashMap<String, Script>();
	
	/** The bindings map. */
	private Map<String, Object> bindingsMap;
	
	/** The scope. */
	private Scriptable scope;
	
	/** The Constant sharedScope. */
	private static final ScriptableObject sharedScope;
	
	/** The compile script. */
	private boolean compileScript = true;

	/**
	 * Gets the script resource map.
	 *
	 * @return the script resource map
	 */
	private Map<String, Script> getScriptResourceMap() { return scriptResourceMap; }
	
	/**
	 * Gets the bindings map.
	 *
	 * @return the bindings map
	 */
	private Map<String, Object> getBindingsMap() { return bindingsMap; }
	
	/**
	 * Gets the scope.
	 *
	 * @return the scope
	 */
	private Scriptable getScope() { return scope; }

	/**
	 * Sets the bindings map.
	 *
	 * @param _bindingsMap the _bindings map
	 */
	public void setBindingsMap(Map<String, Object> _bindingsMap) { bindingsMap = _bindingsMap; }
	
	/**
	 * Sets the scope.
	 *
	 * @param _scope the new scope
	 */
	public void setScope(Scriptable _scope) { scope = _scope; }

	/** The script stack. */
	public java.util.List scriptStack = new java.util.ArrayList();

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
		setBindingsMap(new HashMap<String, Object>());
    }

	/**
	 * Instantiates a new javascripting util.
	 *
	 * @param _compileScript the _compile script
	 */
	public JavascriptingUtil(boolean _compileScript)
	{
		this();
		compileScript = _compileScript;
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

	/**
	 * Load script.
	 *
	 * @param _scriptResource the _script resource
	 */
	public void loadScript(String _scriptResource)
	{
		try
		{
			if (Context.getCurrentContext() == null)
			{
				throw new RuntimeException("Cannot use loadScript outside of the scope of a call to executeScript.  A context must be present.");
			}
			
			scriptStack.add(_scriptResource);
			compileScript(_scriptResource).exec(Context.getCurrentContext(), getScope());

		}
		catch(Throwable t)
		{
			t.printStackTrace();
			log.severe(t.toString());
			throw new RuntimeException(t);
		}
	}

	/**
	 * Find script.
	 *
	 * @param _scriptResource the _script resource
	 * @return the input stream
	 */
	private InputStream findScript(String _scriptResource)
	{
		InputStream inputStream = null;
		String scriptResource = _scriptResource.replaceAll("^/", "");

		try
		{
			inputStream = airlift.util.JavascriptingUtil.class.getResourceAsStream("/" + scriptResource);
		}
		catch(Throwable t)
		{

			throw new RuntimeException(t);
		}

		if (inputStream == null)
		{
			log.severe("Cannot find script: " + scriptResource);
			throw new airlift.servlet.rest.HandlerException("Unable to find script resource using classloader getResourceAsStream(). Is this resource: " + _scriptResource + " in the application's classpath?",
				airlift.servlet.rest.HandlerException.ErrorCode.HANDLER_NOT_FOUND);
		}

		return inputStream;
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResource the _script resource
	 * @return the object
	 */
	public Object executeScript(String _scriptResource)
	{
		return executeScript(_scriptResource, false, null);
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResource the _script resource
	 * @param _timeScript the _time script
	 * @return the object
	 */
	public Object executeScript(String _scriptResource, boolean _timeScript)
	{
		return executeScript(_scriptResource, _timeScript, null);
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResource the _script resource
	 * @param _timeScript the _time script
	 * @param _context the _context
	 * @return the object
	 */
	public Object executeScript(String _scriptResource, boolean _timeScript, Context _context)
	{
		Context context = (_context == null) ? createContext() : _context;
		
		long startTime = 0l;
		Object result = null;

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
			result = compileScript(_scriptResource).exec(context, getScope());

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

		return result;
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResources the _script resources
	 * @return the object
	 */
	public Object executeScript(String[] _scriptResources)
	{
		return executeScript(_scriptResources, false, null);
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResources the _script resources
	 * @param _timeScript the _time script
	 * @return the object
	 */
	public Object executeScript(String[] _scriptResources, boolean _timeScript)
	{
		return executeScript(_scriptResources, _timeScript, null);
	}

	/**
	 * Execute script.
	 *
	 * @param _scriptResources the _script resources
	 * @param _timeScripts the _time scripts
	 * @param _context the _context
	 * @return the object
	 */
	public Object executeScript(String[] _scriptResources, boolean _timeScripts, Context _context)
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
				result = compileScript(_scriptResources[i]).exec(context, getScope());
				
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

		return result;
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
		context.setLanguageVersion(170);

		log.info("Using context: " + context); 
		
		return context;
	}

	/**
	 * Compile script.
	 *
	 * @param _scriptResource the _script resource
	 * @return the script
	 */
	public Script compileScript(String _scriptResource)
	{
		Script script = null;
		Reader reader = null;
		
		try
		{
			//I do not think it is necessary to place the scripts in
			//memcache because this will make it more difficult to
			//manage with regards to cache expiration ...
			//Instead place it in a static map that will be available
			//on the instance level.  If a new instance is started the
			//cache will be empty ... but this is OK because after
			//running for a few seconds the cache will be full ... 
			
			if (getScriptResourceMap().containsKey(_scriptResource) == false)
			{
				log.info("Script not compiled and cached: " + _scriptResource);
				reader = new InputStreamReader(findScript(_scriptResource));

				try
				{

					/**
					 ** I discovered that a script object extends
					 ** org.mozilla.javascript.NativeFunction
					 ** which in itself is java.io.Serializable.
					 **
					 ** This probably means we can cast the script to a
					 ** NativeFunction (if the super class of the
					 ** object is a NativeFunction) then we can stick
					 ** that object in memcache using the Memcache
					 ** service directly.
					 ** 
					 **/
					
					script = Context.getCurrentContext().compileReader(reader, _scriptResource, 0, null);

					if ("org.mozilla.javascript.NativeFunction".equalsIgnoreCase(script.getClass().getSuperclass().getName()) == true)
					{
						org.mozilla.javascript.NativeFunction nativeFunction = (org.mozilla.javascript.NativeFunction) script;
						com.google.appengine.api.memcache.MemcacheService cache = com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();

						try
						{
							log.info("caching this script: " + _scriptResource);
							cache.put(_scriptResource, nativeFunction, com.google.appengine.api.memcache.Expiration.byDeltaSeconds(600));
						}
						catch(Throwable t)
						{
							log.warning("Unable to place key: " + _scriptResource + " with its value: " + nativeFunction + " in the cache.");
						}
					}
				}
				catch(Throwable t)
				{
					throw new RuntimeException(t);
				}

				if (this.compileScript == true)
				{
					log.info("Caching compiled script: " + _scriptResource);
					
					synchronized(getScriptResourceMap())
					{
						getScriptResourceMap().put(_scriptResource, script);
					}
				}
			}
			else
			{
				script = getScriptResourceMap().get(_scriptResource);
			}
		}
		finally
		{
			if (reader != null) { try { reader.close(); } catch(Throwable t) {} }
		}

		return script;
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