package $package$.airlift.domain;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

public class $className$IndexDo
   implements java.io.Serializable
{
	@javax.persistence.Id
	private java.lang.String id;
	private java.util.List<String> index; 
	@com.googlecode.objectify.annotation.Parent private com.googlecode.objectify.Key<$className$Do> $lowerCaseClassName$DoKey;

	public String getId() { return id; }
	public java.util.List<String> getIndex() { return index; }
	public com.googlecode.objectify.Key<$className$Do> get$className$DoKey() { return $lowerCaseClassName$DoKey; }
	
	public void setId(String _id) { id = _id; }
	public void setIndex(java.util.List<String> _index) { index = _index; }
	public void set$className$DoKey(com.googlecode.objectify.Key<$className$Do> _$lowerCaseClassName$DoKey) { $lowerCaseClassName$DoKey = _$lowerCaseClassName$DoKey; }

	public $className$IndexDo() {}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** AssignmentDoIndex ... Assignment").append("\n");
		stringBuffer.append("id:").append(getId()).append("\n"); 
		stringBuffer.append("index:").append(getIndex()).append("\n");
		stringBuffer.append("$lowerCaseClassName$DoKey:").append(get$className$DoKey()).append("\n");
		stringBuffer.append("**]\n");
		
		return stringBuffer.toString();
	}
}