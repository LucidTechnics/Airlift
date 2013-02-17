/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package airlift.util;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import org.mozilla.javascript.BaseFunction;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import org.mozilla.javascript.commonjs.module.ModuleScript;
import org.mozilla.javascript.commonjs.module.ModuleScriptProvider;
import org.mozilla.javascript.commonjs.module.provider.CachingModuleScriptProviderBase;
import org.mozilla.javascript.commonjs.module.ModuleScope;

/**
 * Implements the require() function as defined by
 * <a href="http://wiki.commonjs.org/wiki/Modules/1.1">Common JS modules</a>.
 * <h1>Thread safety</h1>
 * You will ordinarily create one instance of require() for every top-level
 * scope. This ordinarily means one instance per program execution, except if
 * you use shared top-level scopes and installing most objects into them.
 * Module loading is thread safe, so using a single require() in a shared
 * top-level scope is also safe.
 * <h1>Creation</h1>
 * If you need to create many otherwise identical require() functions for
 * different scopes, you might want to use {@link RequireBuilder} for
 * convenience.
 * <h1>Making it available</h1>
 * In order to make the require() function available to your JavaScript
 * program, you need to invoke either {@link #install(Scriptable)} or
 * {@link #requireMain(Context, String)}.
 * @author Attila Szegedi
 * @version $Id: Require.java,v 1.4 2011/04/07 20:26:11 hannes%helma.at Exp $
 */
public class Require extends BaseFunction
{
    private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(Require.class.getName());
    private final Map<String, Object> bindings;
	private SharedRequire require;
	private boolean cachingEnabled = true;
	
    /**
     * Creates a new instance of the require() function. Upon constructing it,
     * you will either want to install it in the global (or some other) scope
     * using {@link #install(Scriptable)}, or alternatively, you can load the
     * program's main module using {@link #requireMain(Context, String)} and
     * then act on the main module's exports.
     * @param cx the current context
     * @param nativeScope a scope that provides the standard native JavaScript
     * objects.
     * @param moduleScriptProvider a provider for module scripts
     * @param preExec an optional script that is executed in every module's
     * scope before its module script is run.
     * @param postExec an optional script that is executed in every module's
     * scope after its module script is run.
     * @param sandboxed if set to true, the require function will be sandboxed.
     * This means that it doesn't have the "paths" property, and also that the
     * modules it loads don't export the "module.uri" property.
     */
	public Require(Scriptable _nativeScope, SharedRequire _require, Map<String, Object> _bindings, boolean _cachingEnabled)
	{
		require = _require;
		bindings = _bindings;
		cachingEnabled = _cachingEnabled;
		setPrototype(ScriptableObject.getFunctionPrototype(_nativeScope));
    }

    /**
     * Binds this instance of require() into the specified scope under the
     * property name "require".
     * @param scope the scope where the require() function is to be installed.
     */
    public void install(Scriptable scope) {
        ScriptableObject.putProperty(scope, "require", this);
    }

    public Object call(Context cx, Scriptable scope, Scriptable thisObj,
            Object[] args)
	{
        if(args == null || args.length < 1) {
            throw ScriptRuntime.throwError(cx, scope,
                    "require() needs one argument");
        }

        String id = (String)Context.jsToJava(args[0], String.class);
        URI uri = null;
        URI base = null;

		if (id.startsWith("./") || id.startsWith("../"))
		{
            if (!(thisObj instanceof ModuleScope)) {
                throw ScriptRuntime.throwError(cx, scope,
                        "Can't resolve relative module ID \"" + id +
                                "\" when require() is used outside of a module");
            }

            ModuleScope moduleScope = (ModuleScope) thisObj;
            base = moduleScope.getBase();
            URI current = moduleScope.getUri();
            uri = current.resolve(id);

            if (base == null) {
                // calling module is absolute, resolve to absolute URI
                // (but without file extension)
                id = uri.toString();
            } else {
                // try to convert to a relative URI rooted on base
                id = base.relativize(current).resolve(id).toString();
                if (id.charAt(0) == '.') {
                    // resulting URI is not contained in base,
                    // throw error or make absolute depending on sandbox flag.
                    if (this.require.sandboxed) {
                        throw ScriptRuntime.throwError(cx, scope,
                            "Module \"" + id + "\" is not contained in sandbox.");
                    } else {
                        id = uri.toString();
                    }
                }
            }
		}
		
		Scriptable exportedModuleInterface = require.getExportedModuleInterface(this, cx, id, uri, base, false, this.cachingEnabled);

		if (id != null && id.contains("extlib/") == false)
		{
			Scriptable webContext = cx.newObject(scope);

			for (String key: this.bindings.keySet())
			{
				Object object = Context.javaToJS(this.bindings.get(key), scope);
				ScriptableObject.putConstProperty(webContext, key, object);
			}

			ScriptableObject.putConstProperty(exportedModuleInterface, "WEB_CONTEXT", webContext);
			
			Object log = Context.javaToJS(java.util.logging.Logger.getLogger(id), scope);
			ScriptableObject.putConstProperty(exportedModuleInterface, "LOG", log);
		}

		return exportedModuleInterface;
    }

	@Override
    public Scriptable construct(Context cx, Scriptable scope, Object[] args) {
        throw ScriptRuntime.throwError(cx, scope,
                "require() can not be invoked as a constructor");
    }

    @Override
    public String getFunctionName() {
        return "require";
    }

    @Override
    public int getArity() {
        return 1;
    }

    @Override
    public int getLength() {
        return 1;
    }
}