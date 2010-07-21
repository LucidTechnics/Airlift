/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.util;

import java.util.Properties;
import java.util.Map;
import java.util.HashMap;

public class PropertyUtil
{
	private static PropertyUtil propertyUtil = new PropertyUtil();
	private static java.util.Map<String, Properties> propertiesMap;
    private static Map<String, String> resourceMap;
   
    private PropertyUtil()
	{
		this.propertiesMap = new java.util.HashMap<String, Properties>();
		this.resourceMap = new java.util.HashMap<String, String>();
    }
    
    public synchronized String getProperty(String  _resourceName, String _propertyName)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		return properties.getProperty(_propertyName);
    }

    public synchronized String getProperty(String _resourceName, String _propertyName, String _default)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		return properties.getProperty(_propertyName, _default);
    }
    
    public synchronized void setProperty(String _resourceName, String _name, String _value)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		properties.setProperty(_name, _value);
    }

	public synchronized void loadProperties(String _propertyResourceName)
	{
		loadProperties(_propertyResourceName, null);
	}

	public synchronized void loadProperties(String _propertyResourceName, String _shortName)
	{
		try
		{
			if (this.resourceMap.keySet().contains(_propertyResourceName) == false)
			{
				Properties properties = new Properties();
				properties.load(airlift.util.PropertyUtil.class.getResourceAsStream(_propertyResourceName));
				this.propertiesMap.put(_propertyResourceName, properties);
				this.resourceMap.put(_propertyResourceName, _propertyResourceName);

				if (_shortName != null &&
					  airlift.util.AirliftUtil.isWhitespace(_shortName) == false)
				{
					this.propertiesMap.put(_shortName, properties);
					this.resourceMap.put(_shortName, _propertyResourceName);
				}
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Unable to load: " + _propertyResourceName, t);
		}
	}

	public synchronized boolean loadProperties(String _propertyResourceName, String _shortName, boolean _swallowException)
	{
		boolean successful = false;
		
		try
		{
			loadProperties(_propertyResourceName, _shortName);
			successful = true;
		}
		catch(Throwable t)
		{
			if (_swallowException == false)
			{
				throw new RuntimeException("Unable to load: " + _propertyResourceName, t);
			}
		}

		return successful;
	}

    public synchronized void reloadProperties(String _name)
    {
		try
		{
			Properties properties = this.propertiesMap.get(_name);
			String resource = this.resourceMap.get(_name);

			if (properties == null) { properties = new Properties(); }
			if (resource == null) { resource = _name; }
			
			properties.load(this.getClass().getResourceAsStream(resource));
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	public synchronized static PropertyUtil getInstance()
	{
		return propertyUtil;
	}

	public synchronized Properties getProperties(String _resourceName)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		return properties;
	}
}