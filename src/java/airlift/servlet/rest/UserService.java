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
 * The Interface UserService.
 */
public interface UserService
{
	//Returns a URL that can be used to display a login page to the user.
	/**
	 * Creates the login url.
	 *
	 * @param destinationURL the destination url
	 * @return the java.lang. string
	 */
	public java.lang.String	createLoginURL(java.lang.String destinationURL); 

	//Returns a URL that can be used to display a login page to the user.
	/**
	 * Creates the login url.
	 *
	 * @param destinationURL the destination url
	 * @param authDomain the auth domain
	 * @return the java.lang. string
	 */
	public java.lang.String	createLoginURL(java.lang.String destinationURL, java.lang.String authDomain) ;

	//Returns a URL that can be used to redirect the user to for third party login for federated login the user.
	/**
	 * Creates the login url.
	 *
	 * @param destinationURL the destination url
	 * @param authDomain the auth domain
	 * @param federatedIdentity the federated identity
	 * @param attributesRequest the attributes request
	 * @return the java.lang. string
	 */
	public java.lang.String	createLoginURL(java.lang.String destinationURL, java.lang.String authDomain, java.lang.String federatedIdentity, java.util.Set<java.lang.String> attributesRequest);

	//Returns a URL that can be used to log the current user out of this app.
	/**
	 * Creates the logout url.
	 *
	 * @param destinationURL the destination url
	 * @return the java.lang. string
	 */
	public java.lang.String	createLogoutURL(java.lang.String destinationURL);

	//Returns a URL that can be used to log the current user out of this app.
	/**
	 * Creates the logout url.
	 *
	 * @param destinationURL the destination url
	 * @param authDomain the auth domain
	 * @return the java.lang. string
	 */
	public java.lang.String	createLogoutURL(java.lang.String destinationURL, java.lang.String authDomain) ;

	//If the user is logged in, this method will return a User that contains information about them.
	/**
	 * Gets the current user.
	 *
	 * @return the current user
	 */
	public AbstractUser	getCurrentUser();

	//Returns true if the user making this request is an admin for this application, false otherwise.
	/**
	 * Checks if is user admin.
	 *
	 * @return true, if is user admin
	 */
	public  boolean	isUserAdmin(); 

	//Returns true if there is a user logged in, false otherwise.
	/**
	 * Checks if is user logged in.
	 *
	 * @return true, if is user logged in
	 */
	public boolean isUserLoggedIn();

	//If you store your user in the App Engine datastore this should return the
	//name of the Kind used by your user's entity.  This would allow you to add additional
	//information to your user for your own purposes, while at the same
	//time allow us to retrieve your user to get the AbstractUser
	//information.
	//
	//NB: Your user must at least have all the properties of an
	//airlift.servlet.rest.AbstractUser including those properties from
	//the airlift.servlet.rest.AirliftUser.
	/**
	 * Gets the user kind.
	 *
	 * @return the user kind
	 */
	public String getUserKind();

	/**
	 * Sets the http servlet request.
	 *
	 * @param _httpServletRequest the new http servlet request
	 */
	public void setHttpServletRequest(javax.servlet.http.HttpServletRequest _httpServletRequest);
	public void setRestContext(RestContext _restContext);
	public RestContext getRestContext();
}