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

import org.mozilla.javascript.BaseFunction;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import org.mozilla.javascript.commonjs.module.ModuleScriptProvider;
import org.mozilla.javascript.commonjs.module.ModuleScript;
import org.mozilla.javascript.commonjs.module.ModuleScope;

import java.util.logging.Logger;

/**
 * Implements the require() function as defined by
 * <a href="http://wiki.commonjs.org/wiki/Modules/1.1">Common JS modules</a>.
 * <h1>Thread safety</h1>
 * You will ordinarily create one instance of require() for every top-level
 * scope. This ordinarily means one instance per program execution, except if
 * you use shared top-level scopes and installing most objects into them.
 * Module loading is thread safe, as we are getting these modules from
 * either the jar file and are writing them to memcache
 * so using a single require() in a shared
 * top-level scope is also safe.
 * <h1>Creation</h1>
 * If you need to create many otherwise identical require() functions for
 * different scopes, you might want to use {@link RequireBuilder} for
 * convenience.
 * <h1>Making it available</h1>
 * In order to make the require() function available to your JavaScript
 * program, you need to invoke {@link #install(Scriptable)}.
 * @author Bediako George
 */
public class Require
   extends BaseFunction
{
    private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(Require.class.getName());
	
    private final ModuleScriptProvider moduleScriptProvider;
    private final Scriptable nativeScope;
    private final Scriptable paths;
    private final boolean sandboxed;
    private final Script preExec;
    private final Script postExec;
    private String mainModuleId = null;
    private Scriptable mainExports;

	// Modules currently being loaded on the thread. Used to resolve circular
	// dependencies while loading.
	private static final ThreadLocal<Map<String, Scriptable>> loadingModuleInterfaces = new ThreadLocal<Map<String,Scriptable>>();

    /**
     * Creates a new instance of the require() function. Upon constructing it,
     * you will either want to install it in the global (or some other) scope
     * using {@link #install(Scriptable)}, or alternatively, you can load the
     * program's main module using {@link #requireMain(Context, String)} and
     * then act on the main module's export.s
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
	public Require(Context _context, Scriptable _nativeScope, ModuleScriptProvider _moduleScriptProvider,
				   Script _preExec, Script _postExec, boolean _sandboxed)
	{
		this.moduleScriptProvider = _moduleScriptProvider;
		this.nativeScope = _nativeScope;
		this.sandboxed = _sandboxed;
		this.preExec = _preExec;
		this.postExec = _postExec;
		setPrototype(ScriptableObject.getFunctionPrototype(_nativeScope));

		if(!sandboxed)
		{
			paths = _context.newArray(_nativeScope, 0);
			defineReadOnlyProperty(this, "paths", paths);
		}
		else
		{
			paths = null;
		}
    }

    /**
     * This method is not implemented for Airlift's App Engine version
     * of require.  Use {@link #install(Scriptable)} instead.
     * 
     * Calling this method establishes a module as being the main module of the
     * program to which this require() instance belongs. The module will be
     * loaded as if require()'d and its "module" property will be set as the
     * "main" property of this require() instance. You have to call this method
     * before the module has been loaded (that is, the call to this method must
     * be the first to require the module and thus trigger its loading). Note
     * that the main module will execute in its own scope and not in the global
     * scope. Since all other modules see the global scope, executing the main
     * module in the global scope would open it for tampering by other modules.
     * @param cx the current context
     * @param mainModuleId the ID of the main module
     * @return the "exports" property of the main module
     * @throws IllegalStateException if the main module is already loaded when
     * required, or if this require() instance already has a different main
     * module set.
     */
	public Scriptable requireMain(Context _context, String _mainModuleId)
	{
		throw new RuntimeException("not implemented in Airlift's App Engine version of require");
    }

	@Override
    public Object call(Context _context, Scriptable _scope, Scriptable _thisObj, Object[] _args)
	{
		log.info("require is running this scope object: " + _scope.getIds().length);
		
		if(_args == null || _args.length < 1)
		{
            throw ScriptRuntime.throwError(_context, _scope, "require() needs one argument");
        }

		String id = (String)Context.jsToJava(_args[0], String.class);
		
        URI uri = null;
        URI base = null;

		if (id.startsWith("./") || id.startsWith("../"))
		{
			if (!(_thisObj instanceof ModuleScope))
			{
                throw ScriptRuntime.throwError(_context, _scope,
                        "Can't resolve relative module ID \"" + id +
                                "\" when require() is used outside of a module");
            }

            ModuleScope moduleScope = (ModuleScope) _thisObj;
            base = moduleScope.getBase();
            URI current = moduleScope.getUri();
            uri = current.resolve(id);

            if (base == null) {
                // calling module is absolute, resolve to absolute URI
                // (but without file extension)
                id = uri.toString();
			}
			else
			{
                // try to convert to a relative URI rooted on base
                id = base.relativize(current).resolve(id).toString();

				if (id.charAt(0) == '.')
				{
                    // resulting URI is not contained in base,
                    // throw error or make absolute depending on sandbox flag.
					if (sandboxed)
					{
                        throw ScriptRuntime.throwError(_context, _scope, "Module \"" + id + "\" is not contained in sandbox.");
					}
					else
					{
                        id = uri.toString();
                    }
                }
            }
		}
		
        return getExportedModuleInterface(_context, _scope, id, uri, base, false);
    }

	private Scriptable deserialize(byte[] _scriptableBytes, Scriptable _scope)
	{
		Scriptable scriptable = null;
		java.io.ByteArrayInputStream byteArrayInputStream = null;
		org.mozilla.javascript.serialize.ScriptableInputStream input = null;

		if (_scriptableBytes != null)
		{
			try
			{
				byteArrayInputStream = new java.io.ByteArrayInputStream(_scriptableBytes);
				input = new org.mozilla.javascript.serialize.ScriptableInputStream(byteArrayInputStream, _scope);
				scriptable = (Scriptable) input.readObject();
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
			finally
			{
				try { if (input != null) { input.close(); } } catch (Throwable t) { log.warning("Error encountered closing scriptable input stream"); }
				try { if (byteArrayInputStream != null) { byteArrayInputStream.close(); } } catch (Throwable t) { log.warning("Error encountered closing byte array input stream"); }
			}
		}
			
		return scriptable;
	}

	private byte[] serialize(Scriptable _scriptable, Scriptable _scope)
	{
		java.io.ByteArrayOutputStream byteArrayOutputStream = new java.io.ByteArrayOutputStream();
		org.mozilla.javascript.serialize.ScriptableOutputStream output = null;

		try
		{
			output = new org.mozilla.javascript.serialize.ScriptableOutputStream(byteArrayOutputStream, _scope);
			output.writeObject(_scriptable);
		}
		catch (Throwable t)
		{
			throw new RuntimeException(t);
		}
		finally
		{
			try { if (output != null) { output.close(); } } catch (Throwable t) { log.warning("Error encountered closing scriptable output stream"); }
			try { if (byteArrayOutputStream != null) { byteArrayOutputStream.close(); } } catch (Throwable t) { log.warning("Error encountered closing byte array output stream"); }
		}

		return (byteArrayOutputStream != null) ? byteArrayOutputStream.toByteArray() : null;
	}

    private Scriptable getExportedModuleInterface(Context _context, Scriptable _scope, String _id, URI _uri, URI _base, boolean _isMain)
	{
		com.google.appengine.api.memcache.MemcacheService cache = com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
		// Check if the requested module is already completely loaded
		// Check memcache for the module ...
		//Scriptable exports = this.deserialize((byte[])cache.get(_id), _scope);
		Scriptable exports = null;
		
		if (exports != null)
		{
			if (_isMain)
			{
                throw new IllegalStateException("Attempt to set main module after it was loaded");
			}
			
            return exports;
		}
		
        // Check if it is currently being loaded on the current thread
        // (supporting circular dependencies).
        Map<String, Scriptable> threadLoadingModules = loadingModuleInterfaces.get();

		if (threadLoadingModules != null)
		{
            exports = threadLoadingModules.get(_id);

			if (exports != null)
			{
                return exports;
            }
		}
		
        // The requested module is neither already loaded, nor is it being
        // loaded on the current thread. End of fast path.

		//load memcache with the module
		
        // Nope, still not loaded; we're loading it then.
		final ModuleScript moduleScript = getModule(_context, _id, _uri, _base);

		if (sandboxed && !moduleScript.isSandboxed())
		{
			throw ScriptRuntime.throwError(_context, nativeScope, "Module \"" + _id + "\" is not contained in sandbox.");
		}

		exports = _context.newObject(nativeScope);

		// Are we the outermost locked invocation on this thread?
        final boolean outermostLocked = (threadLoadingModules == null);

		if (outermostLocked)
		{
			threadLoadingModules = new HashMap<String, Scriptable>();
			loadingModuleInterfaces.set(threadLoadingModules);
        }

		// Must make the module exports available immediately on the
		// current thread, to satisfy the CommonJS Modules/1.1 requirement
		// that "If there is a dependency cycle, the foreign module may not
		// have finished executing at the time it is required by one of its
		// transitive dependencies; in this case, the object returned by
		// "require" must contain at least the exports that the foreign
		// module has prepared before the call to require that led to the
		// current module's execution."

		threadLoadingModules.put(_id, exports);

		try
		{
			// Support non-standard Node.js feature to allow modules to
			// replace the exports object by setting module.exports.
			Scriptable newExports = executeModuleScript(_context, _scope, _id, exports, moduleScript, _isMain);

			if (exports != newExports)
			{
				threadLoadingModules.put(_id, newExports);
				exports = newExports;
			}
		}
		catch(RuntimeException e)
		{
			// Throw loaded module away if there was an exception
			threadLoadingModules.remove(_id);
			throw e;
		}
		finally
		{
			if(outermostLocked)
			{
				// Make loaded modules visible to other threads only after
				// the topmost triggering load has completed. This strategy
				// (compared to the one where we'd make each module
				// globally available as soon as it loads) prevents other
				// threads from observing a partially loaded circular
				// dependency of a module that completed loading.

				/*java.util.Map<String, byte[]> serializedModules = new java.util.HashMap<String, byte[]>();

				for (String id: threadLoadingModules.keySet())
				{
					Scriptable loadedModule = threadLoadingModules.get(id);
					serializedModules.put(id, serialize(loadedModule, _scope));
				}
				
				cache.putAll(serializedModules);*/
			}
		}
		
        return exports;
    }

	private static void executeOptionalScript(Script script, Context cx,
											  Scriptable executionScope)
	{
		if(script != null) {
			script.exec(cx, executionScope);
		}
	}

	private static void defineReadOnlyProperty(ScriptableObject obj,
											   String name, Object value) {
		ScriptableObject.putProperty(obj, name, value);
		obj.setAttributes(name, ScriptableObject.READONLY | ScriptableObject.PERMANENT);
	}

	/**
     * Binds this instance of require() into the specified scope under the
     * property name "require".
     * @param scope the scope where the require() function is to be installed.
     */
	public void install(Scriptable scope)
	{
		ScriptableObject.putProperty(scope, "require", this);
	}
	
    private Scriptable executeModuleScript(Context _context, Scriptable _scope, String _id, Scriptable _exports, ModuleScript _moduleScript, boolean _isMain)
    {
		final ScriptableObject moduleObject = (ScriptableObject)_context.newObject(nativeScope);
		
        URI uri = _moduleScript.getUri();
		URI base = _moduleScript.getBase();
		
		defineReadOnlyProperty(moduleObject, "id", _id);
		
        if (!sandboxed) { defineReadOnlyProperty(moduleObject, "uri", uri.toString()); }
		
        final Scriptable executionScope = new ModuleScope(nativeScope, uri, base);
        // Set this so it can access the global JS environment objects.
        // This means we're currently using the "MGN" approach (ModuleScript
        // with Global Natives) as specified here:
        // <http://wiki.commonjs.org/wiki/Modules/ProposalForNativeExtension>
        executionScope.put("exports", executionScope, _exports);
        executionScope.put("module", executionScope, moduleObject);
		moduleObject.put("exports", moduleObject, _exports);
		
        install(executionScope);

		if (_isMain) { defineReadOnlyProperty(this, "main", moduleObject); }
		
        executeOptionalScript(preExec, _context, executionScope);
        _moduleScript.getScript().exec(_context, executionScope);
        executeOptionalScript(postExec, _context, executionScope);

		//return ScriptRuntime.toObject(nativeScope,
		//ScriptableObject.getProperty(moduleObject, "exports"));
		return ScriptRuntime.toObject(_scope, ScriptableObject.getProperty(moduleObject, "exports"));
    }

	
	private ModuleScript getModule(Context _context, String _id, URI _uri, URI _base)
	{
		try
		{
			log.info("getting module script identified by: " + _id + " with uri: " + _uri + " and base: " + _base + " and paths: " + paths);
            final ModuleScript moduleScript = moduleScriptProvider.getModuleScript(_context, _id, _uri, _base, paths);
			if (moduleScript == null) { throw ScriptRuntime.throwError(_context, nativeScope, "Module \"" + _id + "\" not found."); }
            return moduleScript;
        }
		catch(RuntimeException e)
		{
            throw e;
        }
		catch(Throwable t)
		{
            throw Context.throwAsScriptRuntimeEx(t);
        }
    }
}