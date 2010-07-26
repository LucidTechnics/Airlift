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

public class Attribute
{
	private String name;
	private String type;

	public String getName() { return name; }
	public String getType() { return type; }
	
	public void setName(String _name) { name = _name; }
	public void setType(String _type) { type = _type; }
	
	public Attribute() {}
	
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("Attribute\n");
		stringBuffer.append("name --> " + name).append("\n");
		stringBuffer.append("type --> " + type).append("\n");

		return stringBuffer.toString();
	}

	public boolean equals(Object _object)
	{
		boolean equals = false;

		if (_object instanceof Attribute)
		{
			Attribute attribute = (Attribute) _object;

			if (attribute.getName().equals(getName()) && attribute.getType().equals(getType()))
			{
				equals = true;
			}
		}

		return equals;
	}

	public int hashCode()
	{
		return getType().hashCode() + getName().hashCode();
	}
}