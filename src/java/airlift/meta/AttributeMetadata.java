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

public class AttributeMetadata
{
	public enum Type {  TEXT, HIDDEN, PASSWORD, TEXTAREA, CHECKBOX, RADIO, SELECT, MULTISELECT }

	public String name = "";
	public String type = "string";
	public boolean isPresentable = true;
	public int displayOrder = 1000; //By default basically use the order returned by the Java compiler.
	public String fieldSetName = "";
	public String label = "";
	public String pluralLabel = "";
	public int displayLength = 32;
	public Type inputType = Type.TEXT;
	public int textAreaRows = 5;
	public int textAreaColumns = 50;
	public String hasFormat = ".*";	
	public boolean readOnly = false;
	public String[] allowedValues = {};
	public String dateTimePattern = "MM-dd-yyyy";
	public String delimiter = ","; //to be used for attributes that are presented as checkboxes, radio buttons, and selects.

	public enum Semantic { NONE, ID, EMAIL, ADDRESS, CREDITCARD, ZIPCODE, PHONENUMBER, VERYLONGTEXT }

	public boolean isPersistable = true;
	public int maxLength = 200;
	public int minLength = 0;
	public boolean isSearchable = false;
	public boolean isIndexable = false;
	public boolean isPrimaryKey = false;
	public boolean isUniqueKey = false;
	public String concept = "";
	public boolean nullable = false;
	public boolean immutable = false;
	public boolean rangeable = false;
	public String minimumValue = null;
	public String maximumValue = null;
	public boolean encrypted = false;
	public Semantic semanticType = Semantic.NONE;

	public AttributeMetadata(String _name)
	{
		this.name = _name;
		this.label = _name;
	}
}