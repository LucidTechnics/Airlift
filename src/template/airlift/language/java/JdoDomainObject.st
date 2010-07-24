package $package$.airlift.domain;

import javax.jdo.annotations.PrimaryKey;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PersistenceCapable;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

@PersistenceCapable
public class $className$Jdo
	implements $package$.airlift.domain.$className$
{
	$attributes$
	
	$attributeGetters$
	
	$attributeSetters$

	public $className$Jdo() {}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** $className$Jdo ... $className$").append("\n");
		$attributeStringBufferAppends$
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}