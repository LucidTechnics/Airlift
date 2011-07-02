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
 * The Class MessageImpl.
 */
public class MessageImpl
   implements airlift.Message
{
	
	/** The name. */
	protected String name = "";
	
	/** The category. */
	protected String category = "";
	
	/** The message. */
	protected String message = "";

	/**
	 * Instantiates a new message impl.
	 */
	protected MessageImpl() {}
	
	/**
	 * Instantiates a new message impl.
	 *
	 * @param _name the _name
	 * @param _message the _message
	 */
	public MessageImpl(String _name, String _message)
	{
	    this.name = _name;
		this.message = _message;
	}

	/**
	 * Instantiates a new message impl.
	 *
	 * @param _name the _name
	 * @param _category the _category
	 * @param _message the _message
	 */
	public MessageImpl(String _name, String _category, String _message)
	{
		this(_name, _message);
		this.category = _category;
	}

	/* (non-Javadoc)
	 * @see airlift.Message#getName()
	 */
	public String getName() { return name; }
	
	/* (non-Javadoc)
	 * @see airlift.Message#getMessage()
	 */
	public String getMessage() { return message; }
	
	/* (non-Javadoc)
	 * @see airlift.Message#getCategory()
	 */
	public String getCategory() { return category; }

	/* (non-Javadoc)
	 * @see airlift.Message#setName(java.lang.String)
	 */
	public void setName(String _name) { name = _name; }
	
	/* (non-Javadoc)
	 * @see airlift.Message#setMessage(java.lang.String)
	 */
	public void setMessage(String _message) { message = _message; }
	
	/* (non-Javadoc)
	 * @see airlift.Message#setCategory(java.lang.String)
	 */
	public void setCategory(String _category) { category = _category; }

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
	    return getCategory() + ":" + getName() + ":" + getMessage();
	}
}