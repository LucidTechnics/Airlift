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
package airlift.servlet.rest;
 
// TODO: Auto-generated Javadoc
/**
 * The Class GoogleUser.
 */
public class GoogleUser
   extends AbstractUser
{
	
	/** The user. */
	private com.google.appengine.api.users.User user;

	/**
	 * Gets the user.
	 *
	 * @return the user
	 */
	public com.google.appengine.api.users.User getUser() { return user; }

	/**
	 * Sets the user.
	 *
	 * @param _user the new user
	 */
	protected void setUser(com.google.appengine.api.users.User _user)
	{
		user = _user;
	}

	/**
	 * Instantiates a new google user.
	 *
	 * @param _user the _user
	 */
	protected GoogleUser(com.google.appengine.api.users.User _user) { setUser(_user); }

	//For a Google user the external id is effectively the user's email
	//address ...
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AirliftUser#getExternalUserId()
	 */
	public String getExternalUserId()
	{
		return getUser().getEmail();
	}

	//... the setExternalUserId is useless based on what getExternalUserId does
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AirliftUser#setExternalUserId(java.lang.String)
	 */
	public void setExternalUserId(String _externalUserId)
	{
		throw new RuntimeException("This method is intentionally not implemented for a airlift.servlet.rest.GoogleUser");
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#compareTo(airlift.servlet.rest.User)
	 */
	public int compareTo(User _user)
	{
		int compareTo = 0;
		
		if (_user instanceof GoogleUser)
		{
			GoogleUser user = (GoogleUser) _user;
			
			compareTo = getUser().compareTo(user.getUser());
		}
		else
		{
			throw new RuntimeException("User is not a airlift.servlet.rest.GoogleUser");
		}

		return compareTo;
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#equals(java.lang.Object)
	 */
	public boolean equals(java.lang.Object _object)
	{
		return getUser().equals(_object);
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#getAuthDomain()
	 */
	public java.lang.String	getAuthDomain()
	{
		return getUser().getAuthDomain();
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AirliftUser#getEmail()
	 */
	public java.lang.String	getEmail()
	{
		return getUser().getEmail();
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#getFederatedIdentity()
	 */
	public java.lang.String	getFederatedIdentity()
	{
		return getUser().getFederatedIdentity();
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#getNickname()
	 */
	public java.lang.String	getNickname()
	{
		return getUser().getNickname();
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#getUserId()
	 */
	public java.lang.String	getUserId()
	{
		return getUser().getUserId();
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AbstractUser#hashCode()
	 */
	public int hashCode()
	{
		return getUser().hashCode();
	}
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.AirliftUser#toString()
	 */
	public java.lang.String	toString()
	{
		return super.toString();
	}
}