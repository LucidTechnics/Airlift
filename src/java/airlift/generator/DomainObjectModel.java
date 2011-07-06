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

package airlift.generator;

import java.util.*;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class DomainObjectModel.
 */
public class DomainObjectModel
{
	
	/** The package name. */
	private String packageName;
	
	/** The build package name. */
	private String buildPackageName;
	
	/** The class name. */
	private String className;
	
	/** The app name. */
	private String appName;
	
	/** The is abstract. */
	private boolean isAbstract;
	
	/** The is referenced. */
	private boolean isReferenced;
	
	/** The is audited. */
	private boolean isAudited;
	
	/** The domain annotation set. */
	private Set<Annotation> domainAnnotationSet;
	
	/** The attribute annotation set map. */
	private Map<Attribute, Set<Annotation>> attributeAnnotationSetMap;
	
	/** The attribute name map. */
	private Map<String, Attribute> attributeNameMap;
	
	/** The annotation name set. */
	private Set<String> annotationNameSet;
	
	/** The attribute list. */
	private List<Attribute> attributeList;
	
	/** The direct super class set. */
	private Set<String> directSuperClassSet;
	
	/** The root package name. */
	private String rootPackageName;
	
	/** The table name. */
	private String tableName;
	
	/** The is clockable. */
	private boolean isClockable;
	
	/** The reserved property name set. */
	protected Set reservedPropertyNameSet;
	
	/** The attribute count. */
	protected int attributeCount;
	
	/** The is prepared already. */
	protected boolean isPreparedAlready;

	/**
	 * Gets the package name.
	 *
	 * @return the package name
	 */
	public String getPackageName() { return packageName; }
	
	/**
	 * Gets the builds the package name.
	 *
	 * @return the builds the package name
	 */
	public String getBuildPackageName() { return buildPackageName; }
	
	/**
	 * Gets the class name.
	 *
	 * @return the class name
	 */
	public String getClassName() { return upperTheFirstCharacter(className); }
	
	/**
	 * Gets the app name.
	 *
	 * @return the app name
	 */
	public String getAppName() { return appName; }
	
	/**
	 * Gets the checks if is abstract.
	 *
	 * @return the checks if is abstract
	 */
	public boolean getIsAbstract() { return isAbstract; }
	
	/**
	 * Gets the checks if is referenced.
	 *
	 * @return the checks if is referenced
	 */
	public boolean getIsReferenced() { return isReferenced; }
	
	/**
	 * Gets the checks if is audited.
	 *
	 * @return the checks if is audited
	 */
	public boolean getIsAudited() { return isAudited; }
	
	/**
	 * Gets the domain annotation set.
	 *
	 * @return the domain annotation set
	 */
	public Set<Annotation> getDomainAnnotationSet() { return domainAnnotationSet; }
	
	/**
	 * Gets the attribute annotation set map.
	 *
	 * @return the attribute annotation set map
	 */
	public Map<Attribute, Set<Annotation>> getAttributeAnnotationSetMap() { return attributeAnnotationSetMap; }
	
	/**
	 * Gets the attribute name map.
	 *
	 * @return the attribute name map
	 */
	public Map<String, Attribute> getAttributeNameMap() { return attributeNameMap;  }
	
	/**
	 * Gets the annotation name set.
	 *
	 * @return the annotation name set
	 */
	public Set<String> getAnnotationNameSet() { return annotationNameSet; }
	
	/**
	 * Gets the attribute list.
	 *
	 * @return the attribute list
	 */
	public List<Attribute> getAttributeList() { return attributeList; }
	
	/**
	 * Gets the direct super class set.
	 *
	 * @return the direct super class set
	 */
	public Set<String> getDirectSuperClassSet() { return directSuperClassSet; }
	
	/**
	 * Gets the root package name.
	 *
	 * @return the root package name
	 */
	public String getRootPackageName() { return rootPackageName; }
	
	/**
	 * Gets the checks if is clockable.
	 *
	 * @return the checks if is clockable
	 */
	public boolean getIsClockable() { return isClockable; }
	
	/**
	 * Gets the reserved property name set.
	 *
	 * @return the reserved property name set
	 */
	protected Set getReservedPropertyNameSet() { return reservedPropertyNameSet; }
	
	/**
	 * Gets the attribute count.
	 *
	 * @return the attribute count
	 */
	public int getAttributeCount()  { return attributeCount; }

	/**
	 * Sets the package name.
	 *
	 * @param _packageName the new package name
	 */
	public void setPackageName(String _packageName) { packageName = _packageName.toLowerCase(); }
	
	/**
	 * Sets the builds the package name.
	 *
	 * @param _buildPackageName the new builds the package name
	 */
	public void setBuildPackageName(String _buildPackageName) { buildPackageName = _buildPackageName; }
	
	/**
	 * Sets the class name.
	 *
	 * @param _className the new class name
	 */
	public void setClassName(String _className) { className = upperTheFirstCharacter(_className); }
	
	/**
	 * Sets the app name.
	 *
	 * @param _appName the new app name
	 */
	public void setAppName(String _appName) { appName = _appName; }
	
	/**
	 * Sets the checks if is abstract.
	 *
	 * @param _isAbstract the new checks if is abstract
	 */
	public void setIsAbstract(boolean _isAbstract) { isAbstract = _isAbstract; }
	
	/**
	 * Sets the checks if is referenced.
	 *
	 * @param _isReferenced the new checks if is referenced
	 */
	public void setIsReferenced(boolean _isReferenced) { isReferenced = _isReferenced; }
	
	/**
	 * Sets the checks if is audited.
	 *
	 * @param _isAudited the new checks if is audited
	 */
	public void setIsAudited(boolean _isAudited) { isAudited = _isAudited; }
	
	/**
	 * Sets the domain annotation set.
	 *
	 * @param _domainAnnotationSet the new domain annotation set
	 */
	public void setDomainAnnotationSet(Set<Annotation> _domainAnnotationSet) { domainAnnotationSet = _domainAnnotationSet; }
	
	/**
	 * Sets the attribute annotation set map.
	 *
	 * @param _attributeAnnotationSetMap the _attribute annotation set map
	 */
	public void setAttributeAnnotationSetMap(Map<Attribute, Set<Annotation>> _attributeAnnotationSetMap) { attributeAnnotationSetMap = _attributeAnnotationSetMap; }
	
	/**
	 * Sets the attribute name map.
	 *
	 * @param _attributeNameMap the _attribute name map
	 */
	public void setAttributeNameMap(Map<String, Attribute> _attributeNameMap) { attributeNameMap = _attributeNameMap; }
	
	/**
	 * Sets the annotation name set.
	 *
	 * @param _annotationNameSet the new annotation name set
	 */
	public void setAnnotationNameSet(Set<String> _annotationNameSet) { annotationNameSet = _annotationNameSet; }
	
	/**
	 * Sets the attribute list.
	 *
	 * @param _attributeList the new attribute list
	 */
	public void setAttributeList(List<Attribute> _attributeList) { attributeList = _attributeList; }
	
	/**
	 * Sets the direct super class set.
	 *
	 * @param _directSuperClassSet the new direct super class set
	 */
	public void setDirectSuperClassSet(Set<String> _directSuperClassSet) { directSuperClassSet = _directSuperClassSet; }
	
	/**
	 * Sets the root package name.
	 *
	 * @param _rootPackageName the new root package name
	 */
	public void setRootPackageName(String _rootPackageName) { rootPackageName = _rootPackageName; }
	
	/**
	 * Sets the table name.
	 *
	 * @param _tableName the new table name
	 */
	public void setTableName(String _tableName) { tableName = _tableName; }
	
	/**
	 * Sets the checks if is clockable.
	 *
	 * @param _isClockable the new checks if is clockable
	 */
	public void setIsClockable(boolean _isClockable) { isClockable = _isClockable; }
	
	/**
	 * Sets the reserved property name set.
	 *
	 * @param _reservedPropertyNameSet the new reserved property name set
	 */
	protected void setReservedPropertyNameSet(Set _reservedPropertyNameSet) { reservedPropertyNameSet = _reservedPropertyNameSet; }
	
	/**
	 * Sets the attribute count.
	 *
	 * @param _attributeCount the new attribute count
	 */
	public void setAttributeCount(int _attributeCount) { attributeCount = _attributeCount; }
	
    /** The log. */
    private static Logger log = Logger.getLogger(DomainObjectModel.class.getName());

	/**
	 * Instantiates a new domain object model.
	 */
	public DomainObjectModel()
	{
		setReservedPropertyNameSet(new HashSet());

		getReservedPropertyNameSet().add("source");
		getReservedPropertyNameSet().add("clock");
		getReservedPropertyNameSet().add("hash");
		getReservedPropertyNameSet().add("createDate");
		getReservedPropertyNameSet().add("updateDate");

		setAttributeNameMap(new HashMap<String, Attribute>());
		setAnnotationNameSet(new HashSet<String>());
		setDomainAnnotationSet(new HashSet<Annotation>());
		setAttributeAnnotationSetMap(new HashMap<Attribute, Set<Annotation>>());
		setAttributeList(new ArrayList<Attribute>());
		setDirectSuperClassSet(new HashSet<String>());
	}

	/**
	 * Checks if is clockable.
	 *
	 * @return true, if is clockable
	 */
	public boolean isClockable()
	{
		return isClockable;
	}

	/**
	 * Adds the annotation.
	 *
	 * @param _attribute the _attribute
	 * @param _annotation the _annotation
	 */
	public void addAnnotation(Attribute _attribute, Annotation _annotation)
	{
		int attributeIndex = getAttributeList().size();
		addAnnotation(_attribute, attributeIndex, _annotation);
	}

	/**
	 * Adds the annotation.
	 *
	 * @param _attribute the _attribute
	 * @param _attributeIndex the _attribute index
	 * @param _annotation the _annotation
	 */
	public void addAnnotation(Attribute _attribute, int _attributeIndex, Annotation _annotation)
	{
		if (getReservedPropertyNameSet().contains(_attribute.getName()) == true)
		{
			log.warning("!!!!WARNING!!!! You should not use property name: "  + _attribute.getName() + " as it is a reserved property name for the airlift.Clockable marker interface.");
			log.warning("!!!!WARNING!!!! You should not use property name: "  + _attribute.getName() + " as it is a reserved property name for the airlift.Clockable marker interface.");
			log.warning("!!!!WARNING!!!! You should not use property name: "  + _attribute.getName() + " as it is a reserved property name for the airlift.Clockable marker interface.");
		}

		if (getAttributeList().contains(_attribute) == false)
		{
			if (_attributeIndex < getAttributeList().size())
			{
				getAttributeList().add(_attributeIndex, _attribute);
			}
			else
			{
				getAttributeList().add(_attribute);
			}
			
			getAttributeNameMap().put(_attribute.getName(), _attribute);
		}

		Set<Annotation> annotationSet = getAttributeAnnotationSetMap().get(_attribute);

		if (annotationSet == null)
		{
			annotationSet = new HashSet<Annotation>();
			getAttributeAnnotationSetMap().put(_attribute, annotationSet);
		}

		if (annotationSet.contains(_annotation) == true)
		{
			annotationSet.remove(_annotation);
		}

		annotationSet.add(_annotation);
		getAnnotationNameSet().add(_annotation.getName());
	}

	/**
	 * Gets the attribute by name.
	 *
	 * @param _name the _name
	 * @return the attribute by name
	 */
	public Attribute getAttributeByName(String _name)
	{
		return getAttributeNameMap().get(_name);
	}
	
	/**
	 * Gets the attributes.
	 *
	 * @return the attributes
	 */
	public Iterator<Attribute> getAttributes()
	{
		return (new ArrayList(getAttributeList())).iterator();
	}
	
	/**
	 * Gets the annotation.
	 *
	 * @param _attribute the _attribute
	 * @param _annotationName the _annotation name
	 * @return the annotation
	 */
	public Annotation getAnnotation(Attribute _attribute, String _annotationName)
	{
		Annotation annotation = null;
		boolean annotationFound = false;
		
		Set<Annotation> annotationSet = getAttributeAnnotationSetMap().get(_attribute);

		if (annotationSet != null)
		{
			java.util.Iterator annotations = annotationSet.iterator();
			
			while (annotations.hasNext() && annotationFound == false)
			{
				Annotation candidate = (Annotation) annotations.next();
				
				if (candidate.getName().equals(_annotationName) == true)
				{
					annotation = candidate;
					annotationFound = true;
				}
			}
		}

		return annotation;
	}

	/**
	 * Gets the attribute.
	 *
	 * @param _annotationType the _annotation type
	 * @param _annotationName the _annotation name
	 * @return the attribute
	 */
	public List<Attribute> getAttribute(String _annotationType, String _annotationName)
	{
		List<Attribute> attributeList = new ArrayList<Attribute>();
		
		for (Attribute attribute: getAttributeAnnotationSetMap().keySet())
		{
			Annotation annotation = getAnnotation(attribute, "airlift.generator.Persistable");

			if (annotation != null)
			{
				String value = ((String) annotation.getParameterValue("isPrimaryKey()")).trim();

				if (value != null)
				{
					attributeList.add(attribute);
				}
			}
		}

		return attributeList;
	}
			
	/**
	 * Contains.
	 *
	 * @param _attribute the _attribute
	 * @param _annotation the _annotation
	 * @return true, if successful
	 */
	public boolean contains(Attribute _attribute, Annotation _annotation)
	{
		boolean contains = false;

		Set<Annotation> annotationSet = getAttributeAnnotationSetMap().get(_attribute);

		if (annotationSet != null)
		{
			contains = annotationSet.contains(_annotation);
		}
		
		return contains;
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("DomainObjectModel\n");
		stringBuffer.append("packageName --> " + packageName).append("\n");
		stringBuffer.append("className --> " + className).append("\n");
		stringBuffer.append("rootPackageName --> " + rootPackageName).append("\n");
		stringBuffer.append("attributeAnnotationSetMap --> " + attributeAnnotationSetMap).append("\n");
		stringBuffer.append("directSuperClassSet --> " + directSuperClassSet).append("\n");

		return stringBuffer.toString();
	}

	/**
	 * Gets the fully qualified class name.
	 *
	 * @return the fully qualified class name
	 */
	public String getFullyQualifiedClassName()
	{
		return getPackageName().trim() + "." + getClassName().trim();
	}

	/**
	 * Upper the first character.
	 *
	 * @param _string the _string
	 * @return the string
	 */
	public String upperTheFirstCharacter(String _string)
	{
		String string = null;

		if (_string != null && _string.length() > 1)
		{
			string = _string.substring(0,1).toUpperCase() + _string.substring(1);
		}
		else if (_string != null)
		{
			string = _string.toUpperCase();
		}

		return string;
	}

	/**
	 * Merge domain.
	 *
	 * @param _domainObjectModel the _domain object model
	 */
	public void mergeDomain(DomainObjectModel _domainObjectModel)
	{
		for (Attribute attribute: _domainObjectModel.getAttributeList())
		{
			if (getAttributeNameMap().keySet().contains(attribute.getName()) == false)
			{
				setAttributeCount(getAttributeCount() + 1);
				getAttributeNameMap().put(attribute.getName(), _domainObjectModel.getAttributeNameMap().get(attribute.getName()));
				getAttributeList().add(attribute);
				getAttributeAnnotationSetMap().put(attribute, _domainObjectModel.getAttributeAnnotationSetMap().get(attribute));
				
				for (Annotation annotation : getAttributeAnnotationSetMap().get(attribute))
				{
					getAnnotationNameSet().add(annotation.getName());
				}
			}
		}
	}

	/**
	 * Gets the table name.
	 *
	 * @return the table name
	 */
	public String getTableName()
	{
		return getBuildPackageName().trim() + ".airlift.domain." + getClassName().trim() + "Jdo";
	}

	/**
	 * Checks if is abstract domain.
	 *
	 * @return true, if is abstract domain
	 */
	public boolean isAbstractDomain()
	{
		return isAbstract;
	}

	/**
	 * Checks if is referenced domain.
	 *
	 * @return true, if is referenced domain
	 */
	public boolean isReferencedDomain()
	{
		return isReferenced;
	}

	/**
	 * Checks if is audited domain.
	 *
	 * @return true, if is audited domain
	 */
	public boolean isAuditedDomain()
	{
		return isAudited;
	}

}	