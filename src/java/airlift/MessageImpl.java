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

package airlift; 

public class MessageImpl
   implements airlift.Message
{
	protected String name = "";
	protected String category = "";
	protected String message = "";

	protected MessageImpl() {}
	
	public MessageImpl(String _name, String _message)
	{
	    this.name = _name;
		this.message = _message;
	}

	public MessageImpl(String _name, String _category, String _message)
	{
		this(_name, _message);
		this.category = _category;
	}

	public String getName() { return name; }
	public String getMessage() { return message; }
	public String getCategory() { return category; }

	public void setName(String _name) { name = _name; }
	public void setMessage(String _message) { message = _message; }
	public void setCategory(String _category) { category = _category; }

	public String toString()
	{
	    return getCategory() + ":" + getName() + ":" + getMessage();
	}
}