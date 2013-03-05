package airlift.app;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="",
	date = ""
)

public class AppProfile
   implements airlift.AppProfile
{
	public static final java.util.Map<String, java.util.Map<String, java.util.Set<String>>> resourceSecurityMetadataMap = new java.util.HashMap<String, java.util.Map<String, java.util.Set<String>>>();
				
	static
	{		
		resourceSecurityMetadataMap.put("order", new java.util.HashMap<String, java.util.Set<String>>()); 
		resourceSecurityMetadataMap.put("person", new java.util.HashMap<String, java.util.Set<String>>()); 

		resourceSecurityMetadataMap.get("order").put("COLLECT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("order").put("PUT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("order").put("POST", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("order").put("HEAD", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("order").put("GET", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("person").put("COLLECT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("person").put("PUT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("person").put("POST", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("person").put("HEAD", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("person").put("GET", new java.util.HashSet<String>()); 
			
		resourceSecurityMetadataMap.get("order").get("COLLECT").add("all"); 
		resourceSecurityMetadataMap.get("order").get("PUT").add("all"); 
		resourceSecurityMetadataMap.get("order").get("POST").add("all"); 
		resourceSecurityMetadataMap.get("order").get("HEAD").add("all"); 
		resourceSecurityMetadataMap.get("order").get("GET").add("all"); 
		resourceSecurityMetadataMap.get("person").get("COLLECT").add("all"); 
		resourceSecurityMetadataMap.get("person").get("PUT").add("all"); 
		resourceSecurityMetadataMap.get("person").get("POST").add("all"); 
		resourceSecurityMetadataMap.get("person").get("HEAD").add("all"); 
		resourceSecurityMetadataMap.get("person").get("GET").add("all"); 
	}

	public AppProfile() {}

	public String appName = "airliftlabs";
	
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