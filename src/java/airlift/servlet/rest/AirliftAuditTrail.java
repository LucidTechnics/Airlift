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

public class AirliftAuditTrail
{
	public AirliftAuditTrail() {}

	private String id;
	private String resourceId;
	private String action;
	private String method;
	private String resource;
	private String uri;
	private String handlerName;
	private com.google.appengine.api.datastore.Text data;
	private String userId;
	private java.util.Date actionDate;
	private java.util.Date recordDate;
	
	public String getId() { return id; }	
	public String getResourceId() { return resourceId; }
	public String getAction() { return action; }
	public String getMethod() { return method; }
	public String getResource() { return resource; }
	public String getUri() { return uri; }
	public String getHandlerName() { return handlerName; }
	public com.google.appengine.api.datastore.Text getData() { return data; }
	public String getUserId() { return userId; }	
	public java.util.Date getActionDate() { return actionDate; }
	public java.util.Date getRecordDate() { return recordDate; }
	
	public void setId(String _id) { id = _id; }
	public void setResourceId(String _resourceId) { resourceId = _resourceId; }
	public void setAction(String _action) { action = _action; }
	public void setMethod(String _method) { method = _method; }
	public void setResource(String _resource) { resource = _resource; }
	public void setUri(String _uri) { uri = _uri; }
	public void setHandlerName(String _handlerName) { handlerName = _handlerName; }
	public void setData(com.google.appengine.api.datastore.Text _data) { data = _data; }
	public void setUserId(String _userId) { userId = _userId; }
	public void setActionDate(java.util.Date _actionDate) { actionDate = _actionDate; }
	public void setRecordDate(java.util.Date _recordDate) { recordDate = _recordDate; }
}