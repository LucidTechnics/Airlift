package airlift.servlet.rest;

public interface UserServiceFactory
{
	public UserService getUserService(javax.servlet.http.HttpServletRequest _httpServletRequest);
}