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
 * The Class AbstractUser.
 */
public abstract class AbstractUser
   extends AirliftUser
   implements User
{	
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.User#compareTo(airlift.servlet.rest.User)
	 */
	public abstract int compareTo(User _user);
	
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	public abstract boolean equals(java.lang.Object _object);
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.User#getAuthDomain()
	 */
	public abstract String getAuthDomain();
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.User#getFederatedIdentity()
	 */
	public abstract String getFederatedIdentity();
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.User#getNickname()
	 */
	public abstract String getNickname();
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.User#getUserId()
	 */
	public abstract String getUserId() ;
	
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	public abstract int hashCode();
}