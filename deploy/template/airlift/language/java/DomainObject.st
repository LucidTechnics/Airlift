package $package$.airlift.domain;

import javax.jdo.annotations.PrimaryKey;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PersistenceCapable;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

@PersistenceCapable
public class $className$Impl
	implements $package$.airlift.domain.$className$
{
	$attributes$
	
	$attributeGetters$
	
	$attributeSetters$

	public $className$Impl() {}
	
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** $className$Impl ... $className$").append("\n");
		$attributeStringBufferAppends$
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}