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

public class AirliftUser
{
	public AirliftUser() {}

	private String id;
	private String fullName;
	private String shortName;
	private String externalUserId; //usually Google Id but could be another identifier
	private String email;
	private java.util.Set<String> roleSet = new java.util.HashSet<String>();
	private boolean active;
	private java.util.Date auditPostDate;
	private java.util.Date auditPutDate;
	private java.util.Date timeOutDate;
	
	public String getId() { return id; }
	public String getFullName() { return fullName; }
	public String getShortName() { return shortName; }
	public String getExternalUserId() { return externalUserId; }
	public String getEmail() { return email; }
	public java.util.Set<String> getRoleSet() { return roleSet; }
	public boolean getActive() { return active; }
	public java.util.Date getAuditPostDate() { return auditPostDate; }
	public java.util.Date getAuditPutDate() { return auditPutDate; }
	public java.util.Date getTimeOutDate() { return timeOutDate; }
	
	public void setId(String _id) { id = _id; }
	public void setExternalUserId(String _externalUserId) { externalUserId = _externalUserId; }
	public void setFullName(String _fullName) { fullName = _fullName; }
	public void setShortName(String _shortName) { shortName = _shortName; }
	public void setEmail(String _email) { email = _email; }
	public void setRoleSet(java.util.Set<String> _roleSet) { roleSet = _roleSet; }
	public void setActive(boolean _active) { active = _active; }
	public void setAuditPostDate(java.util.Date _auditPostDate) { auditPostDate = _auditPostDate; }
	public void setAuditPutDate(java.util.Date _auditPutDate) { auditPutDate = _auditPutDate; }
	public void setTimeOutDate(java.util.Date _timeOutDate) { timeOutDate = _timeOutDate; }
	
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[** AirliftUser ...").append("\n");
		stringBuffer.append("fullName:").append(getFullName()).append("\n");
		stringBuffer.append("shortName:").append(getShortName()).append("\n");
		stringBuffer.append("externalUserId:").append(getExternalUserId()).append("\n");
		stringBuffer.append("email:").append(getEmail()).append("\n");
		stringBuffer.append("roleSet:").append(getRoleSet()).append("\n");
		stringBuffer.append("active:").append(getActive()).append("\n");
		stringBuffer.append("auditPostDate:").append(getAuditPostDate()).append("\n");
		stringBuffer.append("auditPutDate:").append(getAuditPutDate()).append("\n");
		stringBuffer.append("timeOutDate:").append(getTimeOutDate()).append("\n");
		stringBuffer.append("id:").append(getId()).append("\n"); 
		stringBuffer.append("**]\n");

		return stringBuffer.toString();
	}
}