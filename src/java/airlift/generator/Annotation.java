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

package airlift.generator;

import java.util.HashMap;
import java.util.Map;

// TODO: Auto-generated Javadoc
/**
 * The Class Annotation.
 */
public class Annotation
{
	
	/** The name. */
	private String name;
	
	/** The parameter map. */
	private Map<String, Object> parameterMap;

	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() { return name; }
	
	/**
	 * Gets the parameter map.
	 *
	 * @return the parameter map
	 */
	public Map<String, Object> getParameterMap() { return parameterMap; }
	
	/**
	 * Sets the name.
	 *
	 * @param _name the new name
	 */
	public void setName(String _name) { name = _name; }
	
	/**
	 * Sets the parameter map.
	 *
	 * @param _parameterMap the _parameter map
	 */
	public void setParameterMap(Map<String, Object> _parameterMap) { parameterMap = _parameterMap; }
	
	/**
	 * Instantiates a new annotation.
	 */
	public Annotation()
	{
		setParameterMap(new HashMap<String, Object>());
	}

	/**
	 * Adds the parameter value.
	 *
	 * @param _parameter the _parameter
	 * @param _value the _value
	 */
	public void addParameterValue(String _parameter, Object _value)
	{
		getParameterMap().put(_parameter, _value);
	}
	
	/**
	 * Gets the parameter value.
	 *
	 * @param _parameter the _parameter
	 * @return the parameter value
	 */
	public Object getParameterValue(String _parameter)
	{
		return getParameterMap().get(_parameter);
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("Annotation\n");
		stringBuffer.append("name --> " + name).append("\n");
		stringBuffer.append("parameterMap --> " + parameterMap).append("\n");

		return stringBuffer.toString();
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	public boolean equals(Object _object)
	{
		boolean equals = false;

		if (_object != null && _object instanceof Annotation)
		{
			Annotation annotation = (Annotation) _object;

			if (getName().equals(annotation.getName()) == true)
			{
				equals = true;
			}
		}

		return equals;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode()
	{
		return getName().hashCode();
	}
}
