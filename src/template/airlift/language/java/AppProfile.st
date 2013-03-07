package airlift.app;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

public class AppProfile
   implements airlift.AppProfile
{
	public static final java.util.Map<String, java.util.Map<String, java.util.Set<String>>> resourceSecurityMetadataMap = new java.util.HashMap<String, java.util.Map<String, java.util.Set<String>>>();
				
	static
	{		
		$resourceName : {d | resourceSecurityMetadataMap.put("$d$", new java.util.HashMap<String, java.util.Set<String>>()); }; separator="\n"$

		$methodResourceName, methodName: {r,m | resourceSecurityMetadataMap.get("$r$").put("$m$", new java.util.HashSet<String>()); }; separator="\n"$
			
		$roleResourceName, roleMethodName, roleName : {rr,rm,r | resourceSecurityMetadataMap.get("$rr$").get("$rm$").add("$r$"); }; separator="\n"$
	}

	public AppProfile() {}

	public String appName = "$appName$";
	
	public String getAppName()
	{
		return appName;
	}

	public java.util.Set<String> getValidResources()
	{
		return resourceSecurityMetadataMap.keySet();
	}

	public boolean isValidResource(String _resourceName)
	{
		return resourceSecurityMetadataMap.keySet().contains(_resourceName.toLowerCase());
	}

	public java.util.Map<String, java.util.Set<String>> getSecurityRoles(String _resourceName)
	{
		return resourceSecurityMetadataMap.get(_resourceName);
	}
}