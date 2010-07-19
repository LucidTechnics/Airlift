package $package$.hannibal.domain;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)
   
public class $className$Rest
	implements $fullClassName$
{
	private String method;
	private $className$ domainObject;
	
	public String getMethod() { return methodd; }
	public $className$ getDomainObject() { return domainObject; }
	
	public void setMethod(String _method) { method = _method; }
	public void setDomainObject($className$ _domainObject) { domainObject = _domainObject; }
	
	$wrappedAttributeGetters$

	$wrappedAttributeSetters$

	public $className$Rest()
	{
		setDomainObject(new $className$Impl());
	}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("$className$Rest").append("\n");
		stringBuffer.append("method").append(getMethod()).append("\n");
		stringBuffer.append("with wrapped object\n");
		stringBuffer.append(getDomainObject());

		return stringBuffer.toString();
	}
}