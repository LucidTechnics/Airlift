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
	private static final java.util.Collection<String> collection = new java.util.ArrayList<String>();
	private static final java.util.Map<String, String> map = new java.util.HashMap<String, String>();
	private static final java.util.Map<String, String> domainToClassMap = new java.util.HashMap<String, String>();
	private static final java.util.Map<String, String> domainToShortClassMap = new java.util.HashMap<String, String>();
	private static final java.util.Map<String, String> conceptMap = new java.util.HashMap<String, String>();
	
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

		//Concept Map
		$addToConceptMap; separator="\n"$

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

	public java.lang.annotation.Annotation getAnnotation(String _domainName, Class _annotationClass)
	{
		java.lang.annotation.Annotation annotation = null;

		try
		{
			Class domainInterfaceClass = Class.forName(getFullyQualifiedClassName(_domainName));

			if (domainInterfaceClass.isAnnotationPresent(_annotationClass) == true)
			{
				annotation = domainInterfaceClass.getAnnotation(_annotationClass);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return annotation;
	}

	public java.util.Collection<String> getValidDomains()
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

	public String getConcept(String _conceptHandle)
	{
		return this.conceptMap.get(_conceptHandle);
	}
}