/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.util;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class JavascriptingUtil
{
	private static Logger log = Logger.getLogger(JavascriptingUtil.class.getName());

	private static final Map<String, Script> scriptResourceMap = new HashMap<String, Script>();
	private Map<String, Object> bindingsMap;
	private Scriptable scope;
	private static final ScriptableObject sharedScope;
	private boolean compileScript = true;

	private Map<String, Script> getScriptResourceMap() { return scriptResourceMap; }
	private Map<String, Object> getBindingsMap() { return bindingsMap; }
	private Scriptable getScope() { return scope; }

	public void setBindingsMap(Map<String, Object> _bindingsMap) { bindingsMap = _bindingsMap; }
	public void setScope(Scriptable _scope) { scope = _scope; }

	static
	{
		log.info("running static");
		Context context = (new ContextFactory()).enterContext();
		
		try
		{
			sharedScope = context.initStandardObjects();

			String[] scriptResources = new String[4];

			scriptResources[0] = "/airlift/util/douglasCrockford.js";
			scriptResources[1] = "/airlift/util/json2.js";
			scriptResources[2] = "/airlift/util/util.js";
			scriptResources[3] = "/airlift/util/validate.js";

			for (int i = 0; i < scriptResources.length; i++)
			{
				try
				{
					InputStream inputStream = airlift.util.JavascriptingUtil.class.getResourceAsStream(scriptResources[i]);
					java.io.InputStreamReader reader = new InputStreamReader(inputStream);
					Script script = Context.getCurrentContext().compileReader(reader, scriptResources[i], 0, null);
					script.exec(Context.getCurrentContext(), sharedScope);
				}
				catch(Throwable t)
				{
					throw new RuntimeException(t);
				}
			}
		}
		finally
		{
			log.info("Closing static context");
			context.exit();
			log.info("Done closing static context");
		}
	}
	
    public JavascriptingUtil()
	{
		setBindingsMap(new HashMap<String, Object>());
    }

	public JavascriptingUtil(boolean _compileScript)
	{
		this();
		compileScript = _compileScript;
	}

    public void bind(String _name, Object _value)
    {
		getBindingsMap().put(_name, _value);
	}

	public void loadScript(String _scriptResource)
	{
		try
		{
			if (Context.getCurrentContext() == null)
			{
				throw new RuntimeException("Cannot use loadScript outside of the scope of a call to executeScript.  A context must be present.");
			}

			compileScript(_scriptResource).exec(Context.getCurrentContext(), getScope());
		}
		catch(Throwable t)
		{
			t.printStackTrace();
			log.severe(t.toString());
			throw new RuntimeException(t);
		}
	}

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

	public Object executeScript(String _scriptResource)
	{
		return executeScript(_scriptResource, false, null);
	}

	public Object executeScript(String _scriptResource, boolean _timeScript)
	{
		return executeScript(_scriptResource, _timeScript, null);
	}

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

	public Object executeScript(String[] _scriptResources)
	{
		return executeScript(_scriptResources, false, null);
	}

	public Object executeScript(String[] _scriptResources, boolean _timeScript)
	{
		return executeScript(_scriptResources, _timeScript, null);
	}

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

	public Context createContext()
	{
		Context context = null;
		
		if (Context.getCurrentContext() != null)
		{
			context = Context.getCurrentContext();
		}
		else
		{
			context = (new ContextFactory()).enterContext();
			context.setLanguageVersion(170);
		}

		return context;
	}

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
				log.info("Compiled script not cached: " + _scriptResource);
				reader = new InputStreamReader(findScript(_scriptResource));

				try
				{
					script = Context.getCurrentContext().compileReader(reader, _scriptResource, 0, null);
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

	public void resetScope(Context _context)
	{
		Scriptable scriptable = _context.newObject(sharedScope);
		scriptable.setPrototype(sharedScope);
		scriptable.setParentScope(null);
		setScope(scriptable);
	}
}