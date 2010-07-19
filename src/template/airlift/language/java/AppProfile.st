package $package$;

import airlift.servlet.rest.RestfulSecurityContext;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

public class AppProfile
   implements airlift.AppProfile
{
	private static final java.util.Collection <String> collection = new java.util.ArrayList<String>();
	private static final java.util.Map<String, String> map = new java.util.HashMap<String, String>();
	private static final java.util.Map<String, String> domainToClassMap = new java.util.HashMap<String, String>();
	private static final java.util.Map<String, String> domainToShortClassMap = new java.util.HashMap<String, String>();
	private static final airlift.servlet.rest.RestfulSecurityContext securityContext = new airlift.servlet.rest.RestfulSecurityContext();
	private static final airlift.servlet.rest.RestfulCachingContext cachingContext = new airlift.servlet.rest.RestfulCachingContext();
	
	static
	{
		//Domains
		$addToDomainCollection; separator="\n"$

		//Domain to class map
		$addToDomainToShortClassMap; separator="\n"$

		//Domain to class map
		$addToDomainToClassMap; separator="\n"$

		//Domain attribute types
		$addToDomainAttributeTypeMap; separator="\n"$

		//Restful security context
		$addToSecurityContext; separator="\n"$
	}

	public AppProfile() {}

	public String getAppName()
	{
		return "$appName$";
	}

	public String getRootPackageName()
	{
		return "$rootPackage$";
	}

	public String getDomainShortClassName(String _domainName)
	{
		return domainToShortClassMap.get(_domainName.toLowerCase());
	}

	public String getFullyQualifiedClassName(String _domainName)
	{
		return domainToClassMap.get(_domainName.toLowerCase());
	}

	public java.util.Collection getValidDomains()
	{
		return new java.util.ArrayList<String>(collection);
	}

	public boolean isValidDomain(String _domainName)
	{
		return collection.contains(_domainName.toLowerCase());
	}

	public String getAttributeType(String _domainName, String _attributeName)
	{
		return map.get(_domainName.toLowerCase() + "." + _attributeName);
	}

	public boolean hasAttribute(String _domainName, String _attributeName)
	{
		return map.containsKey(_domainName.toLowerCase() + "." + _attributeName);
	}

	public airlift.SecurityContext getSecurityContext()
	{
		return this.securityContext;
	}

	public airlift.CachingContext getCachingContext()
	{
		return this.cachingContext;
	}
}