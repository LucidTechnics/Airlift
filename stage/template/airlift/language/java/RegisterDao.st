package $package$.airlift.dao;

@javax.annotation.Generated
(
	value="airlift.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

public class $className$RegisterDao
{
	static
	{
		com.googlecode.objectify.ObjectifyService.register($package$.airlift.domain.$className$Do.class);
	}
	
	public $className$RegisterDao() {}
}