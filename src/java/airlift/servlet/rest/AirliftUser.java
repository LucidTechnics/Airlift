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
 * The Class AirliftUser.
 */
public class AirliftUser
{
	
	/**
	 * Instantiates a new airlift user.
	 */
	public AirliftUser() {}

	/** The id. */
	private String id;
	
	/** The full name. */
	private String fullName;
	
	/** The short name. */
	private String shortName;
	
	/** The external user id. */
	private String externalUserId; //usually Google Id but could be another identifier
	
	/** The email. */
	private String email;
	
	/** The role set. */
	private java.util.Set<String> roleSet = new java.util.HashSet<String>();
	
	/** The active. */
	private boolean active;
	
	/** The audit post date. */
	private java.util.Date auditPostDate;
	
	/** The audit put date. */
	private java.util.Date auditPutDate;
	
	/** The time out date. */
	private java.util.Date timeOutDate;
	
	/**
	 * Gets the id.
	 *
	 * @return the id
	 */
	public String getId() { return id; }
	
	/**
	 * Gets the full name.
	 *
	 * @return the full name
	 */
	public String getFullName() { return fullName; }
	
	/**
	 * Gets the short name.
	 *
	 * @return the short name
	 */
	public String getShortName() { return shortName; }
	
	/**
	 * Gets the external user id.
	 *
	 * @return the external user id
	 */
	public String getExternalUserId() { return externalUserId; }
	
	/**
	 * Gets the email.
	 *
	 * @return the email
	 */
	public String getEmail() { return email; }
	
	/**
	 * Gets the role set.
	 *
	 * @return the role set
	 */
	public java.util.Set<String> getRoleSet() { return roleSet; }
	
	/**
	 * Gets the active.
	 *
	 * @return the active
	 */
	public boolean getActive() { return active; }
	
	/**
	 * Gets the audit post date.
	 *
	 * @return the audit post date
	 */
	public java.util.Date getAuditPostDate() { return auditPostDate; }
	
	/**
	 * Gets the audit put date.
	 *
	 * @return the audit put date
	 */
	public java.util.Date getAuditPutDate() { return auditPutDate; }
	
	/**
	 * Gets the time out date.
	 *
	 * @return the time out date
	 */
	public java.util.Date getTimeOutDate() { return timeOutDate; }
	
	/**
	 * Sets the id.
	 *
	 * @param _id the new id
	 */
	public void setId(String _id) { id = _id; }
	
	/**
	 * Sets the external user id.
	 *
	 * @param _externalUserId the new external user id
	 */
	public void setExternalUserId(String _externalUserId) { externalUserId = _externalUserId; }
	
	/**
	 * Sets the full name.
	 *
	 * @param _fullName the new full name
	 */
	public void setFullName(String _fullName) { fullName = _fullName; }
	
	/**
	 * Sets the short name.
	 *
	 * @param _shortName the new short name
	 */
	public void setShortName(String _shortName) { shortName = _shortName; }
	
	/**
	 * Sets the email.
	 *
	 * @param _email the new email
	 */
	public void setEmail(String _email) { email = _email; }
	
	/**
	 * Sets the role set.
	 *
	 * @param _roleSet the new role set
	 */
	public void setRoleSet(java.util.Set<String> _roleSet) { roleSet = _roleSet; }
	
	/**
	 * Sets the active.
	 *
	 * @param _active the new active
	 */
	public void setActive(boolean _active) { active = _active; }
	
	/**
	 * Sets the audit post date.
	 *
	 * @param _auditPostDate the new audit post date
	 */
	public void setAuditPostDate(java.util.Date _auditPostDate) { auditPostDate = _auditPostDate; }
	
	/**
	 * Sets the audit put date.
	 *
	 * @param _auditPutDate the new audit put date
	 */
	public void setAuditPutDate(java.util.Date _auditPutDate) { auditPutDate = _auditPutDate; }
	
	/**
	 * Sets the time out date.
	 *
	 * @param _timeOutDate the new time out date
	 */
	public void setTimeOutDate(java.util.Date _timeOutDate) { timeOutDate = _timeOutDate; }
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
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