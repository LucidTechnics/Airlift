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

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.util.Map;

import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.SimpleBindings;
import javax.script.SimpleScriptContext;

// TODO: Auto-generated Javadoc
/**
 * The Class ScriptingUtil.
 */
public class ScriptingUtil
{
    
    /** The type. */
    private String type;
    
    /** The script engine manager. */
    private ScriptEngineManager scriptEngineManager;
    
    /** The script engine. */
    private ScriptEngine scriptEngine;
    
    /** The script context. */
    private ScriptContext scriptContext;

    /**
     * Gets the type.
     *
     * @return the type
     */
    private String getType() { return type; }
    
    /**
     * Gets the script engine manager.
     *
     * @return the script engine manager
     */
    private ScriptEngineManager getScriptEngineManager() { return scriptEngineManager; }
    
    /**
     * Gets the script engine.
     *
     * @return the script engine
     */
    private ScriptEngine getScriptEngine() { return scriptEngine; }
    
    /**
     * Gets the script context.
     *
     * @return the script context
     */
    private ScriptContext getScriptContext() { return scriptContext; }
    
    /**
     * Sets the type.
     *
     * @param _type the new type
     */
    public void setType(String _type) { type = _type; }
    
    /**
     * Sets the script engine manager.
     *
     * @param _scriptEngineManager the new script engine manager
     */
    public void setScriptEngineManager(ScriptEngineManager _scriptEngineManager) { scriptEngineManager = _scriptEngineManager; }
    
    /**
     * Sets the script engine.
     *
     * @param _scriptEngine the new script engine
     */
    public void setScriptEngine(ScriptEngine _scriptEngine) { scriptEngine = _scriptEngine; }
    
    /**
     * Sets the script context.
     *
     * @param _scriptContext the new script context
     */
    public void setScriptContext(ScriptContext _scriptContext) { scriptContext = _scriptContext; }
    
    /**
     * Instantiates a new scripting util.
     */
    public ScriptingUtil()
    {
		this("js");
    }

    /**
     * Instantiates a new scripting util.
     *
     * @param _type the _type
     */
    public ScriptingUtil(String _type)
    {
		setType(_type);
		setScriptEngineManager(new ScriptEngineManager());
		setScriptEngine(scriptEngineManager.getEngineByExtension(_type));
    }

    /**
     * Inits the.
     *
     * @param _bindingsMap the _bindings map
     */
    public void init(Map _bindingsMap)
    {
		Bindings bindings = new SimpleBindings(_bindingsMap);

		setScriptContext(new SimpleScriptContext());
		getScriptContext().setBindings(bindings, ScriptContext.GLOBAL_SCOPE);
    }

    /**
     * Execute script.
     *
     * @param _scriptResource the _script resource
     * @return the object
     */
    public Object executeScript(String _scriptResource)
    {
		Object result = null;
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream inputStream = classLoader.getResourceAsStream(_scriptResource);

		if (inputStream == null)
		{
			throw new RuntimeException("Unable to find script resource using classloader getResourceAsStream(). Is this resource: " + _scriptResource + " in the application's classpath?");
		}

		Reader reader = new InputStreamReader(inputStream);

		try
		{
			result = scriptEngine.eval(reader, getScriptContext());
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to execute resource: " + _scriptResource, t);
		}

		return result;
		}

		/**
		 * Execute.
		 *
		 * @param _script the _script
		 * @return the object
		 */
		public Object execute(String _script)
		{
		if (_script == null)
		{
			throw new RuntimeException("Unable to execute null script");
		}

		Object result = null;
		Reader reader = new StringReader(_script);

		try
		{
			result = scriptEngine.eval(reader, getScriptContext());
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to execute script: " + _script, t);
		}

		return result;
    }
}
