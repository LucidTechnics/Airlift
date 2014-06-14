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
import javax.servlet.*;
// TODO: Auto-generated Javadoc
/**
 * The Class GoogleUserService.
 */
public class GoogleUserService
   implements UserService
{
	protected RestContext restContext;
	private javax.servlet.http.HttpServletRequest httpServletRequest;
	javax.servlet.http.HttpServletResponse httpServletResponse;
	private com.google.appengine.api.users.UserService userService;
	private ServletConfig servletConfig;

	private javax.servlet.http.HttpServletRequest getHttpServletRequest() { return httpServletRequest; }
	
	public RestContext getRestContext(){return restContext;}

	private com.google.appengine.api.users.UserService getUserService() { return userService; }

	public void setHttpServletRequest(javax.servlet.http.HttpServletRequest _httpServletRequest) { httpServletRequest = _httpServletRequest; }
	
	public void setRestContext(RestContext _restContext){restContext=_restContext;}
	private void setUserService(com.google.appengine.api.users.UserService _userService) { userService = _userService; }

	public GoogleUserService() { setUserService(com.google.appengine.api.users.UserServiceFactory.getUserService()); }
	
	public java.lang.String	createLoginURL(java.lang.String _destinationURL)
	{
		return getUserService().createLoginURL(_destinationURL);
	}

	public java.lang.String	createLoginURL(java.lang.String _destinationURL, java.lang.String _authDomain)
	{
		return getUserService().createLoginURL(_destinationURL, _authDomain);
	}

	public java.lang.String	createLoginURL(java.lang.String _destinationURL, java.lang.String _authDomain, java.lang.String _federatedIdentity, java.util.Set<java.lang.String> _attributesRequest)
	{
		return getUserService().createLoginURL(_destinationURL, _authDomain, _federatedIdentity, _attributesRequest);
	}

	public java.lang.String	createLogoutURL(java.lang.String _destinationURL)
	{
		return getUserService().createLogoutURL(_destinationURL);
	}

	public java.lang.String	createLogoutURL(java.lang.String _destinationURL, java.lang.String _authDomain)
	{
		return getUserService().createLogoutURL(_destinationURL, _authDomain);
	}

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

	public  boolean	isUserAdmin()
	{
		return getUserService().isUserAdmin();
	}

	public boolean isUserLoggedIn()
	{
		return getUserService().isUserLoggedIn();
	}

	public String getUserKind()
	{
		return "AirliftUser";
	}

	public void setHttpServletResponse(javax.servlet.http.HttpServletResponse _httpServletResponse)
	{
		httpServletResponse=_httpServletResponse;
	}

	public void setServletConfig(ServletConfig _servletConfig) { servletConfig = _servletConfig; }
}