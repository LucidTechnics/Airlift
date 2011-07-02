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
 * The Class ErrorImpl.
 */
public class ErrorImpl
   extends MessageImpl
   implements airlift.Error
{
	
	/**
	 * Instantiates a new error impl.
	 */
	private ErrorImpl() { super(); }

	/**
	 * Instantiates a new error impl.
	 *
	 * @param _name the _name
	 * @param _message the _message
	 */
	public ErrorImpl(String _name, String _message)
	{
		super.name = _name;
		super.message = _message;
	}

	/**
	 * Instantiates a new error impl.
	 *
	 * @param _name the _name
	 * @param _category the _category
	 * @param _message the _message
	 */
	public ErrorImpl(String _name, String _category, String _message)
	{
		this(_name, _message);
		super.category = _category;
	}

}