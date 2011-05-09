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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedOptions;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.AnnotationMirror;
import javax.lang.model.element.Element;
import javax.lang.model.element.ElementKind;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.TypeParameterElement;
import javax.lang.model.util.ElementFilter;
import javax.lang.model.util.Elements;
import javax.lang.model.util.Types;
import javax.tools.Diagnostic;

@SupportedAnnotationTypes("airlift.generator.*")
@SupportedOptions({"appName", "package"})
@SupportedSourceVersion(SourceVersion.RELEASE_6)

public class Compiler
   extends AbstractProcessor
{
	private Set<String> annotationNameSet;
	private Set<Element> elementSet;
	private Set<String> domainClassNameSet;
	private Map<String, DomainObjectModel> preGenerationMap;
	private Map<String, DomainObjectModel> elementNameToDomainObjectModelMap;

	public Set<String> getAnnotationNameSet() { return annotationNameSet; }
	public Set<Element> getElementSet() { return elementSet;  }
	public Set<String> getDomainClassNameSet() { return domainClassNameSet; }
	public Map<String, DomainObjectModel> getPreGenerationMap() { return preGenerationMap;  }
	public Map<String, DomainObjectModel> getElementNameToDomainObjectModelMap() { return elementNameToDomainObjectModelMap; }

	public void setAnnotationNameSet(Set<String> _annotationNameSet) { annotationNameSet = _annotationNameSet; }
	public void setElementSet(Set<Element> _elementSet) { elementSet = _elementSet; }
	public void setDomainClassNameSet(Set<String> _domainClassNameSet) { domainClassNameSet = _domainClassNameSet; }
	public void setPreGenerationMap(Map<String, DomainObjectModel> _preGenerationMap) { preGenerationMap = _preGenerationMap; }
	public void setElementNameToDomainObjectModelMap(Map<String, DomainObjectModel> _elementNameToDomainObjectModelMap) { elementNameToDomainObjectModelMap = _elementNameToDomainObjectModelMap; }
	
	public Compiler()
	{
		setAnnotationNameSet(new HashSet<String>());
		setElementSet(new HashSet<Element>());
		setPreGenerationMap(new HashMap<String, DomainObjectModel>());
		setElementNameToDomainObjectModelMap(new HashMap<String, DomainObjectModel>());
		setDomainClassNameSet(new HashSet<String>());
	}

	private void init()
	{
		if (getAnnotationNameSet().isEmpty() == true)
		{
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Airlift Code Generator");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Version 1.0 Apache Software License - Lucid Technics Copyright 2007");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Authored by Bediako Ntodi George, David Yuctan Hodge");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "");

			getAnnotationNameSet().add("airlift.generator.TargetDatabase");
			getAnnotationNameSet().add("airlift.generator.Presentable");
			getAnnotationNameSet().add("airlift.generator.Persistable");
			getAnnotationNameSet().add("airlift.generator.Datable");
			getAnnotationNameSet().add("airlift.generator.Searchable");
			getAnnotationNameSet().add("airlift.generator.Undoable");

			String packageName = processingEnv.getOptions().get("package");

			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "processing begins for package name: " + packageName);
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "");
		}
	}
	
	public boolean process(Set<? extends TypeElement> _annotationSet, RoundEnvironment _roundEnvironment)
	{
		boolean claimed = false;
		
		init();
		
		Elements elements = processingEnv.getElementUtils();
		Types types = processingEnv.getTypeUtils();

		if (_annotationSet.isEmpty() == false)
		{
			for (TypeElement typeElement: _annotationSet)
			{
				if (getAnnotationNameSet().contains(typeElement.toString()) == true)
				{
					processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Found an Annotation to process");

					claimed = true;

					Set<? extends Element> annotatedElementSet = _roundEnvironment.getElementsAnnotatedWith(typeElement);

					processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Type element is: " + typeElement.toString());

					for (Element element: annotatedElementSet)
					{
						if (element.getKind() == ElementKind.METHOD)
						{						
							//Find the enclosing class and get the
							//domain object model for that class. Then populate or
							//overwrite the field's information only
							String methodName = element.getSimpleName().toString();

							if (isGetter(methodName) == true)
							{
								String attributeName = deduceAttributeName(methodName);
								Attribute attribute = new Attribute();
								attribute.setName(attributeName);
								attribute.setType(determineReturnType(element, types));

								Element interfaceElement = element.getEnclosingElement();
								getElementSet().add(interfaceElement);
								DomainObjectModel domainObjectModel = getRelevantDomainObjectModel(interfaceElement, elements);

								List<? extends AnnotationMirror> annotationMirrorList = elements.getAllAnnotationMirrors(element);

								for (AnnotationMirror annotationMirror: annotationMirrorList)
								{
									Annotation annotation = new Annotation();
									annotation.setName(annotationMirror.getAnnotationType().toString());

									Map parameterValueMap = elements.getElementValuesWithDefaults(annotationMirror);

									for (Object object: parameterValueMap.entrySet())
									{
										Map.Entry entry = (Map.Entry) object;

										annotation.addParameterValue(entry.getKey().toString(), entry.getValue());
									}

									domainObjectModel.addAnnotation(attribute, annotation);
								}
							}
						}
						else if (element.getKind() == ElementKind.INTERFACE)
						{
							getElementSet().add(element);
							DomainObjectModel domainObjectModel = getRelevantDomainObjectModel(element, elements);

							List<? extends Element> methodElementList = ElementFilter.methodsIn(element.getEnclosedElements());
							List<? extends AnnotationMirror> annotationMirrorList = elements.getAllAnnotationMirrors(element);

							for (AnnotationMirror annotationMirror: annotationMirrorList)
							{
								Annotation annotation = new Annotation();							
								annotation.setName(annotationMirror.getAnnotationType().toString());

								domainObjectModel.getDomainAnnotationSet().add(annotation);

								Map parameterValueMap = elements.getElementValuesWithDefaults(annotationMirror);

								for (Object object: parameterValueMap.entrySet())
								{
									Map.Entry entry = (Map.Entry) object;
									annotation.addParameterValue(entry.getKey().toString(), entry.getValue().toString());
								}

								for (Element methodElement: methodElementList)
								{
									Attribute attribute = new Attribute();
									String methodName = methodElement.getSimpleName().toString();

									if (isGetter(methodName) == true)
									{
										String attributeName = deduceAttributeName(methodName);
										attribute.setName(attributeName);
										attribute.setType(determineReturnType(methodElement, types));

										if (domainObjectModel.contains(attribute, annotation) == false)
										{
											domainObjectModel.addAnnotation(attribute, annotation);
										}
									}
								}
							}
						}
						else
						{
							//Don't know how to process this guy
						}
					}
				}
			}
		}
		else
		//_annotationSet is empty
		{
			generateFiles(processingEnv, _roundEnvironment, getElementNameToDomainObjectModelMap(), getAnnotationNameSet(), getElementSet());
			
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Printing domain object model");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, getElementNameToDomainObjectModelMap().toString());
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Airlift code generation completed");
		}
		
		return claimed;
	}

	private void generateFiles(ProcessingEnvironment _processingEnvironment, RoundEnvironment _roundEnvironment,
							   Map<String, DomainObjectModel> _elementNameToDomainObjectModelMap, Set<String> _annotationNameSet,
							  Set _elementSet)
	{
		String packageName = _processingEnvironment.getOptions().get("package");
		String appName = _processingEnvironment.getOptions().get("appName");

		if (appName == null)
		{
			appName = "airliftApp";
		}
				
		Set<String> rootPackageNameSet = new HashSet<String>();

		for (DomainObjectModel domainObjectModel: _elementNameToDomainObjectModelMap.values())
		{
			prepareDomainObjectModel(getDomainClassNameSet(), domainObjectModel, _elementNameToDomainObjectModelMap);
		}
		
		for (Element element: elementSet)
		{
			String fullyQualifiedName = deriveFullyQualifiedClassName(element, _processingEnvironment.getElementUtils());
			DomainObjectModel domainObjectModel = _elementNameToDomainObjectModelMap.get(fullyQualifiedName);
			domainObjectModel.setBuildPackageName(packageName);

			if (domainObjectModel.isAbstractDomain() == false)
			{
				rootPackageNameSet.add(domainObjectModel.getRootPackageName());

				Generator generator = new SqlGenerator();
				generator.processingEnv = _processingEnvironment;
				generator.generate(appName, "gensql", element, domainObjectModel, _elementNameToDomainObjectModelMap);
				
				generator = new JavaScriptGenerator();
				generator.processingEnv = _processingEnvironment;
				generator.generate(appName, "genscript", element, domainObjectModel, _elementNameToDomainObjectModelMap);

				generator = new JavaGenerator();
				generator.processingEnv = _processingEnvironment;
				generator.generate(appName, "genjava", element, domainObjectModel, _elementNameToDomainObjectModelMap);

			}
		}

		JavaGenerator javaGenerator = new JavaGenerator();
		javaGenerator.processingEnv = _processingEnvironment;

		String generatedString = javaGenerator.generateApplicationProfile(_elementNameToDomainObjectModelMap);
		String fileName =  "genjava" + "." + _processingEnvironment.getOptions().get("package") + ".AppProfile";
		javaGenerator.writeJavaFile(fileName, generatedString, null);

		JavaScriptGenerator javaScriptGenerator = new JavaScriptGenerator();
		javaScriptGenerator.processingEnv = _processingEnvironment;

		generatedString = javaScriptGenerator.generateDomainConstructors(_elementNameToDomainObjectModelMap);
		fileName =  appName + "/airlift/DomainConstructors.js";
		javaScriptGenerator.writeResourceFile(fileName, "genscript", generatedString, null);
	}

	private String getFullClassName(Elements _elements, Element _element)
	{
		return _elements.getPackageOf(_element).getQualifiedName().toString() + "." + _element.getSimpleName().toString();
	}
	
	private String determineType(Element _element, Types _types)
	{
		String type = "";
		Element elementType = _types.asElement(_element.asType());

		if (elementType == null)
		{
			type = _types.getPrimitiveType(_element.asType().getKind()).toString();
		}
		else
		{
			type = elementType.toString();
		}
		
		return type;
	}

	private String determineReturnType(Element _element, Types _types)
	{
		String type = "";

		ExecutableElement executableElement = (ExecutableElement) _element;
		javax.lang.model.type.TypeMirror returnTypeMirror = executableElement.getReturnType();

		if (returnTypeMirror instanceof com.sun.tools.javac.code.Type.ArrayType)
		{
			type = processArrayType(returnTypeMirror, (javax.lang.model.type.ArrayType) returnTypeMirror, _types, executableElement);
		}
		else
		{
			type = processDeclaredType(returnTypeMirror, (javax.lang.model.type.DeclaredType) returnTypeMirror, _types, executableElement);
		}
		
		return type;
	}

	private String processDeclaredType(javax.lang.model.type.TypeMirror _returnTypeMirror, javax.lang.model.type.DeclaredType _declaredReturnType, Types _types, javax.lang.model.element.ExecutableElement _executableElement)
	{
		String type = "";
		String typeParameters = "";
		TypeElement returnType = (TypeElement) _types.asElement(_returnTypeMirror);

		List<? extends javax.lang.model.type.TypeMirror> declaredTypeArgumentsList = _declaredReturnType.getTypeArguments();

		if (declaredTypeArgumentsList.isEmpty() == false)
		{
			typeParameters = "<";

			for (javax.lang.model.type.TypeMirror typeMirror: declaredTypeArgumentsList)
			{
				typeParameters += typeMirror.toString() + ",";
			}

			typeParameters = typeParameters.replaceAll(",$", ">");
		}

		if (returnType == null)
		{
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Comparing this type kind: " + _executableElement.getReturnType().getKind());

			if (javax.lang.model.type.TypeKind.ARRAY == _executableElement.getReturnType().getKind())
			{
				type = _executableElement.getReturnType().toString();
			}
			else
			{
				type = _types.getPrimitiveType(_executableElement.getReturnType().getKind()).toString();
			}
		}
		else
		{
			type = returnType.toString();
		}

		return type + typeParameters;
	}

	private String processArrayType(javax.lang.model.type.TypeMirror _returnTypeMirror, javax.lang.model.type.ArrayType _arrayReturnType, Types _types, javax.lang.model.element.ExecutableElement _executableElement)
	{
		String type = "";
		String typeParameters = "";
		TypeElement returnType = (TypeElement) _types.asElement(_returnTypeMirror);

		if (returnType == null)
		{
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Comparing this type kind: " + _executableElement.getReturnType().getKind());
			type = _executableElement.getReturnType().toString();
		}
		else
		{
			type = returnType.toString();
		}

		return type;		
	}
	
	private DomainObjectModel createNewDomainObjectModel(Element _element, Elements _elementUtil)
	{
		DomainObjectModel domainObjectModel = new DomainObjectModel();

		domainObjectModel.setAppName(processingEnv.getOptions().get("appName"));
		domainObjectModel.setClassName(_element.getSimpleName().toString());
		domainObjectModel.setPackageName(_elementUtil.getPackageOf(_element).getQualifiedName().toString());
		domainObjectModel.setRootPackageName(processingEnv.getOptions().get("package"));
		domainObjectModel.setIsClockable(isClockable(_element));

		Types types = processingEnv.getTypeUtils();

		java.util.List<? extends javax.lang.model.type.TypeMirror> typeMirrorList = processingEnv.getTypeUtils().directSupertypes(_element.asType());

		for (javax.lang.model.type.TypeMirror typeMirror: typeMirrorList)
		{
			domainObjectModel.getDirectSuperClassSet().add(typeMirror.toString());
		}

		return domainObjectModel;
	}

	private void prepareDomainObjectModel(Set<String> _domainClassNameSet, DomainObjectModel _domainObjectModel, Map<String, DomainObjectModel> _elementNameToDomainObjectModelMap)
	{
		if (_domainObjectModel.isPreparedAlready == false)
		{
			for (String superInterface: _domainObjectModel.getDirectSuperClassSet())
			{
				if (_domainClassNameSet.contains(superInterface) == true)
				{
					prepareDomainObjectModel(_domainClassNameSet, _elementNameToDomainObjectModelMap.get(superInterface), _elementNameToDomainObjectModelMap);
					_domainObjectModel.mergeDomain(_elementNameToDomainObjectModelMap.get(superInterface));
				}
			}

			_domainObjectModel.isPreparedAlready = true;
		}
	}
	
	private DomainObjectModel createNewDomainObjectModel(String _tableName, String _className, String _rootPackageName, String _packageName)
	{
		DomainObjectModel domainObjectModel = new DomainObjectModel();

		domainObjectModel.setAppName(processingEnv.getOptions().get("appName"));
		domainObjectModel.setTableName(_tableName);
		domainObjectModel.setClassName(_className);
		domainObjectModel.setPackageName(_packageName);
		domainObjectModel.setRootPackageName(_rootPackageName);
		
		return domainObjectModel;
	}

	private DomainObjectModel getRelevantDomainObjectModel(Element _element, Elements _elements)
	{
		String fullyQualifiedName = deriveFullyQualifiedClassName(_element, _elements);
		DomainObjectModel domainObjectModel = getElementNameToDomainObjectModelMap().get(fullyQualifiedName);

		if (domainObjectModel == null)
		{
			domainObjectModel = createNewDomainObjectModel(_element, _elements);
			getDomainClassNameSet().add(fullyQualifiedName);
			getElementNameToDomainObjectModelMap().put(fullyQualifiedName, domainObjectModel);
		}

		return domainObjectModel;
	}

	private String deriveFullyQualifiedClassName(Element _element, Elements _elements)
	{
		return _elements.getPackageOf(_element).getQualifiedName().toString().trim() + "." + _element.getSimpleName().toString().trim();
	}

	private boolean isGetter(String _methodName)
	{
		boolean isGetter = false;

		if (_methodName != null && _methodName.startsWith("get") == true
		   && _methodName.length() > 3)
		{
			isGetter = true;
		}

		return isGetter;
	}

	private boolean isSetter(String _methodName)
	{
		boolean isSetter = false;

		if (_methodName != null && _methodName.startsWith("set") == true
			  && _methodName.length() > 3)
		{
			isSetter = true;
		}

		return isSetter;
	}

	private String deduceAttributeName(String _methodName)
	{
		String attributeName = "";
		
		if (isGetter(_methodName) == true || isSetter(_methodName) == true)
		{
			attributeName = _methodName.substring(3);

			if (attributeName.equals(attributeName.toUpperCase()) == false &&
				  attributeName.equals(attributeName.toLowerCase()) == false)
			{
				attributeName = _methodName.substring(3,4).toLowerCase() + _methodName.substring(4);
			}
		}

		return attributeName;
	}

	private void spawnInterfaceClasses(String _jdbcUrl, String _driverClass, String _schema, String _username, String _password)
	{
		if (_jdbcUrl != null && "".equals(_jdbcUrl) == false)
		{
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Detected database");
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "url: " + _jdbcUrl);
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "driver: " + _driverClass);
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "schema: " + _schema);
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "username: " + _username);
			processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "password: " + _password);

			java.sql.Connection connection = null;
			java.sql.Statement statement = null;
			java.sql.ResultSet resultSet = null;
			
			try
			{
				Class.forName(_driverClass).newInstance();
				connection = java.sql.DriverManager.getConnection(_jdbcUrl, _username, _password);
				statement = connection.createStatement();

						//This SQL ony works for databases that support
						//informaton schema as define by ANSI SQL (I
						//think).  As written here it works for MySQL 5.
						//In the future we should check the jdbc URL to
						//determine the database and create the appropriate
						//SQL using the "AS" names as the interface to
						//conform to so that the rest of the application
						//works - Bediako

				String query = "SELECT " +
							   "c.table_schema AS tableSchema, " +
							   "c.table_name AS tableName, " +
							   "c.column_name AS columnName, " +
							   "c.ordinal_position AS ordinalPosition, " +
							   "c.character_maximum_length AS maxLength, " +
							   "c.numeric_precision AS numericPrecision, " +
							   "c.numeric_scale AS numericScale, " +
							   "c.data_type AS dataType, " +
							   "c.is_nullable AS isNullable, " +
							   "c.column_key AS columnKey, " +
							   "c.extra AS extra, " +
							   "k.referenced_table_schema AS referencedTableSchema, " +
							   "k.referenced_table_name AS referencedTableName, " +
							   "k.referenced_column_name AS referencedColumnName " +
							   "FROM " +
							   "information_schema.columns c " +
							   "LEFT JOIN information_schema.key_column_usage k " +
							   "ON " +
							   "(" +
							   "c.table_schema = k.table_schema " +
							   "AND c.table_name = k.table_name " +
							   "AND c.column_name = k.column_name " +
							   ") " +
							   "WHERE " +
							   "c.table_schema = '" +
							   _schema +
							   "' " +
							   "ORDER BY tableSchema, tableName, columnName";

				statement.executeQuery(query);

				resultSet = statement.getResultSet();

				List<Map> rowList = new ArrayList<Map>(); 

				while (resultSet.next ())
				{
					HashMap columnMap = new HashMap();

					columnMap.put("tableSchema", resultSet.getString("tableSchema"));
					columnMap.put("tableName", resultSet.getString("tableName"));
					columnMap.put("columnName", resultSet.getString("columnName"));

					columnMap.put("ordinalPosition", resultSet.getInt("ordinalPosition"));
					if ( resultSet.wasNull() == true) { columnMap.put("ordinalPosition", 0); }

					columnMap.put("maxLength", resultSet.getInt("maxLength"));
					if ( resultSet.wasNull() == true) { columnMap.put("maxLength", 0); }

					columnMap.put("numericPrecision", resultSet.getInt("numericPrecision"));
					if ( resultSet.wasNull() == true) { columnMap.put("numericPrecision", 0); }

					columnMap.put("numericScale", resultSet.getInt("numericScale"));
					if ( resultSet.wasNull() == true) { columnMap.put("numericScale", 0); }

					columnMap.put("dataType", resultSet.getString("dataType"));
					columnMap.put("isNullable", resultSet.getString("isNullable"));
					columnMap.put("columnKey", resultSet.getString("columnKey"));
					if ( resultSet.wasNull() == true) { columnMap.put("columnKey", ""); }

					columnMap.put("extra", resultSet.getString("extra"));
					if ( resultSet.wasNull() == true) { columnMap.put("extra", ""); }

					columnMap.put("referencedTableSchema", resultSet.getString("referencedTableSchema"));
					if ( resultSet.wasNull() == true) { columnMap.put("referencedTableSchema", ""); }

					columnMap.put("referencedTableName", resultSet.getString("referencedTableName"));
					if ( resultSet.wasNull() == true) { columnMap.put("referencedTableName", ""); }

					columnMap.put("referencedColumnName", resultSet.getString("referencedColumnName"));
					if ( resultSet.wasNull() == true) { columnMap.put("referencedColumnName", ""); }

					rowList.add(columnMap);
				}
				
				String packageName = processingEnv.getOptions().get("package");
				processRowList(rowList, packageName);
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
			finally
			{
				if (resultSet != null) { try { resultSet.close(); } catch (Exception e) {}}
				if (statement != null) { try { statement.close(); } catch (Exception e) {}}
				if (connection != null) { try { connection.close(); } catch (Exception e) {}}
			}
		}
	}
	
	private void processRowList(List<Map> _rowList, String _packageName)
	{
		for (Map columnMap: _rowList)
		{
			String tableSchema = (String) columnMap.get("tableSchema");
			String tableName = (String) columnMap.get("tableName");
			
			String fullTableName = tableSchema + "." + tableName;
			
			DomainObjectModel domainObjectModel = getPreGenerationMap().get(fullTableName);

			if (domainObjectModel == null)
			{
				domainObjectModel = createNewDomainObjectModel(tableName, tableName, _packageName, _packageName + "airlift.domaininterface");
								
				getPreGenerationMap().put(fullTableName, domainObjectModel);
			}

			String columnName = (String) columnMap.get("columnName");
			String dataType = (String) columnMap.get("dataType");
			
			Attribute attribute = domainObjectModel.getAttributeByName(columnName);

			if (attribute == null)
			{
				attribute = new Attribute();
				attribute.setName(columnName);

				Integer precision = (Integer) columnMap.get("numericPrecision");
				Integer scale = (Integer) columnMap.get("numericScale");
				
				attribute.setType(getJavaType(dataType, precision, scale));
			}

			Annotation persistable = domainObjectModel.getAnnotation(attribute, "airlift.generator.Persistable");

			if (persistable == null)
			{
				persistable = new Annotation();
				persistable.setName("airlift.generator.Persistable");
				domainObjectModel.addAnnotation(attribute, persistable);
			}

			persistable.addParameterValue("isPersistable", true);
			persistable.addParameterValue("tableName", tableName);
			persistable.addParameterValue("field", attribute.getName());
			persistable.addParameterValue("maxLength", columnMap.get("maxLength"));
			persistable.addParameterValue("precision", columnMap.get("numericPrecision"));
			persistable.addParameterValue("scale", columnMap.get("numericScale"));
			persistable.addParameterValue("isPrimaryKey", isPrimaryKey(columnMap));
			persistable.addParameterValue("isAutoIncrementedPrimaryKey", isAutoIncrementPrimaryKey(columnMap));
			persistable.addParameterValue("isForeignKey", isForeignKey(columnMap));

			String foreignClassName = (columnMap.get("referencedTableName") == null || "".equals(columnMap.get("referencedTableName"))) ? "" : _packageName + ".airlift.domaininterface." + columnMap.get("referencedTableName");

			persistable.addParameterValue("mapTo", columnMap.get("referencedTableName") + "." + columnMap.get("referencedColumnName"));
			persistable.addParameterValue("nullable", isNullable(columnMap));

			Annotation searchable = domainObjectModel.getAnnotation(attribute, "airlift.generator.Searchable");

			if (searchable == null)
			{
				searchable = new Annotation();
				searchable.setName("airlift.generator.Searchable");
				domainObjectModel.addAnnotation(attribute, searchable);
			}

			searchable.addParameterValue("isSearchable", isSearchable(columnMap));
		}
	}

	private void generateInterfaceFiles(Element _element)
	{
		JavaGenerator generator = new JavaGenerator();
		
		if (getPreGenerationMap().isEmpty() == false)
		{
			for (DomainObjectModel domainObjectModel: getPreGenerationMap().values())
			{
				String directory = "genjava";

				String generatedString = generator.generateInterface(domainObjectModel);
				String fileName =  directory + "." + domainObjectModel.getRootPackageName() + ".airlift.domaininterface." + domainObjectModel.upperTheFirstCharacter(domainObjectModel.getClassName());
				generator.writeJavaFile(fileName, generatedString, _element, processingEnv);
			}

			getPreGenerationMap().clear();
		}
	}
	
	private boolean isNullable(Map _columnMap)
	{
		return ("yes".equalsIgnoreCase((String) _columnMap.get("isNullable")) == true);
	}
	
	private boolean isPrimaryKey(Map _columnMap)
	{
		return ("pri".equalsIgnoreCase((String) _columnMap.get("columnKey")) == true);
	}

	private boolean isAutoIncrementPrimaryKey(Map _columnMap)
	{
		return ("auto_increment".equalsIgnoreCase((String) _columnMap.get("extra")) == true);
	}

	private boolean isForeignKey(Map _columnMap)
	{
		return ("".equalsIgnoreCase((String) _columnMap.get("referencedTableName")) == false) &&
				(_columnMap.get("referencedTableName") != null);
	}

	private boolean isSearchable(Map _columnMap)
	{
		return ("mul".equalsIgnoreCase((String) _columnMap.get("columnKey")) == true) ||
				("uni".equalsIgnoreCase((String) _columnMap.get("columnKey")) == true);
	}

	private String getJavaType(String _databaseType, Integer _precision, Integer _scale)
	{
		processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "database type is: " + _databaseType);
		processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "precision type is: " + _precision);
		processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "scale type is: " + _scale);
		
		String javaType = "java.lang.String";
		String databaseType = (_databaseType != null) ? _databaseType.trim() : "";
		
		if (_precision > 0 && _scale > 0)
		{
			javaType = "java.lang.Double";
		}
		else if (_precision > 0 && _scale == 0)
		{
			javaType = "java.lang.Integer";
		}
		else if (databaseType.equalsIgnoreCase("DATE") == true ||
				 databaseType.equalsIgnoreCase("DATETIME") == true
				)
		{
			javaType = "java.sql.Date";
		}
		else if (_databaseType.equalsIgnoreCase("TIMESTAMP") == true)
		{
			javaType = "java.sql.Timestamp";
		}

		return javaType;
	}

	public boolean isClockable(Element _element)
	{
		boolean isClockable = false;

		java.util.List<? extends javax.lang.model.type.TypeMirror> typeMirrorList = processingEnv.getTypeUtils().directSupertypes(_element.asType());

		for (javax.lang.model.type.TypeMirror typeMirror: typeMirrorList)
		{
			if ("airlift.Clockable".equals(typeMirror.toString()) == true)
			{
				isClockable = true;
			}
		}

		return isClockable;
	}
}		