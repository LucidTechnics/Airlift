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

package airlift.generator;

import java.util.HashMap;
import java.util.Map;

public class Annotation
{
	private String name;
	private Map<String, Object> parameterMap;

	public String getName() { return name; }
	public Map<String, Object> getParameterMap() { return parameterMap; }
	
	public void setName(String _name) { name = _name; }
	public void setParameterMap(Map<String, Object> _parameterMap) { parameterMap = _parameterMap; }
	
	public Annotation()
	{
		setParameterMap(new HashMap<String, Object>());
	}

	public void addParameterValue(String _parameter, Object _value)
	{
		getParameterMap().put(_parameter, _value);
	}
	
	public Object getParameterValue(String _parameter)
	{
		return getParameterMap().get(_parameter);
	}

	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("Annotation\n");
		stringBuffer.append("name --> " + name).append("\n");
		stringBuffer.append("parameterMap --> " + parameterMap).append("\n");

		return stringBuffer.toString();
	}

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

	public int hashCode()
	{
		return getName().hashCode();
	}
}
