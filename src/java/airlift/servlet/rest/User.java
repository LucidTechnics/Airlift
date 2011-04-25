package airlift.servlet.rest;

public interface User
{	
	public int	compareTo(User _user);
	public boolean equals(java.lang.Object _object);
	public java.lang.String	getAuthDomain();
    public java.lang.String	getEmail(); 
	public java.lang.String	getFederatedIdentity();
	public java.lang.String	getNickname();
	public java.lang.String	getUserId() ;
	public int hashCode();
	public java.lang.String	toString();
}