package airlift.servlet.rest;
 
public class GoogleUser
   extends AbstractUser
{
	private com.google.appengine.api.users.User user;

	public com.google.appengine.api.users.User getUser() { return user; }

	protected void setUser(com.google.appengine.api.users.User _user)
	{
		user = _user;
	}

	protected GoogleUser(com.google.appengine.api.users.User _user) { setUser(_user); }

	//For a Google user the external id is effectively the user's email
	//address ...
	public String getExternalUserId()
	{
		return getUser().getEmail();
	}

	//... the setExternalUserId is useless based on what getExternalUserId does
	public void setExternalUserId(String _externalUserId)
	{
		throw new RuntimeException("This method is intentionally not implemented for a airlift.servlet.rest.GoogleUser");
	}
	
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
	
	public boolean equals(java.lang.Object _object)
	{
		return getUser().equals(_object);
	}
	
	public java.lang.String	getAuthDomain()
	{
		return getUser().getAuthDomain();
	}
	
	public java.lang.String	getEmail()
	{
		return getUser().getEmail();
	}
	
	public java.lang.String	getFederatedIdentity()
	{
		return getUser().getFederatedIdentity();
	}
	
	public java.lang.String	getNickname()
	{
		return getUser().getNickname();
	}
	
	public java.lang.String	getUserId()
	{
		return getUser().getUserId();
	}
	
	public int hashCode()
	{
		return getUser().hashCode();
	}
	
	public java.lang.String	toString()
	{
		return getUser().toString();
	}
}