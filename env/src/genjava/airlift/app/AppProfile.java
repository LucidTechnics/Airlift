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
	public static final java.util.Map<String, String> viewMap = new java.util.HashMap<String, String>();
	public static final java.util.Set<String> viewSet = new java.util.HashSet<String>();
	
	static
	{
		
		resourceSecurityMetadataMap.put("product", new java.util.HashMap<String, java.util.Set<String>>()); 
		resourceSecurityMetadataMap.put("orderlineitem", new java.util.HashMap<String, java.util.Set<String>>()); 
		resourceSecurityMetadataMap.put("order", new java.util.HashMap<String, java.util.Set<String>>()); 
		resourceSecurityMetadataMap.put("person", new java.util.HashMap<String, java.util.Set<String>>()); 

		resourceSecurityMetadataMap.get("product").put("COLLECT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("product").put("PUT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("product").put("POST", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("product").put("HEAD", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("product").put("GET", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("orderlineitem").put("COLLECT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("orderlineitem").put("PUT", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("orderlineitem").put("POST", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("orderlineitem").put("HEAD", new java.util.HashSet<String>()); 
		resourceSecurityMetadataMap.get("orderlineitem").put("GET", new java.util.HashSet<String>()); 
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
			
		resourceSecurityMetadataMap.get("product").get("COLLECT").add("customer service representative"); 
		resourceSecurityMetadataMap.get("product").get("PUT").add("customer service representative"); 
		resourceSecurityMetadataMap.get("product").get("POST").add("customer service representative"); 
		resourceSecurityMetadataMap.get("product").get("HEAD").add("customer service representative"); 
		resourceSecurityMetadataMap.get("product").get("GET").add("customer service representative"); 
		resourceSecurityMetadataMap.get("orderlineitem").get("COLLECT").add("person"); 
		resourceSecurityMetadataMap.get("orderlineitem").get("PUT").add("person"); 
		resourceSecurityMetadataMap.get("orderlineitem").get("POST").add("person"); 
		resourceSecurityMetadataMap.get("orderlineitem").get("HEAD").add("person"); 
		resourceSecurityMetadataMap.get("orderlineitem").get("GET").add("person"); 
		resourceSecurityMetadataMap.get("order").get("COLLECT").add("person"); 
		resourceSecurityMetadataMap.get("order").get("PUT").add("person"); 
		resourceSecurityMetadataMap.get("order").get("POST").add("person"); 
		resourceSecurityMetadataMap.get("order").get("HEAD").add("person"); 
		resourceSecurityMetadataMap.get("order").get("GET").add("person"); 
		resourceSecurityMetadataMap.get("person").get("COLLECT").add("person"); 
		resourceSecurityMetadataMap.get("person").get("PUT").add("person"); 
		resourceSecurityMetadataMap.get("person").get("POST").add("person"); 
		resourceSecurityMetadataMap.get("person").get("HEAD").add("person"); 
		resourceSecurityMetadataMap.get("person").get("GET").add("person"); 
	}

	public AppProfile() {}

	public String appName = "analytics-web";
	
	public String getAppName()
	{
		return appName;
	}

	public boolean isView(String _resourceName)
	{
		return viewSet.contains(_resourceName.toLowerCase());
	}

	public String getLookingAt(String _resourceName)
	{
		return viewMap.get(_resourceName.toLowerCase());
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