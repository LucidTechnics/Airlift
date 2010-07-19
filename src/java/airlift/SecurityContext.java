/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift; 

public interface SecurityContext
{
	public boolean allowed(airlift.AppProfile _appProfile, javax.servlet.http.HttpServletRequest _request);

	public boolean allowed(String _activeRecordClassName,
						   String _domainName,
						   String _method,
						   javax.servlet.http.HttpServletRequest _request,
						   boolean _isCollection);
}