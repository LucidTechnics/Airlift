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
 * The Class AuditTrail.
 */
public class AirliftAuditTrail
{
	
	/**
	 * Instantiates a new audit trail.
	 */
	public AirliftAuditTrail() {}

	/** The id. */
	private String id;
	
	/** The domain id. */
	private String domainId;
	
	/** The action. */
	private String action;
	
	/** The method. */
	private String method;
	
	/** The domain. */
	private String domain;
	
	/** The uri. */
	private String uri;
	
	/** The handler name. */
	private String handlerName;
	
	/** The data. */
	private com.google.appengine.api.datastore.Text data;
	
	/** The user id. */
	private String userId;
	
	/** The action date. */
	private java.util.Date actionDate;
	
	/** The record date. */
	private java.util.Date recordDate;
	
	/**
	 * Gets the id.
	 *
	 * @return the id
	 */
	public String getId() { return id; }
	
	/**
	 * Gets the domain id.
	 *
	 * @return the domain id
	 */
	public String getDomainId() { return domainId; }
	
	/**
	 * Gets the action.
	 *
	 * @return the action
	 */
	public String getAction() { return action; }
	
	/**
	 * Gets the method.
	 *
	 * @return the method
	 */
	public String getMethod() { return method; }
	
	/**
	 * Gets the domain.
	 *
	 * @return the domain
	 */
	public String getDomain() { return domain; }
	
	/**
	 * Gets the uri.
	 *
	 * @return the uri
	 */
	public String getUri() { return uri; }
	
	/**
	 * Gets the handler name.
	 *
	 * @return the handler name
	 */
	public String getHandlerName() { return handlerName; }
	
	/**
	 * Gets the data.
	 *
	 * @return the data
	 */
	public com.google.appengine.api.datastore.Text getData() { return data; }
	
	/**
	 * Gets the user id.
	 *
	 * @return the user id
	 */
	public String getUserId() { return userId; }
	
	/**
	 * Gets the action date.
	 *
	 * @return the action date
	 */
	public java.util.Date getActionDate() { return actionDate; }
	
	/**
	 * Gets the record date.
	 *
	 * @return the record date
	 */
	public java.util.Date getRecordDate() { return recordDate; }

	/**
	 * Sets the id.
	 *
	 * @param _id the new id
	 */
	public void setId(String _id) { id = _id; }
	
	/**
	 * Sets the domain id.
	 *
	 * @param _domainId the new domain id
	 */
	public void setDomainId(String _domainId) { domainId = _domainId; }
	
	/**
	 * Sets the action.
	 *
	 * @param _action the new action
	 */
	public void setAction(String _action) { action = _action; }
	
	/**
	 * Sets the method.
	 *
	 * @param _method the new method
	 */
	public void setMethod(String _method) { method = _method; }
	
	/**
	 * Sets the domain.
	 *
	 * @param _domain the new domain
	 */
	public void setDomain(String _domain) { domain = _domain; }
	
	/**
	 * Sets the uri.
	 *
	 * @param _uri the new uri
	 */
	public void setUri(String _uri) { uri = _uri; }
	
	/**
	 * Sets the handler name.
	 *
	 * @param _handlerName the new handler name
	 */
	public void setHandlerName(String _handlerName) { handlerName = _handlerName; }
	
	/**
	 * Sets the data.
	 *
	 * @param _data the new data
	 */
	public void setData(com.google.appengine.api.datastore.Text _data) { data = _data; }
	
	/**
	 * Sets the user id.
	 *
	 * @param _userId the new user id
	 */
	public void setUserId(String _userId) { userId = _userId; }
	
	/**
	 * Sets the action date.
	 *
	 * @param _actionDate the new action date
	 */
	public void setActionDate(java.util.Date _actionDate) { actionDate = _actionDate; }
	
	/**
	 * Sets the record date.
	 *
	 * @param _recordDate the new record date
	 */
	public void setRecordDate(java.util.Date _recordDate) { recordDate = _recordDate; }
}