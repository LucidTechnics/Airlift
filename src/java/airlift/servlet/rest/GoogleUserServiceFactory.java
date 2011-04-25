package airlift.servlet.rest;

public class GoogleUserServiceFactory
   implements UserServiceFactory
{
	public UserService getUserService(javax.servlet.http.HttpServletRequest _httpServletRequest) { return new GoogleUserService(); }
}