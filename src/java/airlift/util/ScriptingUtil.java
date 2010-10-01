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
import java.io.StringReader;
import java.util.Map;

import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.SimpleBindings;
import javax.script.SimpleScriptContext;

public class ScriptingUtil
{
    private String type;
    private ScriptEngineManager scriptEngineManager;
    private ScriptEngine scriptEngine;
    private ScriptContext scriptContext;

    private String getType() { return type; }
    private ScriptEngineManager getScriptEngineManager() { return scriptEngineManager; }
    private ScriptEngine getScriptEngine() { return scriptEngine; }
    private ScriptContext getScriptContext() { return scriptContext; }
    
    public void setType(String _type) { type = _type; }
    public void setScriptEngineManager(ScriptEngineManager _scriptEngineManager) { scriptEngineManager = _scriptEngineManager; }
    public void setScriptEngine(ScriptEngine _scriptEngine) { scriptEngine = _scriptEngine; }
    public void setScriptContext(ScriptContext _scriptContext) { scriptContext = _scriptContext; }
    
    public ScriptingUtil()
    {
		this("js");
    }

    public ScriptingUtil(String _type)
    {
		setType(_type);
		setScriptEngineManager(new ScriptEngineManager());
		setScriptEngine(scriptEngineManager.getEngineByExtension(_type));
    }

    public void init(Map _bindingsMap)
    {
		Bindings bindings = new SimpleBindings(_bindingsMap);

		setScriptContext(new SimpleScriptContext());
		getScriptContext().setBindings(bindings, ScriptContext.GLOBAL_SCOPE);
    }

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
