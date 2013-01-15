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

package airlift.meta; 

public class DomainMetadata
{
	public String name = "";

	public boolean isPresented = true;
	public boolean isPersisted = true;
	public boolean isCached = true;
	public boolean isSecured = true;
	public boolean isAudited = false;
	public boolean isChangeTracked = false;

	public java.util.Set<String> collectRoles = new java.util.HashSet<String>();
	public java.util.Set<String> putRoles = new java.util.HashSet<String>();
	public java.util.Set<String> postRoles = new java.util.HashSet<String>();
	public java.util.Set<String> headRoles = new java.util.HashSet<String>();
	public java.util.Set<String> getRoles = new java.util.HashSet<String>();

	public java.util.Map<String, AttributeMetadata> attributeMetaDataMap = new java.util.HashMap<String, AttributeMetadata>();

	public DomainMetadata(String _name)
	{
		this.collectRoles.add("all");
		this.putRoles.add("all");
		this.postRoles.add("all");
		this.headRoles.add("all");
		this.getRoles.add("all");

		AttributeMetadata idMetaData = new AttributeMetadata("id");
		idMetaData.isPrimaryKey = true;
		idMetaData.isUniqueKey = true;
		idMetaData.immutable = true;
		idMetaData.semanticType = AttributeMetadata.Semantic.ID;
		
		this.attributeMetaDataMap.put("id", idMetaData);
	}
}