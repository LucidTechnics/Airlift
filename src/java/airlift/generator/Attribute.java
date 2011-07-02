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

// TODO: Auto-generated Javadoc
/**
 * The Class Attribute.
 */
public class Attribute
{
	
	/** The name. */
	private String name;
	
	/** The type. */
	private String type;

	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() { return name; }
	
	/**
	 * Gets the type.
	 *
	 * @return the type
	 */
	public String getType() { return type; }
	
	/**
	 * Sets the name.
	 *
	 * @param _name the new name
	 */
	public void setName(String _name) { name = _name; }
	
	/**
	 * Sets the type.
	 *
	 * @param _type the new type
	 */
	public void setType(String _type) { type = _type; }
	
	/**
	 * Instantiates a new attribute.
	 */
	public Attribute() {}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("Attribute\n");
		stringBuffer.append("name --> " + name).append("\n");
		stringBuffer.append("type --> " + type).append("\n");

		return stringBuffer.toString();
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
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

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode()
	{
		return getType().hashCode() + getName().hashCode();
	}
}