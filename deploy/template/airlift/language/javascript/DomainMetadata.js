package $package$;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

public class AppProfile
   implements airlift.AppProfile
{
	public static final java.util.Map<String, airlift.meta.DomainMetadata> domainMetadataMap = new java.util.HashMap<String, airlift.meta.DomainMetadata>();

	$domainAttributeList; separator="\n"$
	$domainAttributeListGetter; separator="\n"$								
			
	static
	{		
		$domainName : {d | domainMetadataMap.put("$d$", new airlift.meta.DomainMetadata()); }; separator="\n"$

		$attributeDomainName, attributeName: {d,a | domainMetadataMap.get("$d$").put("$a$", new airlift.meta.AttributeMetadata()); }; separator="\n"$
			
		$propertyDomainName, propertyAttributeName, propertyName, propertyValue: {d,a,n,v | domainMetadataMap.get("$d$").get("$a$").$n$ = $v$; }; separator="\n"$
	}

	public AppProfile() {}

	public String appName = "$appName$";
	
	public String getAppName()
	{
		return appName;
	}

	public airlift.meta.AttributeMetadata getAttributeMetadata(String _domainName, String _attributeName)
	{
		airlift.meta.AttributeMetadata attributeMetadata = null;
		airlift.meta.DomainMetadata domainMetadata = getDomainMetadata(_domainName);

		if (domainMetadata != null)
		{
			attributeMetadata = domainMetadata.attributeMetadataMap.get(_attributeName);
		}

		return attributeMetadata;
	}

	public airlift.meta.DomainMetadata getDomainMetadata(String _domainName)
	{
		return domainMetadataMap.get(_domainName);
	}

	public java.util.Set<String> getValidAttributes(String _domainName)
	{
		java.util.Set<String> validAttributes = null;
		airlift.meta.DomainMetadata domainMetadata = getDomainMetadata(_domainName);

		if (domainMetadata != null)
		{
			validAttributes = domainMetadata.attributeMetadataMap.keySet();
		}
			
		return validAttributes;
	}

	public java.util.Set<String> getValidDomains()
	{
		return domainMetadataMap.keySet();
	}

	public boolean isValidDomain(String _domainName)
	{
		return domainMetadataMap.keySet().contains(_domainName.toLowerCase());
	}
}