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
 * The Interface User.
 */
public interface User
{	
	
	/**
	 * Compare to.
	 *
	 * @param _user the _user
	 * @return the int
	 */
	public int	compareTo(User _user);
	
	/**
	 * Equals.
	 *
	 * @param _object the _object
	 * @return true, if successful
	 */
	public boolean equals(java.lang.Object _object);
	
	/**
	 * Gets the auth domain.
	 *
	 * @return the auth domain
	 */
	public java.lang.String	getAuthDomain();
    
    /**
     * Gets the email.
     *
     * @return the email
     */
    public java.lang.String	getEmail(); 
	
	/**
	 * Gets the federated identity.
	 *
	 * @return the federated identity
	 */
	public java.lang.String	getFederatedIdentity();
	
	/**
	 * Gets the nickname.
	 *
	 * @return the nickname
	 */
	public java.lang.String	getNickname();
	
	/**
	 * Gets the user id.
	 *
	 * @return the user id
	 */
	public java.lang.String	getUserId() ;
	
	/**
	 * Hash code.
	 *
	 * @return the int
	 */
	public int hashCode();
	
	/**
	 * To string.
	 *
	 * @return the java.lang. string
	 */
	public java.lang.String	toString();
}