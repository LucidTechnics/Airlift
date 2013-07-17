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
 * The Class GoogleUserService.
 */
public class GoogleUserService
   implements UserService
{
	protected RestContext restContext;
	/** The http servlet request. */
	private javax.servlet.http.HttpServletRequest httpServletRequest;
	
	/** The user service. */
	private com.google.appengine.api.users.UserService userService;

	/**
	 * Gets the http servlet request.
	 *
	 * @return the http servlet request
	 */
	private javax.servlet.http.HttpServletRequest getHttpServletRequest() { return httpServletRequest; }
	
	public RestContext getRestContext(){return restContext;}
	/**
	 * Gets the user service.
	 *
	 * @return the user service
	 */
	private com.google.appengine.api.users.UserService getUserService() { return userService; }

	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#setHttpServletRequest(javax.servlet.http.HttpServletRequest)
	 */
	public void setHttpServletRequest(javax.servlet.http.HttpServletRequest _httpServletRequest) { httpServletRequest = _httpServletRequest; }
	
	public void setRestContext(RestContext _restContext){restContext=_restContext;}
	/**
	 * Sets the user service.
	 *
	 * @param _userService the new user service
	 */
	private void setUserService(com.google.appengine.api.users.UserService _userService) { userService = _userService; }

	/**
	 * Instantiates a new google user service.
	 */
	public GoogleUserService() { setUserService(com.google.appengine.api.users.UserServiceFactory.getUserService()); }
	
	//Returns a URL that can be used to display a login page to the user.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#createLoginURL(java.lang.String)
	 */
	public java.lang.String	createLoginURL(java.lang.String _destinationURL)
	{
		return getUserService().createLoginURL(_destinationURL);
	}

	//Returns a URL that can be used to display a login page to the user.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#createLoginURL(java.lang.String, java.lang.String)
	 */
	public java.lang.String	createLoginURL(java.lang.String _destinationURL, java.lang.String _authDomain)
	{
		return getUserService().createLoginURL(_destinationURL, _authDomain);
	}

	//Returns a URL that can be used to redirect the user to for third party login for federated login the user.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#createLoginURL(java.lang.String, java.lang.String, java.lang.String, java.util.Set)
	 */
	public java.lang.String	createLoginURL(java.lang.String _destinationURL, java.lang.String _authDomain, java.lang.String _federatedIdentity, java.util.Set<java.lang.String> _attributesRequest)
	{
		return getUserService().createLoginURL(_destinationURL, _authDomain, _federatedIdentity, _attributesRequest);
	}

	//Returns a URL that can be used to log the current user out of this app.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#createLogoutURL(java.lang.String)
	 */
	public java.lang.String	createLogoutURL(java.lang.String _destinationURL)
	{
		return getUserService().createLogoutURL(_destinationURL);
	}

	//Returns a URL that can be used to log the current user out of this app.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#createLogoutURL(java.lang.String, java.lang.String)
	 */
	public java.lang.String	createLogoutURL(java.lang.String _destinationURL, java.lang.String _authDomain)
	{
		return getUserService().createLogoutURL(_destinationURL, _authDomain);
	}

	//If the user is logged in, this method will return a User that contains information about them.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#getCurrentUser()
	 */
	public AbstractUser	getCurrentUser()
	{
		AbstractUser abstractUser = null;
		com.google.appengine.api.users.User user = getUserService().getCurrentUser();
		
		if (user != null)
		{
			abstractUser = new GoogleUser(getUserService().getCurrentUser());
		}
		
		return abstractUser;
	}

	//Returns true if the user making this request is an admin for this application, false otherwise.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#isUserAdmin()
	 */
	public  boolean	isUserAdmin()
	{
		return getUserService().isUserAdmin();
	}

	//Returns true if there is a user logged in, false otherwise.
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#isUserLoggedIn()
	 */
	public boolean isUserLoggedIn()
	{
		return getUserService().isUserLoggedIn();
	}

	/* (non-Javadoc)
	 * @see airlift.servlet.rest.UserService#getUserKind()
	 */
	public String getUserKind()
	{
		return "AirliftUser";
	}
}