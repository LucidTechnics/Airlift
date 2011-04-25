package airlift.servlet.rest;

public abstract class AbstractUser
   extends AirliftUser
   implements User
{	
	public abstract int compareTo(User _user);
	public abstract boolean equals(java.lang.Object _object);
	public abstract String getAuthDomain();
	public abstract String getFederatedIdentity();
	public abstract String getNickname();
	public abstract String getUserId() ;
	public abstract int hashCode();
}