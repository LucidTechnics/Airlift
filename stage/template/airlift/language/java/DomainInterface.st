package $package$.domaininterface;

import airlift.generator.Persistable;
import airlift.generator.Persistable.Semantic;
import airlift.generator.Presentable;
import airlift.generator.Presentable.Type;
import airlift.generator.Searchable;

@javax.annotation.Generated
(
  value="airlift.generator.Generator",
  comments="$generatorComment$",
  date = "$dateTimestamp$"
)

$annotation; separator="\n"$

public interface $className$
{
	$annotatedInterfaceAttributeGetters; separator="\n\n"$
}