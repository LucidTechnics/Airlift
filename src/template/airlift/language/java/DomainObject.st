package $package$.airlift.domain;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

@PersistenceCapable
public class $className$
{
	$attributes$
	
	$attributeGetters$
	
	$attributeSetters$

	public $className$() {}
	
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** $className$ ... $className$").append("\n");
		$attributeStringBufferAppends$
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}