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

package airlift; 

import com.google.appengine.api.users.User;

// TODO: Auto-generated Javadoc
/**
 * The Interface SecurityContext.
 */
public interface SecurityContext
{
	
	/**
	 * Allowed.
	 *
	 * @param _user the _user
	 * @param _restContext the _rest context
	 * @param _appProfile the _app profile
	 * @return true, if successful
	 */
	public boolean allowed(airlift.servlet.rest.AirliftUser _user, airlift.servlet.rest.RestContext _restContext, airlift.AppProfile _appProfile);
}