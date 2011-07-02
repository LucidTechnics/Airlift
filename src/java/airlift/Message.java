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

package airlift; 

// TODO: Auto-generated Javadoc
/**
 * The Interface Message.
 */
public interface Message
{
	
	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName();
	
	/**
	 * Gets the message.
	 *
	 * @return the message
	 */
	public String getMessage();
	
	/**
	 * Gets the category.
	 *
	 * @return the category
	 */
	public String getCategory();

	/**
	 * Sets the name.
	 *
	 * @param _name the new name
	 */
	public void setName(String _name);
	
	/**
	 * Sets the message.
	 *
	 * @param _message the new message
	 */
	public void setMessage(String _message);
	
	/**
	 * Sets the category.
	 *
	 * @param _category the new category
	 */
	public void setCategory(String _category);
}