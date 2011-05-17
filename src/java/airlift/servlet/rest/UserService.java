package airlift.servlet.rest;

public interface UserService
{
	//Returns a URL that can be used to display a login page to the user.
	public java.lang.String	createLoginURL(java.lang.String destinationURL); 

	//Returns a URL that can be used to display a login page to the user.
	public java.lang.String	createLoginURL(java.lang.String destinationURL, java.lang.String authDomain) ;

	//Returns a URL that can be used to redirect the user to for third party login for federated login the user.
	public java.lang.String	createLoginURL(java.lang.String destinationURL, java.lang.String authDomain, java.lang.String federatedIdentity, java.util.Set<java.lang.String> attributesRequest);

	//Returns a URL that can be used to log the current user out of this app.
	public java.lang.String	createLogoutURL(java.lang.String destinationURL);

	//Returns a URL that can be used to log the current user out of this app.
	public java.lang.String	createLogoutURL(java.lang.String destinationURL, java.lang.String authDomain) ;

	//If the user is logged in, this method will return a User that contains information about them.
	public AbstractUser	getCurrentUser();

	//Returns true if the user making this request is an admin for this application, false otherwise.
	public  boolean	isUserAdmin(); 

	//Returns true if there is a user logged in, false otherwise.
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
	public String getUserKind();

	public void setHttpServletRequest(javax.servlet.http.HttpServletRequest _httpServletRequest);
}