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

package airlift.domain;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// TODO: Auto-generated Javadoc
/**
 * The Class DomainConfiguration.
 */
public class DomainConfiguration
{
	
	/** The Constant string. */
	public static final String string = "string";
	
	/** The Constant number. */
	public static final String number = "number";
	
	/** The Constant collection. */
	public static final String collection = "collection";

    /** The domain entry map. */
    private Map<String, DomainEntry> domainEntryMap;
    
    /**
     * Gets the domain entry map.
     *
     * @return the domain entry map
     */
    private Map<String, DomainEntry> getDomainEntryMap() { return domainEntryMap; }
    
    /**
     * Sets the domain entry map.
     *
     * @param _domainEntryMap the _domain entry map
     */
    private void setDomainEntryMap(Map<String, DomainEntry> _domainEntryMap) { domainEntryMap = _domainEntryMap; }

    /**
     * Instantiates a new domain configuration.
     */
    public DomainConfiguration()
    {
		setDomainEntryMap(new HashMap<String, DomainEntry>());
    }

	/**
	 * Inits the.
	 *
	 * @param _name the _name
	 * @return the domain entry
	 */
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
	
    /**
     * Inits the.
     *
     * @param _name the _name
     * @param _display the _display
     * @param _plural the _plural
     * @return the domain entry
     */
    public DomainEntry init(String _name, String _display, String _plural)
	{
		DomainEntry domainEntry = init(_name);

		domainEntry.setDisplay(_display.trim());
		domainEntry.setPlural(_plural.trim());
		domainEntry.setRepresentationString("Representation String for domain: " + domainEntry.getDisplay() + " was not yet defined");

		return domainEntry;
    }

	/**
	 * Inits the.
	 *
	 * @param _name the _name
	 * @param _display the _display
	 * @param _plural the _plural
	 * @param _representationString the _representation string
	 * @return the domain entry
	 */
	public DomainEntry init(String _name, String _display, String _plural, String _representationString)
	{
		DomainEntry domainEntry = init(_name.trim(), _display.trim(), _plural.trim());

		domainEntry.setRepresentationString(_representationString.trim());

		return domainEntry;
	}

    /**
     * The Class DomainEntry.
     */
    public class DomainEntry
    {
		
		/** The name. */
		private String name;
		
		/** The display. */
		private String display;
		
		/** The plural. */
		private String plural;
		
		/** The representation string. */
		private String representationString = "Not yet defined";
		
		/** The validate all fields. */
		private boolean validateAllFields;
		
		/** The field entry map. */
		private Map<String, FieldEntry> fieldEntryMap;
		
		/** The field entry list. */
		private List<String> fieldEntryList;

		/**
		 * Gets the name.
		 *
		 * @return the name
		 */
		public String getName() { return name; }
		
		/**
		 * Gets the display.
		 *
		 * @return the display
		 */
		public String getDisplay() { return display; }
		
		/**
		 * Gets the plural.
		 *
		 * @return the plural
		 */
		public String getPlural() { return plural; }
		
		/**
		 * Gets the representation string.
		 *
		 * @return the representation string
		 */
		public String getRepresentationString() { return representationString; }
		
		/**
		 * Gets the validate all fields.
		 *
		 * @return the validate all fields
		 */
		public boolean getValidateAllFields() { return validateAllFields; }
		
		/**
		 * Gets the field entry map.
		 *
		 * @return the field entry map
		 */
		private Map<String, FieldEntry> getFieldEntryMap() { return fieldEntryMap; }
		
		/**
		 * Gets the field entry list.
		 *
		 * @return the field entry list
		 */
		private List<String> getFieldEntryList() { return fieldEntryList; }
		
		/**
		 * Sets the name.
		 *
		 * @param _name the _name
		 * @return the domain entry
		 */
		public DomainEntry setName(String _name) { name = _name; return this; }
		
		/**
		 * Sets the display.
		 *
		 * @param _display the _display
		 * @return the domain entry
		 */
		public DomainEntry setDisplay(String _display) { display = _display; return this; } 
		
		/**
		 * Sets the plural.
		 *
		 * @param _plural the _plural
		 * @return the domain entry
		 */
		public DomainEntry setPlural(String _plural) { plural = _plural; return this; }
		
		/**
		 * Sets the representation string.
		 *
		 * @param _representationString the _representation string
		 * @return the domain entry
		 */
		public DomainEntry setRepresentationString(String _representationString) { representationString = _representationString; return this; }
		
		/**
		 * Sets the validate all fields.
		 *
		 * @param _validateAllFields the _validate all fields
		 * @return the domain entry
		 */
		public DomainEntry setValidateAllFields(boolean _validateAllFields) { validateAllFields = _validateAllFields; return this; }
		
		/**
		 * Sets the field entry map.
		 *
		 * @param _fieldEntryMap the _field entry map
		 */
		public void setFieldEntryMap(Map<String, FieldEntry> _fieldEntryMap) { fieldEntryMap = _fieldEntryMap; }
		
		/**
		 * Sets the field entry list.
		 *
		 * @param _fieldEntryList the new field entry list
		 */
		public void setFieldEntryList(List<String> _fieldEntryList) { fieldEntryList = _fieldEntryList; }
		
		/**
		 * Instantiates a new domain entry.
		 */
		public DomainEntry()
		{
			setValidateAllFields(false);
			setFieldEntryMap(new HashMap<String, FieldEntry>());
			setFieldEntryList(new ArrayList<String>());
		}

		/**
		 * Inits the.
		 *
		 * @param _name the _name
		 * @return the field entry
		 */
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

		/**
		 * Gets the field entry.
		 *
		 * @param _name the _name
		 * @return the field entry
		 */
		public FieldEntry getFieldEntry(String _name)
		{
			return getFieldEntryMap().get(_name.trim());
		}

		/**
		 * Gets the field names.
		 *
		 * @return the field names
		 */
		public List<String> getFieldNames()
		{
			return new ArrayList<String>(getFieldEntryList());
		}

		/**
		 * Removes the.
		 *
		 * @param _fieldEntryName the _field entry name
		 */
		public void remove(String _fieldEntryName)
		{
			getFieldEntryMap().remove(_fieldEntryName);
			getFieldEntryList().remove(_fieldEntryName);
		}
	}
	
	/**
	 * The Class FieldEntry.
	 */
	public class FieldEntry
	{		
		
		/** The name. */
		protected String name = "";
		
		/** The type. */
		protected String type = DomainConfiguration.string;
		
		/** The v rule map. */
		protected Map<String, Object> vRuleMap;
		
		/** The d rule map. */
		protected Map<String, Object> dRuleMap;
		
		/**
		 * Gets the name.
		 *
		 * @return the name
		 */
		public String getName() { return name; }
		
		/**
		 * Gets the type.
		 *
		 * @return the type
		 */
		public String getType() { return type; }
		
		/**
		 * Gets the v rule map.
		 *
		 * @return the v rule map
		 */
		public Map<String, Object> getVRuleMap() { return vRuleMap; }
		
		/**
		 * Gets the d rule map.
		 *
		 * @return the d rule map
		 */
		public Map<String, Object> getDRuleMap() { return dRuleMap; }

		/**
		 * Sets the name.
		 *
		 * @param _name the _name
		 * @return the field entry
		 */
		public FieldEntry setName(String _name) { name = _name.trim(); return this; }
		
		/**
		 * Sets the type.
		 *
		 * @param _type the _type
		 * @return the field entry
		 */
		public FieldEntry setType(String _type) { type = _type.trim(); return this; }
		
		/**
		 * Sets the v rule map.
		 *
		 * @param _vRuleMap the _v rule map
		 */
		protected void setVRuleMap(Map<String, Object> _vRuleMap) { vRuleMap = _vRuleMap; }
		
		/**
		 * Sets the d rule map.
		 *
		 * @param _dRuleMap the _d rule map
		 */
		protected void setDRuleMap(Map<String, Object> _dRuleMap) { dRuleMap = _dRuleMap; }
	
		/**
		 * Instantiates a new field entry.
		 */
		FieldEntry()
		{
			setVRuleMap(new HashMap<String, Object>());
			setDRuleMap(new HashMap<String, Object>());
		}

		/**
		 * Instantiates a new field entry.
		 *
		 * @param _name the _name
		 */
		FieldEntry(String _name) { this(); setName(_name); }
		
		/**
		 * Instantiates a new field entry.
		 *
		 * @param _name the _name
		 * @param _type the _type
		 */
		FieldEntry(String _name, String _type) { this(_name); setType(_type); }

		/**
		 * Adds the v rule.
		 *
		 * @param _name the _name
		 * @param _parameters the _parameters
		 * @return the field entry
		 */
		public FieldEntry addVRule(String _name, Object _parameters)
		{
			getVRuleMap().put(_name, _parameters);

			return this;
		}

		/**
		 * Adds the d rule.
		 *
		 * @param _name the _name
		 * @param _parameters the _parameters
		 * @return the field entry
		 */
		public FieldEntry addDRule(String _name, Object _parameters)
		{
			getDRuleMap().put(_name, _parameters);

			return this;
		}

		/**
		 * Clear v rules.
		 */
		public void clearVRules() { getVRuleMap().clear(); }
	}

	/**
	 * Checks for v rule.
	 *
	 * @param _domainName the _domain name
	 * @param _fieldName the _field name
	 * @param _ruleName the _rule name
	 * @return true, if successful
	 */
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
	
	/**
	 * Gets the domain entry.
	 *
	 * @param _name the _name
	 * @return the domain entry
	 */
	public DomainEntry getDomainEntry(String _name)
	{
		return getDomainEntryMap().get(StringUtils.capitalize(_name.trim()));
	}

	/**
	 * Checks if is domain entry.
	 *
	 * @param _name the _name
	 * @return true, if is domain entry
	 */
	public boolean isDomainEntry(String _name)
	{
		String name = (_name == null) ? "" : _name.trim();		

		return (getDomainEntry(name.trim()) != null);
	}

	/**
	 * Checks if is collection.
	 *
	 * @param _name the _name
	 * @return true, if is collection
	 */
	public boolean isCollection(String _name)
	{
		String name = (_name == null) ? "" : _name.trim();		

		return ("collection".equalsIgnoreCase(name) == true);
	}

	/**
	 * Checks if is field entry.
	 *
	 * @param _domainName the _domain name
	 * @param _fieldName the _field name
	 * @return true, if is field entry
	 */
	public boolean isFieldEntry(String _domainName, String _fieldName)
	{
		String fieldName = (_fieldName == null) ? "" : _fieldName.trim();		
		String domainName = (_domainName == null) ? "" : _domainName.trim();
		
		return (getFieldEntry(domainName, fieldName) != null);
	}

	/**
	 * Gets the display.
	 *
	 * @param _name the _name
	 * @return the display
	 */
	public String getDisplay(String _name)
	{
		return getDomainEntry(_name.trim()).getName();
	}

	/**
	 * Gets the plural.
	 *
	 * @param _name the _name
	 * @return the plural
	 */
	public String getPlural(String _name)
	{
		return getDomainEntry(_name.trim()).getPlural();
	}

	/**
	 * Gets the field entry.
	 *
	 * @param _domainEntryName the _domain entry name
	 * @param _fieldEntryName the _field entry name
	 * @return the field entry
	 */
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

	/**
	 * Gets the field names.
	 *
	 * @param _domainName the _domain name
	 * @return the field names
	 */
	public List<String> getFieldNames(String _domainName)
	{
		DomainEntry domainEntry = getDomainEntry(_domainName);

		return (domainEntry != null) ? domainEntry.getFieldNames() : new ArrayList<String>();
	}		
}