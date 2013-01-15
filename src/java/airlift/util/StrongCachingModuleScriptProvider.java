package airlift.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.mozilla.javascript.commonjs.module.ModuleScript;
import org.mozilla.javascript.commonjs.module.provider.CachingModuleScriptProviderBase;

/**
 * A module script provider that uses a module source provider to load modules
 * and caches the loaded modules. It strongly references the loaded modules,
 * thus a module once loaded will not be eligible for garbage collection before
 * the module provider itself becomes eligible.  This module script
 * provider will not cache modules when the enableCaching attribute is
 * false.
 * @author Bediako George
 * @version $Id: StrongCachingModuleScriptProvider.java,v 1.3 2011/04/07 20:26:12 hannes%helma.at Exp $
 */


public class StrongCachingModuleScriptProvider
//   extends
//   org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider
   extends CachingModuleScriptProviderBase
{
/*    private static final long serialVersionUID = 1L;
	private boolean enableCaching = false;
	
     * Creates a new module provider with the specified module source provider.
     * @param moduleSourceProvider provider for modules' source code
    public StrongCachingModuleScriptProvider(org.mozilla.javascript.commonjs.module.provider.ModuleSourceProvider moduleSourceProvider, boolean _enableCaching)
    {
		super(moduleSourceProvider);
		this.enableCaching = _enableCaching;
    }

    @Override
    protected void putLoadedModule(String _moduleId, org.mozilla.javascript.commonjs.module.ModuleScript _moduleScript, Object _validator)
	{
		System.out.println("Caching has this value: " + this.enableCaching);
		
		if (this.enableCaching == true)
		{
			System.out.println("Module caching is enabled");
			super.putLoadedModule(_moduleId, _moduleScript, _validator);
		}
	}*/

	private static final long serialVersionUID = 1L;
	private boolean enableCaching = false;
	private final Map<String, CachedModuleScript> modules =
		new ConcurrentHashMap<String, CachedModuleScript>(16, .75f, getConcurrencyLevel());

	/**
     * Creates a new module provider with the specified module source provider.
     * @param moduleSourceProvider provider for modules' source code
     */

	public StrongCachingModuleScriptProvider(org.mozilla.javascript.commonjs.module.provider.ModuleSourceProvider _moduleSourceProvider)
	{
		super(_moduleSourceProvider);
	}
	
	public StrongCachingModuleScriptProvider(org.mozilla.javascript.commonjs.module.provider.ModuleSourceProvider _moduleSourceProvider, boolean _enableCaching)
	{
		this(_moduleSourceProvider);
		this.enableCaching = _enableCaching;
	}

	@Override
	protected CachingModuleScriptProviderBase.CachedModuleScript getLoadedModule(String moduleId)
	{
		System.out.println("Halloween ... getting loaded module ... ");
		CachingModuleScriptProviderBase.CachedModuleScript cachedModuleScript = modules.get(moduleId);

		if (cachedModuleScript != null)
		{
			System.out.println("module script appears to be in the cache");
		}
		else
		{
			System.out.println("module script DOES NOT appear to be in the cache");
		}

		return cachedModuleScript;
	}

	@Override
	protected void putLoadedModule(String moduleId, org.mozilla.javascript.commonjs.module.ModuleScript moduleScript, Object validator)
	{
		System.out.println("Caching has this value: " + this.enableCaching);

		if (this.enableCaching == true)
		{
			System.out.println("Module caching is enabled");
			modules.put(moduleId, new CachingModuleScriptProviderBase.CachedModuleScript(moduleScript, validator));
		}
	}

}