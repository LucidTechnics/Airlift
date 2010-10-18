package $package$.airlift.domain;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
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
	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    @Extension(vendorName="datanucleus", key="gae.encoded-pk", value="true")
    private String encodedKey;


	
	
	$attributes$

	public String getEncodedKey() { return encodedKey; }
	$attributeGetters$

	public void setEncodedKey(String _encodedKey) { encodedKey = _encodedKey; }
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