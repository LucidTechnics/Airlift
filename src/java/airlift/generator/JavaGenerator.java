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

package airlift.generator;

import org.antlr.stringtemplate.StringTemplate;
import org.antlr.stringtemplate.StringTemplateGroup;

import java.util.Collection;
import java.util.Map;
import java.util.Iterator;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

import javax.lang.model.element.Element;

public class JavaGenerator
   extends Generator
{
	public String comment = "This code has been generated by airlift. Do not modify this code. Instead, you may extend this class with your own concrete implementation located under src/java.";

	public void generate(String _appName,
				String _directory,
				Element _element,
				DomainObjectModel _domainObjectModel,
				Map<String, DomainObjectModel> _elementNameToDomainObjectModelMap)
	{
		String generatedString = generateDomainObject(_domainObjectModel);
		String fileName =  _directory + "." + _domainObjectModel.getRootPackageName() + ".airlift.domain." + _domainObjectModel.getClassName() + "Impl";
		writeJavaFile(fileName, generatedString, _element);

		generatedString = generateJdoDomainObject(_domainObjectModel);
		fileName =  _directory + "." + _domainObjectModel.getRootPackageName() + ".airlift.domain." + _domainObjectModel.getClassName() + "Jdo";
		writeJavaFile(fileName, generatedString, _element);

		generatedString = generateDomainSubInterface(_domainObjectModel);
		fileName =  _directory + "." + _domainObjectModel.getRootPackageName() + ".airlift.domain." + _domainObjectModel.getClassName();
		writeJavaFile(fileName, generatedString, _element);
	}

	public String generateApplicationProfile(Map<String, DomainObjectModel> _elementNameToDomainObjectModelMap)
	{
		StringTemplate template = getStringTemplateGroup().getInstanceOf("airlift/language/java/AppProfile");
		boolean isHighLevelAttributesSet = false;
		
		for (DomainObjectModel domainObjectModel: _elementNameToDomainObjectModelMap.values())
		{
			if (domainObjectModel.isAbstractDomain() == false)
			{
				if (isHighLevelAttributesSet == false)
				{
					template.setAttribute("package", domainObjectModel.getRootPackageName());
					template.setAttribute("rootPackage", domainObjectModel.getRootPackageName());
					template.setAttribute("appName", domainObjectModel.getAppName());

					isHighLevelAttributesSet = true;
				}

				template.setAttribute("addToDomainCollection", "collection.add(\"" + domainObjectModel.getClassName().toLowerCase() + "\");");
				template.setAttribute("addToDomainToShortClassMap", "domainToShortClassMap.put(\"" +
									  domainObjectModel.getClassName().toLowerCase() + "\", \"" +
									  domainObjectModel.getClassName() + "\");");
				template.setAttribute("addToDomainToClassMap", "domainToClassMap.put(\"" +
									  domainObjectModel.getClassName().toLowerCase() + "\", \"" +
									  domainObjectModel.getRootPackageName() + ".domaininterface." + domainObjectModel.getClassName() + "\");");
				//TODO Need to refactor annotations into class level
				//and attribute level annotations.
				template.setAttribute("addToConceptMap", "conceptMap.put(\"" + domainObjectModel.getClassName().toLowerCase() + "\" , \""  + "\");");

				
				for (Attribute attribute: domainObjectModel.getAttributeNameMap().values())
				{
					template.setAttribute("addToDomainAttributeTypeMap", "map.put(\"" + domainObjectModel.getClassName().toLowerCase() + "." + attribute.getName() + "\", \"" + attribute.getType() + "\");");

					Annotation persist = domainObjectModel.getAnnotation(attribute, "airlift.generator.Persistable");
					String concept = findValue(persist, "concept()");
					template.setAttribute("addToConceptMap", "conceptMap.put(\"" + domainObjectModel.getClassName().toLowerCase() + "." + attribute.getName() + "\", \"" + concept + "\");");
				}
			}
		}

		return template.toString();
	}

	public String generateDomainSubInterface(DomainObjectModel _domainObjectModel)
	{
		StringTemplate domainSubInterfaceStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/DomainSubInterface");

		Iterator attributes = _domainObjectModel.getAttributes();

		while (attributes.hasNext() == true)
		{
			StringTemplate setterStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AnnotatedInterfaceAttributeSetterDeclaration");

			Attribute attribute = (Attribute) attributes.next();

			String name = attribute.getName();
			String type = attribute.getType();
			String scope = "public";
			String setterName = getSetterName(name);

			setterStringTemplate.setAttribute("scope", scope);
			setterStringTemplate.setAttribute("type", type);
			setterStringTemplate.setAttribute("setterName", setterName);
			setterStringTemplate.setAttribute("name", name);

			domainSubInterfaceStringTemplate.setAttribute("attributeSetters", setterStringTemplate);
		}

		domainSubInterfaceStringTemplate.setAttribute("generatorComment", comment);
		domainSubInterfaceStringTemplate.setAttribute("package", _domainObjectModel.getRootPackageName());
		domainSubInterfaceStringTemplate.setAttribute("fullClassName", _domainObjectModel.getFullyQualifiedClassName());
		domainSubInterfaceStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));

		return domainSubInterfaceStringTemplate.toString();
	}

	public String generateInterface(DomainObjectModel _domainObjectModel)
	{
		StringTemplate domainInterfaceStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/DomainInterface");

		Iterator attributes = _domainObjectModel.getAttributes();

		while (attributes.hasNext() == true)
		{
			StringTemplate getterStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AnnotatedInterfaceAttributeGetterDeclaration");

			Attribute attribute = (Attribute) attributes.next();

			String name = attribute.getName();
			String type = attribute.getType();
			String scope = "public";
			String getterName = getGetterName(name);
			String setterName = getSetterName(name);

			getterStringTemplate.setAttribute("scope", scope);
			getterStringTemplate.setAttribute("type", type);
			getterStringTemplate.setAttribute("getterName", getterName);
			getterStringTemplate.setAttribute("name", name);

			StringTemplate annotationInstanceTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AnnotationInstance");

			Annotation annotation = _domainObjectModel.getAnnotation(attribute, "airlift.generator.Searchable");

			if (annotation != null)
			{
				annotationInstanceTemplate.setAttribute("annotationName", "airlift.generator.Searchable");

				for (String parameterName: annotation.getParameterMap().keySet())
				{
					annotationInstanceTemplate.setAttribute("name"	, parameterName);
					annotationInstanceTemplate.setAttribute("value", annotation.getParameterValue(parameterName));
				}

				getterStringTemplate.setAttribute("annotation", annotationInstanceTemplate.toString());
			}
			
			annotation = _domainObjectModel.getAnnotation(attribute, "airlift.generator.Persistable");

			if (annotation != null)
			{
				annotationInstanceTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AnnotationInstance");
				annotationInstanceTemplate.setAttribute("annotationName", "airlift.generator.Persistable");

				for (String parameterName: annotation.getParameterMap().keySet())
				{
					annotationInstanceTemplate.setAttribute("name", parameterName);
					annotationInstanceTemplate.setAttribute("value", annotation.getParameterValue(parameterName));
				}

				getterStringTemplate.setAttribute("annotation", annotationInstanceTemplate.toString());
			}

			annotation = _domainObjectModel.getAnnotation(attribute, "airlift.generator.Presentable");

			if (annotation != null)
			{
				annotationInstanceTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AnnotationInstance");
				annotationInstanceTemplate.setAttribute("annotationName", "airlift.generator.Presentable");

				for (String parameterName: annotation.getParameterMap().keySet())
				{
					annotationInstanceTemplate.setAttribute("name", parameterName);
					annotationInstanceTemplate.setAttribute("value", annotation.getParameterValue(parameterName));
				}

				getterStringTemplate.setAttribute("annotation", annotationInstanceTemplate.toString());
			}

			domainInterfaceStringTemplate.setAttribute("annotatedInterfaceAttributeGetters", getterStringTemplate);
		}

		domainInterfaceStringTemplate.setAttribute("generatorComment", comment);
		domainInterfaceStringTemplate.setAttribute("package", _domainObjectModel.getRootPackageName());
		domainInterfaceStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));

		return domainInterfaceStringTemplate.toString();
	}

	public String generateDomainObject(DomainObjectModel _domainObjectModel)
	{
		StringTemplate attributeStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeDeclaration");
		StringTemplate getterStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeGetterDeclaration");
		StringTemplate setterStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeSetterDeclaration");
		StringTemplate stringBufferStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeStringBufferAppends");
		StringTemplate domainObjectStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/DomainObject");

		Iterator attributes = _domainObjectModel.getAttributes();

		while (attributes.hasNext() == true)
		{
			Attribute attribute = (Attribute) attributes.next();

			String name = attribute.getName();
			String type = attribute.getType();
			String scope = "public";
			String getterName = getGetterName(name);
			String setterName = getSetterName(name);
			
			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", type);
			attributeStringTemplate.setAttribute("name", name);

			getterStringTemplate.setAttribute("scope", scope);
			getterStringTemplate.setAttribute("type", type);
			getterStringTemplate.setAttribute("getterName", getterName);
			getterStringTemplate.setAttribute("name", name);

			setterStringTemplate.setAttribute("scope", scope);
			setterStringTemplate.setAttribute("type", type);
			setterStringTemplate.setAttribute("setterName", setterName);
			setterStringTemplate.setAttribute("name", name);

			printMessage("Checking is type: " + type);
			
			if (isArrayType(type) == true)
			{
				stringBufferStringTemplate.setAttribute("getterName", "airlift.util.AirliftUtil.generateStringFromArray(" + getterName + "())");
			}
			else
			{
				stringBufferStringTemplate.setAttribute("getterName", getterName + "()");
			}
			
			stringBufferStringTemplate.setAttribute("name", name);
				
		}

		if (_domainObjectModel.isClockable() == true)
		{
			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.lang.String");
			attributeStringTemplate.setAttribute("name", "source");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.lang.String");
			getterStringTemplate.setAttribute("getterName", "getSource");
			getterStringTemplate.setAttribute("name", "source");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.lang.String");
			setterStringTemplate.setAttribute("setterName", "setSource");
			setterStringTemplate.setAttribute("name", "source");

			stringBufferStringTemplate.setAttribute("getterName", "getSource()");
			stringBufferStringTemplate.setAttribute("name", "source");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.lang.Integer");
			attributeStringTemplate.setAttribute("name", "clock");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.lang.Integer");
			getterStringTemplate.setAttribute("getterName", "getClock");
			getterStringTemplate.setAttribute("name", "clock");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.lang.Integer");
			setterStringTemplate.setAttribute("setterName", "setClock");
			setterStringTemplate.setAttribute("name", "clock");

			stringBufferStringTemplate.setAttribute("getterName", "getClock()");
			stringBufferStringTemplate.setAttribute("name", "clock");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.lang.String");
			attributeStringTemplate.setAttribute("name", "hash");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.lang.String");
			getterStringTemplate.setAttribute("getterName", "getHash");
			getterStringTemplate.setAttribute("name", "hash");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.lang.String");
			setterStringTemplate.setAttribute("setterName", "setHash");
			setterStringTemplate.setAttribute("name", "hash");

			stringBufferStringTemplate.setAttribute("getterName", "getHash()");
			stringBufferStringTemplate.setAttribute("name", "hash");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.util.Date");
			attributeStringTemplate.setAttribute("name", "createDate");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.util.Date");
			getterStringTemplate.setAttribute("getterName", "getCreateDate");
			getterStringTemplate.setAttribute("name", "createDate");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.util.Date");
			setterStringTemplate.setAttribute("setterName", "setCreateDate");
			setterStringTemplate.setAttribute("name", "createDate");

			stringBufferStringTemplate.setAttribute("getterName", "getCreateDate()");
			stringBufferStringTemplate.setAttribute("name", "createDate");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.util.Date");
			attributeStringTemplate.setAttribute("name", "updateDate");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.util.Date");
			getterStringTemplate.setAttribute("getterName", "getUpdateDate");
			getterStringTemplate.setAttribute("name", "updateDate");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.util.Date");
			setterStringTemplate.setAttribute("setterName", "setUpdateDate");
			setterStringTemplate.setAttribute("name", "updateDate");

			stringBufferStringTemplate.setAttribute("getterName", "getUpdateDate()");
			stringBufferStringTemplate.setAttribute("name", "updateDate");
		}
		
		domainObjectStringTemplate.setAttribute("attributes", attributeStringTemplate);
		domainObjectStringTemplate.setAttribute("attributeGetters", getterStringTemplate);
		domainObjectStringTemplate.setAttribute("attributeSetters", setterStringTemplate);
		domainObjectStringTemplate.setAttribute("attributeStringBufferAppends", stringBufferStringTemplate);
		domainObjectStringTemplate.setAttribute("generatorComment", comment	);
		domainObjectStringTemplate.setAttribute("package", _domainObjectModel.getRootPackageName());
		domainObjectStringTemplate.setAttribute("fullClassName", _domainObjectModel.getFullyQualifiedClassName());
		domainObjectStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));

		return domainObjectStringTemplate.toString();
	}

	public String generateJdoDomainObject(DomainObjectModel _domainObjectModel)
	{
		StringTemplate attributeStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeDeclaration");
		StringTemplate getterStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeGetterDeclaration");
		StringTemplate setterStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeSetterDeclaration");
		StringTemplate stringBufferStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/AttributeStringBufferAppends");
		StringTemplate domainObjectStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/language/java/JdoDomainObject");

		Iterator attributes = _domainObjectModel.getAttributes();

		while (attributes.hasNext() == true)
		{
			Attribute attribute = (Attribute) attributes.next();

			String name = attribute.getName();
			String type = attribute.getType();
			String scope = "public";
			String getterName = getGetterName(name);
			String setterName = getSetterName(name);

			if ("id".equals(name) == true)
			{
				attributeStringTemplate.setAttribute("annotation", "@Persistent @PrimaryKey");
			}
			else
			{
				attributeStringTemplate.setAttribute("annotation", "@Persistent");
			}

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", type);
			attributeStringTemplate.setAttribute("name", name);

			getterStringTemplate.setAttribute("scope", scope);
			getterStringTemplate.setAttribute("type", type);
			getterStringTemplate.setAttribute("getterName", getterName);
			getterStringTemplate.setAttribute("name", name);

			setterStringTemplate.setAttribute("scope", scope);
			setterStringTemplate.setAttribute("type", type);
			setterStringTemplate.setAttribute("setterName", setterName);
			setterStringTemplate.setAttribute("name", name);

			printMessage("Checking is type: " + type);

			if (isArrayType(type) == true)
			{
				stringBufferStringTemplate.setAttribute("getterName", "airlift.util.AirliftUtil.generateStringFromArray(" + getterName + "())");
			}
			else
			{
				stringBufferStringTemplate.setAttribute("getterName", getterName + "()");
			}

			stringBufferStringTemplate.setAttribute("name", name);

		}

		if (_domainObjectModel.isClockable() == true)
		{
			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.lang.String");
			attributeStringTemplate.setAttribute("name", "source");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.lang.String");
			getterStringTemplate.setAttribute("getterName", "getSource");
			getterStringTemplate.setAttribute("name", "source");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.lang.String");
			setterStringTemplate.setAttribute("setterName", "setSource");
			setterStringTemplate.setAttribute("name", "source");

			stringBufferStringTemplate.setAttribute("getterName", "getSource()");
			stringBufferStringTemplate.setAttribute("name", "source");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.lang.Integer");
			attributeStringTemplate.setAttribute("name", "clock");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.lang.Integer");
			getterStringTemplate.setAttribute("getterName", "getClock");
			getterStringTemplate.setAttribute("name", "clock");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.lang.Integer");
			setterStringTemplate.setAttribute("setterName", "setClock");
			setterStringTemplate.setAttribute("name", "clock");

			stringBufferStringTemplate.setAttribute("getterName", "getClock()");
			stringBufferStringTemplate.setAttribute("name", "clock");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.lang.String");
			attributeStringTemplate.setAttribute("name", "hash");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.lang.String");
			getterStringTemplate.setAttribute("getterName", "getHash");
			getterStringTemplate.setAttribute("name", "hash");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.lang.String");
			setterStringTemplate.setAttribute("setterName", "setHash");
			setterStringTemplate.setAttribute("name", "hash");

			stringBufferStringTemplate.setAttribute("getterName", "getHash()");
			stringBufferStringTemplate.setAttribute("name", "hash");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.util.Date");
			attributeStringTemplate.setAttribute("name", "createDate");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.util.Date");
			getterStringTemplate.setAttribute("getterName", "getCreateDate");
			getterStringTemplate.setAttribute("name", "createDate");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.util.Date");
			setterStringTemplate.setAttribute("setterName", "setCreateDate");
			setterStringTemplate.setAttribute("name", "createDate");

			stringBufferStringTemplate.setAttribute("getterName", "getCreateDate()");
			stringBufferStringTemplate.setAttribute("name", "createDate");

			attributeStringTemplate.setAttribute("scope", "private");
			attributeStringTemplate.setAttribute("type", "java.util.Date");
			attributeStringTemplate.setAttribute("name", "updateDate");

			getterStringTemplate.setAttribute("scope", "public");
			getterStringTemplate.setAttribute("type", "java.util.Date");
			getterStringTemplate.setAttribute("getterName", "getUpdateDate");
			getterStringTemplate.setAttribute("name", "updateDate");

			setterStringTemplate.setAttribute("scope", "public");
			setterStringTemplate.setAttribute("type", "java.util.Date");
			setterStringTemplate.setAttribute("setterName", "setUpdateDate");
			setterStringTemplate.setAttribute("name", "updateDate");

			stringBufferStringTemplate.setAttribute("getterName", "getUpdateDate()");
			stringBufferStringTemplate.setAttribute("name", "updateDate");
		}

		domainObjectStringTemplate.setAttribute("attributes", attributeStringTemplate);
		domainObjectStringTemplate.setAttribute("attributeGetters", getterStringTemplate);
		domainObjectStringTemplate.setAttribute("attributeSetters", setterStringTemplate);
		domainObjectStringTemplate.setAttribute("attributeStringBufferAppends", stringBufferStringTemplate);
		domainObjectStringTemplate.setAttribute("generatorComment", comment	);
		domainObjectStringTemplate.setAttribute("package", _domainObjectModel.getRootPackageName());
		domainObjectStringTemplate.setAttribute("fullClassName", _domainObjectModel.getFullyQualifiedClassName());
		domainObjectStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));

		return domainObjectStringTemplate.toString();
	}

	public String generateDao(DomainObjectModel _domainObjectModel)
	{
		SqlGenerator databaseGenerator = new SqlGenerator();
		
		StringTemplate daoStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/dao/Dao");
        StringTemplate primaryKeyMethodsStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/dao/PrimaryKeyMethods");
        StringTemplate updateMethodStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/dao/UpdateMethod");
        StringTemplate updateMethodNotSupportedStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/dao/UpdateMethodNotSupported");

	    Iterator attributes = _domainObjectModel.getAttributes();

		boolean hasPrimaryKey = false;
		boolean updateIsAvailable = false;

		String isUndoable = "false";
		
	    while (attributes.hasNext() == true)
		{
			String isSearchable = "false";
			
			Attribute attribute = (Attribute) attributes.next();
			Annotation persist = (Annotation) _domainObjectModel.getAnnotation(attribute,"airlift.generator.Persistable");
			Annotation search = (Annotation) _domainObjectModel.getAnnotation(attribute,"airlift.generator.Searchable");
			Annotation undo = (Annotation) _domainObjectModel.getAnnotation(attribute,"airlift.generator.Undoable");

			isUndoable = (undo != null) ? findValue(undo, "isUndoable()") : "false";
						
			String requestPersistence = findValue(persist, "isPersistable()");
			String requestSearchable = findValue(persist, "isSearchable()");			

			if ("true".equals(requestPersistence) == true)
			{
				String type = attribute.getType();
				if (isPersistable(type) == false)
				{
					throw new RuntimeException("No persistence support for complex object types like: " + type);
				}

				String fieldName = attribute.getName();
				String name = attribute.getName();
				String isPrimaryKey = findValue(persist, "isPrimaryKey()");
				String rangeable = findValue(persist, "rangeable()");
				String isImmutable = findValue(persist, "immutable()");

				if (search != null)
				{
					isSearchable = findValue(search, "isSearchable()");
				}

				hasPrimaryKey = true;

				StringTemplate daoAttributeStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/dao/DaoAttribute");

				daoAttributeStringTemplate.setAttribute("findByThisAttributeSql", databaseGenerator.generateFindByThisAttributeSql(_domainObjectModel, fieldName));
				daoAttributeStringTemplate.setAttribute("attributeName", name);
				daoAttributeStringTemplate.setAttribute("attributeType", type);
				daoAttributeStringTemplate.setAttribute("uppercaseAttributeName", upperTheFirstCharacter(name));
				daoAttributeStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));
				daoStringTemplate.setAttribute("collectByAttribute", daoAttributeStringTemplate.toString());

				StringTemplate daoRangeStringTemplate = getStringTemplateGroup().getInstanceOf("airlift/dao/DaoRange");

				daoRangeStringTemplate.setAttribute("findByRangeSql", databaseGenerator.generateFindThisRangeSql(_domainObjectModel, fieldName));
				daoRangeStringTemplate.setAttribute("rangeType", type);
				daoRangeStringTemplate.setAttribute("uppercaseAttribute", upperTheFirstCharacter(name));
				daoRangeStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));
				daoStringTemplate.setAttribute("collectByRange", daoRangeStringTemplate.toString());
			}
		}

		if (_domainObjectModel.isClockable() == true)
		{
			updateIsAvailable = true;
		}

		if (hasPrimaryKey == true)
		{
			updateMethodStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));
			updateMethodStringTemplate.setAttribute("lowerCaseClassName", lowerTheFirstCharacter(_domainObjectModel.getClassName()));
			primaryKeyMethodsStringTemplate.setAttribute("updateMethod", updateMethodStringTemplate.toString());
			
			primaryKeyMethodsStringTemplate.setAttribute("fullClassName", _domainObjectModel.getPackageName() + "." + _domainObjectModel.getClassName());
			primaryKeyMethodsStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));
			primaryKeyMethodsStringTemplate.setAttribute("lowerCaseClassName", lowerTheFirstCharacter(_domainObjectModel.getClassName()));

			daoStringTemplate.setAttribute("primaryKeyMethods", primaryKeyMethodsStringTemplate.toString());
		}
		
	    daoStringTemplate.setAttribute("generatorComment", comment);
	    daoStringTemplate.setAttribute("package", _domainObjectModel.getRootPackageName());
	    daoStringTemplate.setAttribute("fullClassName", _domainObjectModel.getPackageName() + "." + _domainObjectModel.getClassName());
	    daoStringTemplate.setAttribute("className", upperTheFirstCharacter(_domainObjectModel.getClassName()));
		daoStringTemplate.setAttribute("lowerCaseClassName", lowerTheFirstCharacter(_domainObjectModel.getClassName()));
		daoStringTemplate.setAttribute("selectAllSql", databaseGenerator.generateSelectSql(_domainObjectModel));

	    return daoStringTemplate.toString();
	}
	
	protected class PropertyOrder
		implements Comparable<PropertyOrder>
	{
		protected int order;
		protected String name;
		
		protected PropertyOrder(String _name, int _order)
		{
			this.name = _name;
			this.order = _order;
		}

		@Override()
		public int hashCode()
		{
			return order;
		}

		@Override()
		public boolean equals(Object _object)
		{
			boolean equals = false;
			
			if (_object instanceof PropertyOrder)
			{
				PropertyOrder propertyOrder = (PropertyOrder) _object;
				
				if (this.name != null && this.name.equalsIgnoreCase(propertyOrder.name) == true &&
					  this.order == propertyOrder.order)
				{
					equals = true;
				}
			}

			return equals;
		}

		public int compareTo(PropertyOrder _propertyOrder)
		{
			int order = 0;

			if (order != _propertyOrder.order)
			{
				order = (this.order < _propertyOrder.order) ? -1 : 1;
			}
			
			return order;
		}
	}
}