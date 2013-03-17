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

public interface AppProfile
{
	public String getAppName();
	public boolean isView(String _resourceName);
	public String getLookingAt(String _viewName);
	public java.util.Set<String> getValidResources();
	public boolean isValidResource(String _resourceName);
	public java.util.Map<String, java.util.Set<String>> getSecurityRoles(String _resourceName);
}