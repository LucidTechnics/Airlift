package $package$.airlift.domain;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.FetchGroup;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PrimaryKey;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PersistenceCapable;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

@FetchGroup(name = "$lowerCaseClassName$Index", members = {@Persistent(name = "$lowerCaseClassName$Index") })
@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
public class $className$Jdo
   implements $package$.airlift.domain.$className$, java.io.Serializable
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

	public $className$Jdo encrypt(byte[] _initialBytes, String _password, String _initialVector, String _provider, String _name, String _mode, String _padding, int _revolutions)
	{
		$attributeEncryptors$

		return this;
	}

	public $className$Jdo decrypt(byte[] _initialBytes, String _password, String _initialVector, String _provider, String _name, String _mode, String _padding, int _revolutions)
	{
		$attributeDecryptors$

		return this;
	}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** $className$Jdo ... $className$").append("\n");
		$attributeStringBufferAppends$
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}