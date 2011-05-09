package $package$.airlift.domain;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

@javax.persistence.Entity(name="$className$")
@com.googlecode.objectify.annotation.Unindexed
$cacheable$
public class $className$Do
   implements $package$.airlift.domain.$className$, java.io.Serializable
{
	$attributes$

	$attributeGetters$

	$attributeSetters$
	
	public $className$Do() {}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** $className$Do ... $className$").append("\n");
		$attributeStringBufferAppends$
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}