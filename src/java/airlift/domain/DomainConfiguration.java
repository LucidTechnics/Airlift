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

package airlift.domain;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.commons.lang.StringUtils;

public class DomainConfiguration
{
	public static final String string = "string";
	public static final String number = "number";
	public static final String collection = "collection";

    private Map<String, DomainEntry> domainEntryMap;
    
    private Map<String, DomainEntry> getDomainEntryMap() { return domainEntryMap; }
    private void setDomainEntryMap(Map<String, DomainEntry> _domainEntryMap) { domainEntryMap = _domainEntryMap; }

    public DomainConfiguration()
    {
		setDomainEntryMap(new HashMap<String, DomainEntry>());
    }

	public DomainEntry init(String _name)
	{
		String name = StringUtils.capitalize(_name.trim());
		
		if (isDomainEntry(_name) == false)
		{
			DomainEntry domainEntry = new DomainEntry();
			domainEntry.setName(name);
			getDomainEntryMap().put(domainEntry.getName(), domainEntry);
		}

		return getDomainEntryMap().get(name);
	}
	
    public DomainEntry init(String _name, String _display, String _plural)
	{
		DomainEntry domainEntry = init(_name);

		domainEntry.setDisplay(_display.trim());
		domainEntry.setPlural(_plural.trim());
		domainEntry.setRepresentationString("Representation String for domain: " + domainEntry.getDisplay() + " was not yet defined");

		return domainEntry;
    }

	public DomainEntry init(String _name, String _display, String _plural, String _representationString)
	{
		DomainEntry domainEntry = init(_name.trim(), _display.trim(), _plural.trim());

		domainEntry.setRepresentationString(_representationString.trim());

		return domainEntry;
	}

    public class DomainEntry
    {
		private String name;
		private String display;
		private String plural;
		private String representationString = "Not yet defined";
		private boolean validateAllFields;
		private Map<String, FieldEntry> fieldEntryMap;
		private List<String> fieldEntryList;

		public String getName() { return name; }
		public String getDisplay() { return display; }
		public String getPlural() { return plural; }
		public String getRepresentationString() { return representationString; }
		public boolean getValidateAllFields() { return validateAllFields; }
		private Map<String, FieldEntry> getFieldEntryMap() { return fieldEntryMap; }
		private List<String> getFieldEntryList() { return fieldEntryList; }
		
		public DomainEntry setName(String _name) { name = _name; return this; }
		public DomainEntry setDisplay(String _display) { display = _display; return this; } 
		public DomainEntry setPlural(String _plural) { plural = _plural; return this; }
		public DomainEntry setRepresentationString(String _representationString) { representationString = _representationString; return this; }
		public DomainEntry setValidateAllFields(boolean _validateAllFields) { validateAllFields = _validateAllFields; return this; }
		public void setFieldEntryMap(Map<String, FieldEntry> _fieldEntryMap) { fieldEntryMap = _fieldEntryMap; }
		public void setFieldEntryList(List<String> _fieldEntryList) { fieldEntryList = _fieldEntryList; }
		
		public DomainEntry()
		{
			setValidateAllFields(false);
			setFieldEntryMap(new HashMap<String, FieldEntry>());
			setFieldEntryList(new ArrayList<String>());
		}

		public FieldEntry init(String _name)
		{
			String name = _name.trim();

			FieldEntry fieldEntry = getFieldEntry(name);

			if (fieldEntry == null)
			{
				fieldEntry = new FieldEntry();
				fieldEntry.setName(name);
				getFieldEntryMap().put(name, fieldEntry);
				getFieldEntryList().add(name);
			}
			
			return fieldEntry;
		}

		public FieldEntry getFieldEntry(String _name)
		{
			return getFieldEntryMap().get(_name.trim());
		}

		public List<String> getFieldNames()
		{
			return new ArrayList<String>(getFieldEntryList());
		}

		public void remove(String _fieldEntryName)
		{
			getFieldEntryMap().remove(_fieldEntryName);
			getFieldEntryList().remove(_fieldEntryName);
		}
	}
	
	public class FieldEntry
	{		
		protected String name = "";
		protected String type = DomainConfiguration.string;
		protected Map<String, Object> vRuleMap;
		protected Map<String, Object> dRuleMap;
		
		public String getName() { return name; }
		public String getType() { return type; }
		public Map<String, Object> getVRuleMap() { return vRuleMap; }
		public Map<String, Object> getDRuleMap() { return dRuleMap; }

		public FieldEntry setName(String _name) { name = _name.trim(); return this; }
		public FieldEntry setType(String _type) { type = _type.trim(); return this; }
		
		protected void setVRuleMap(Map<String, Object> _vRuleMap) { vRuleMap = _vRuleMap; }
		protected void setDRuleMap(Map<String, Object> _dRuleMap) { dRuleMap = _dRuleMap; }
	
		FieldEntry()
		{
			setVRuleMap(new HashMap<String, Object>());
			setDRuleMap(new HashMap<String, Object>());
		}

		FieldEntry(String _name) { this(); setName(_name); }
		FieldEntry(String _name, String _type) { this(_name); setType(_type); }

		public FieldEntry addVRule(String _name, Object _parameters)
		{
			getVRuleMap().put(_name, _parameters);

			return this;
		}

		public FieldEntry addDRule(String _name, Object _parameters)
		{
			getDRuleMap().put(_name, _parameters);

			return this;
		}

		public void clearVRules() { getVRuleMap().clear(); }
	}

	public boolean hasVRule(String _domainName, String _fieldName, String _ruleName)
	{
		boolean hasVRule = false;
		
		FieldEntry fieldEntry = getFieldEntry(_domainName, _fieldName);

		if (fieldEntry != null)
		{
			hasVRule = (fieldEntry.getVRuleMap().get(_ruleName) != null);
		}

		return hasVRule;
	}
	
	public DomainEntry getDomainEntry(String _name)
	{
		return getDomainEntryMap().get(StringUtils.capitalize(_name.trim()));
	}

	public boolean isDomainEntry(String _name)
	{
		String name = (_name == null) ? "" : _name.trim();		

		return (getDomainEntry(name.trim()) != null);
	}

	public boolean isCollection(String _name)
	{
		String name = (_name == null) ? "" : _name.trim();		

		return ("collection".equalsIgnoreCase(name) == true);
	}

	public boolean isFieldEntry(String _domainName, String _fieldName)
	{
		String fieldName = (_fieldName == null) ? "" : _fieldName.trim();		
		String domainName = (_domainName == null) ? "" : _domainName.trim();
		
		return (getFieldEntry(domainName, fieldName) != null);
	}

	public String getDisplay(String _name)
	{
		return getDomainEntry(_name.trim()).getName();
	}

	public String getPlural(String _name)
	{
		return getDomainEntry(_name.trim()).getPlural();
	}

	public FieldEntry getFieldEntry(String _domainEntryName, String _fieldEntryName)
	{
		FieldEntry fieldEntry = null;
		
		DomainEntry domainEntry = getDomainEntry(_domainEntryName);

		if (domainEntry != null)
		{
			fieldEntry = domainEntry.getFieldEntry(_fieldEntryName);
		}

		return fieldEntry;
	}

	public List<String> getFieldNames(String _domainName)
	{
		DomainEntry domainEntry = getDomainEntry(_domainName);

		return (domainEntry != null) ? domainEntry.getFieldNames() : new ArrayList<String>();
	}		
}