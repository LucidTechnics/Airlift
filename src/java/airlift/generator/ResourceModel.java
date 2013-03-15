/* Copyright 2011, Lucid Technics, LLC.

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
public class ResourceModel
{
	private String packageName;
	private String buildPackageName;
	private String className;
	private String appName;
	private boolean isView;
	private boolean isAbstract;
	private boolean isReferenced;
	private boolean isAudited;
	private String lookingAt;
	
	private Map<String, Annotation> resourceAnnotationMap;
	private Map<Attribute, Set<Annotation>> attributeAnnotationSetMap;
	private Map<String, Attribute> attributeNameMap;
	private Set<String> annotationNameSet;
	private List<Attribute> attributeList;
	private Set<String> directSuperClassSet;
	private String rootPackageName;
	private String tableName;
	private boolean isClockable;
	protected Set reservedPropertyNameSet;
	protected int attributeCount;
	protected boolean isPreparedAlready;

	public String getPackageName() { return packageName; }
	
	public String getBuildPackageName() { return buildPackageName; }
	
	public String getClassName() { return upperTheFirstCharacter(className); }
	
	public String getAppName() { return appName; }

	public boolean getIsView() { return isView; }
	
	public boolean getIsAbstract() { return isAbstract; }
	
	public boolean getIsReferenced() { return isReferenced; }
	
	public boolean getIsAudited() { return isAudited; }

	public String getLookingAt() { return lookingAt; }
	
	public Map<String, Annotation> getResourceAnnotationMap() { return resourceAnnotationMap; }
	
	public Map<Attribute, Set<Annotation>> getAttributeAnnotationSetMap() { return attributeAnnotationSetMap; }
	
	public Map<String, Attribute> getAttributeNameMap() { return attributeNameMap;  }
	
	public Set<String> getAnnotationNameSet() { return annotationNameSet; }
	
	public List<Attribute> getAttributeList() { return attributeList; }
	
	public Set<String> getDirectSuperClassSet() { return directSuperClassSet; }
	
	public String getRootPackageName() { return rootPackageName; }
	
	public boolean getIsClockable() { return isClockable; }
	
	protected Set getReservedPropertyNameSet() { return reservedPropertyNameSet; }
	
	public int getAttributeCount()  { return attributeCount; }

	public void setPackageName(String _packageName) { packageName = _packageName.toLowerCase(); }
	
	public void setBuildPackageName(String _buildPackageName) { buildPackageName = _buildPackageName; }
	
	public void setClassName(String _className) { className = upperTheFirstCharacter(_className); }
	
	public void setAppName(String _appName) { appName = _appName; }

	public void setIsView(boolean _isView) { isView = _isView; }
	
	public void setIsAbstract(boolean _isAbstract) { isAbstract = _isAbstract; }
	
	public void setIsReferenced(boolean _isReferenced) { isReferenced = _isReferenced; }
	
	public void setIsAudited(boolean _isAudited) { isAudited = _isAudited; }

	public void setLookingAt(String _lookingAt) { lookingAt = _lookingAt; }
	
	public void setResourceAnnotationMap(Map<String, Annotation> _resourceAnnotationMap) { resourceAnnotationMap = _resourceAnnotationMap; }
	
	public void setAttributeAnnotationSetMap(Map<Attribute, Set<Annotation>> _attributeAnnotationSetMap) { attributeAnnotationSetMap = _attributeAnnotationSetMap; }
	
	public void setAttributeNameMap(Map<String, Attribute> _attributeNameMap) { attributeNameMap = _attributeNameMap; }
	
	public void setAnnotationNameSet(Set<String> _annotationNameSet) { annotationNameSet = _annotationNameSet; }
	
	public void setAttributeList(List<Attribute> _attributeList) { attributeList = _attributeList; }
	
	public void setDirectSuperClassSet(Set<String> _directSuperClassSet) { directSuperClassSet = _directSuperClassSet; }
	
	public void setRootPackageName(String _rootPackageName) { rootPackageName = _rootPackageName; }
	
	public void setTableName(String _tableName) { tableName = _tableName; }
	
	public void setIsClockable(boolean _isClockable) { isClockable = _isClockable; }
	
	protected void setReservedPropertyNameSet(Set _reservedPropertyNameSet) { reservedPropertyNameSet = _reservedPropertyNameSet; }
	
	public void setAttributeCount(int _attributeCount) { attributeCount = _attributeCount; }
	
    private static Logger log = Logger.getLogger(ResourceModel.class.getName());

	public ResourceModel()
	{
		setReservedPropertyNameSet(new HashSet());

		getReservedPropertyNameSet().add("source");
		getReservedPropertyNameSet().add("clock");
		getReservedPropertyNameSet().add("hash");
		getReservedPropertyNameSet().add("createDate");
		getReservedPropertyNameSet().add("updateDate");

		setAttributeNameMap(new HashMap<String, Attribute>());
		setAnnotationNameSet(new HashSet<String>());
		setResourceAnnotationMap(new HashMap<String, Annotation>());
		setAttributeAnnotationSetMap(new HashMap<Attribute, Set<Annotation>>());
		setAttributeList(new ArrayList<Attribute>());
		setDirectSuperClassSet(new HashSet<String>());
	}

	public boolean isClockable()
	{
		return isClockable;
	}

	public void addAnnotation(Attribute _attribute, Annotation _annotation)
	{
		int attributeIndex = getAttributeList().size();
		addAnnotation(_attribute, attributeIndex, _annotation);
	}

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

	public Attribute getAttributeByName(String _name)
	{
		return getAttributeNameMap().get(_name);
	}
	
	public Iterator<Attribute> getAttributes()
	{
		return getAttributeList().iterator();
	}
	
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
	
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("ResourceModel\n");
		stringBuffer.append("packageName --> " + packageName).append("\n");
		stringBuffer.append("className --> " + className).append("\n");
		stringBuffer.append("rootPackageName --> " + rootPackageName).append("\n");
		stringBuffer.append("attributeAnnotationSetMap --> " + attributeAnnotationSetMap).append("\n");
		stringBuffer.append("directSuperClassSet --> " + directSuperClassSet).append("\n");

		return stringBuffer.toString();
	}

	public String getFullyQualifiedClassName()
	{
		return getPackageName().trim() + "." + getClassName().trim();
	}

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

	public void mergeResource(ResourceModel _resourceModel)
	{
		for (Attribute attribute: _resourceModel.getAttributeList())
		{
			if (getAttributeNameMap().keySet().contains(attribute.getName()) == false)
			{
				setAttributeCount(getAttributeCount() + 1);
				getAttributeNameMap().put(attribute.getName(), _resourceModel.getAttributeNameMap().get(attribute.getName()));
				getAttributeList().add(attribute);
				getAttributeAnnotationSetMap().put(attribute, _resourceModel.getAttributeAnnotationSetMap().get(attribute));
				
				for (Annotation annotation : getAttributeAnnotationSetMap().get(attribute))
				{
					getAnnotationNameSet().add(annotation.getName());
				}
			}
		}
	}

	public String getTableName()
	{
		return getBuildPackageName().trim() + ".airlift.resource." + getClassName().trim() + "Jdo";
	}

	public boolean isAbstractResource()
	{
		return isAbstract;
	}

	public boolean isReferencedResource()
	{
		return isReferenced;
	}

	public boolean isAuditedResource()
	{
		return isAudited;
	}

	public boolean isViewResource()
	{
		return isView;
	}

}	