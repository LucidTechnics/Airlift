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

package airlift.servlet.rest; 

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class AirliftUser
{
	public AirliftUser() {}

	@Persistent @PrimaryKey private String id;
	@Persistent private String familyName;
	@Persistent private String givenName;
	@Persistent private String googleUserId;
	@Persistent private String email;
	@Persistent private java.util.List<String> roleList;
	@Persistent private boolean active;
	@Persistent private java.util.Date createDate;
	
	public String getId() { return id; }
	public String getFamilyName() { return familyName; }
	public String getGivenName() { return givenName; }
	public String getGoogleUserId() { return googleUserId; }
	public String getEmail() { return email; }
	public java.util.List<String> getRoleList() { return roleList; }
	public boolean getActive() { return active; }
	public java.util.Date getCreateDate() { return createDate; }

	public void setId(String _id) { id = _id; }
	public void setGoogleUserId(String _googleUserId) { googleUserId = _googleUserId; }
	public void setFamilyName(String _familyName) { familyName = _familyName; }
	public void setGivenName(String _givenName) { givenName = _givenName; }
	public void setEmail(String _email) { email = _email; }
	public void setRoleList(java.util.List<String> _roleList) { roleList = _roleList; }
	public void setActive(boolean _active) { active = _active; }
	public void setCreateDate(java.util.Date _createDate) { createDate = _createDate; }
}