package airlift.servlet.rest;

public class GoogleUserServiceFactory
   implements UserServiceFactory
{
	public UserService getUserService() { return new GoogleUserService(); }
}