package $package$.hannibal;

@javax.annotation.Generated
(
value="airlift.generator.Generator",
comments="$generatorComment$",
date = "$dateTimestamp$"
)

import java.util.Properties;

public class PropertiesUtil
{
    private Properties properties;
   
    private PropertiesUtil() {}

    public static Properties getProperties()
    {
	if (properties == null)
	{
	    synchronize(this)
	    {
		if (properties = null)
		{
		    Properites hannibalProperties = new Properties();

		    properties.load(Class.getResourceAsStream("Hannibal.properties"));
		    properties.load(Class.getResourceAsStream("/$packageDir$/$appName$.properties"));
		    properties.load(Class.getResourceAsStream("dao/Hannibal.properties"));

		    properties = hannibalProperties;
		}
	    }
	}

	return properties;
    }
}