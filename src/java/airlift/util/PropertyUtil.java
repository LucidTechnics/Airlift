/*
 Copyright 2011, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.util;

import java.util.Map;
import java.util.Properties;

// TODO: Auto-generated Javadoc
/**
 * The Class PropertyUtil.
 */
public class PropertyUtil
{
	
	/** The property util. */
	private static PropertyUtil propertyUtil = new PropertyUtil();
	
	/** The properties map. */
	private static java.util.Map<String, Properties> propertiesMap;
    
    /** The resource map. */
    private static Map<String, String> resourceMap;
   
    /**
     * Instantiates a new property util.
     */
    private PropertyUtil()
	{
		this.propertiesMap = new java.util.HashMap<String, Properties>();
		this.resourceMap = new java.util.HashMap<String, String>();
    }
    
    /**
     * Gets the property.
     *
     * @param _resourceName the _resource name
     * @param _propertyName the _property name
     * @return the property
     */
    public synchronized String getProperty(String  _resourceName, String _propertyName)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		return properties.getProperty(_propertyName);
    }

    /**
     * Gets the property.
     *
     * @param _resourceName the _resource name
     * @param _propertyName the _property name
     * @param _default the _default
     * @return the property
     */
    public synchronized String getProperty(String _resourceName, String _propertyName, String _default)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		return properties.getProperty(_propertyName, _default);
    }
    
    /**
     * Sets the property.
     *
     * @param _resourceName the _resource name
     * @param _name the _name
     * @param _value the _value
     */
    public synchronized void setProperty(String _resourceName, String _name, String _value)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		properties.setProperty(_name, _value);
    }

	/**
	 * Load properties.
	 *
	 * @param _propertyResourceName the _property resource name
	 */
	public synchronized void loadProperties(String _propertyResourceName)
	{
		loadProperties(_propertyResourceName, null);
	}

	/**
	 * Load properties.
	 *
	 * @param _propertyResourceName the _property resource name
	 * @param _shortName the _short name
	 */
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

	/**
	 * Load properties.
	 *
	 * @param _propertyResourceName the _property resource name
	 * @param _shortName the _short name
	 * @param _swallowException the _swallow exception
	 * @return true, if successful
	 */
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

    /**
     * Reload properties.
     *
     * @param _name the _name
     */
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

	/**
	 * Gets the single instance of PropertyUtil.
	 *
	 * @return single instance of PropertyUtil
	 */
	public synchronized static PropertyUtil getInstance()
	{
		return propertyUtil;
	}

	/**
	 * Gets the properties.
	 *
	 * @param _resourceName the _resource name
	 * @return the properties
	 */
	public synchronized Properties getProperties(String _resourceName)
	{
		Properties properties = this.propertiesMap.get(_resourceName);
		
		return properties;
	}
}