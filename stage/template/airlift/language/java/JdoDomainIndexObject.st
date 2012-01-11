package $package$.airlift.domain;

import javax.jdo.annotations.Extension;
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

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
public class $className$IndexJdo
   implements java.io.Serializable
{
	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    @Extension(vendorName="datanucleus", key="gae.encoded-pk", value="true")
    private String encodedKey;

	@Persistent @Extension(vendorName="datanucleus", key="gae.pk-name", value="true") private java.lang.String id;
	@Persistent private java.util.List<String> index; 
	@Persistent(mappedBy="$lowerCaseClassName$IndexJdo") private $className$Jdo $lowerCaseClassName$Jdo;

	public String getEncodedKey() { return encodedKey; }
	public String getId() { return id; }
	public java.util.List<String> getIndex() { return index; }
	public $className$Jdo get$className$Jdo() { return $lowerCaseClassName$Jdo; }
	
	public void setEncodedKey(String _encodedKey) { encodedKey = _encodedKey; }
	public void setId(String _id) { id = _id; }
	public void setIndex(java.util.List<String> _index) { index = _index; }
	public void set$className$Jdo($className$Jdo _$lowerCaseClassName$Jdo) { $lowerCaseClassName$Jdo = _$lowerCaseClassName$Jdo; }

	public $className$IndexJdo() {}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** AssignmentJdoIndex ... Assignment").append("\n");
		stringBuffer.append("id:").append(getId()).append("\n"); 
		stringBuffer.append("index:").append(getIndex()).append("\n");
		stringBuffer.append("$lowerCaseClassName$Jdo:").append(get$className$Jdo()).append("\n");
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}