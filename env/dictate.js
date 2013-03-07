function print(_message)
{
	Packages.java.lang.System.out.println(_message);
}

function convertToParameterName(_element, _index, _array)
{
	if (_index === 0)
	{		
		_array[_index] = (!_element) ? "" : Packages.airlift.util.AirliftUtil.lowerTheFirstCharacter(_element.toLowerCase());
	}
	else
	{
		_array[_index] = (!_element) ? "" : Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_element.toLowerCase());
	}
}

function convertToClassName(_element, _index, _array)
{
	_array[_index] = (!_element) ? "" : Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_element);
}

function join(_name, _function, _separator)
{
	var name = (new Packages.java.lang.String(_name)).replaceAll("\"", "") + "";
	var tokenArray = ("" + name).split(" ");
	var separator = (!_separator) ? "" : _separator;
	tokenArray.forEach(_function);
	var joinedArray = tokenArray.join(separator);
	return (!joinedArray || "undefined".equalsIgnoreCase(joinedArray)) ? null : joinedArray;
}

var rule = {};

rule.display = function()
{
	this.presentable.addParameterValue("isPresentable", new Packages.java.lang.Boolean(this.value).booleanValue());
}

rule.displayLength = function()
{
	this.presentable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
}

rule.type = function()
{
	var type = undefined;

	if (this.value === null || this.value === undefined)
	{
		type = "java.lang.String";
	}
	else if (this.value.toLowerCase().contains("whole number") === true ||
		this.value.toLowerCase().contains("wholenumber") === true ||  
		this.value.toLowerCase().contains("number") === true ||  
		this.value.toLowerCase().contains("integer") === true
	   )
	{
		type = "java.lang.Integer";
	}
	else if (this.value.toLowerCase().contains("fractional number") === true ||
			 this.value.toLowerCase().contains("fractionalnumber") === true ||
			 this.value.toLowerCase().contains("decimal") === true ||
			 this.value.toLowerCase().contains("decimal number") === true ||
			 this.value.toLowerCase().contains("decimalnumber") === true ||
			 this.value.toLowerCase().contains("fractional") === true ||
			 this.value.toLowerCase().contains("fraction") === true ||
			 this.value.toLowerCase().contains("money") === true ||
			 this.value.toLowerCase().contains("price") === true ||
			 this.value.toLowerCase().contains("cost") === true ||
			 this.value.toLowerCase().contains("amount") === true ||
			 this.value.toLowerCase().contains("double") === true
			)
	{
		type = "java.lang.Double";
	}
	else if (this.value.toLowerCase().contains("date") === true ||
			 this.value.toLowerCase().contains("time") === true ||
			 this.value.toLowerCase().contains("date time") === true ||
			 this.value.toLowerCase().contains("datetime") === true
			)
	{
		type = "java.util.Date";
	}
	else if (this.value.toLowerCase().contains("boolean") === true)
	{
		type = "java.lang.Boolean";
	}
	else if (this.value.toLowerCase().contains("short") === true)
	{
		type = "java.lang.Short";
	}
	else if (this.value.toLowerCase().contains("byte") === true)
	{
		type = "java.lang.Byte";
	}
	else if (this.value.toLowerCase().contains("char") === true ||
			 this.value.toLowerCase().contains("character") === true)
	{
		type = "java.lang.Character";
	}
	else if (this.value.toLowerCase().contains("long") === true)
	{
		type = "java.lang.Long";
	}
	else if (this.value.toLowerCase().contains("float") === true)
	{
		type = "java.lang.Float";
	}
	else if (this.value.toLowerCase().contains("text") === true)
	{
		type = "java.lang.String";
		this.persistable.addParameterValue("semanticType", "Semantic.VERYLONGTEXT");
		this.persistable.addParameterValue("maxLength", "10485760");   //10 MBs long :)
	}
	else if (this.value.toLowerCase().contains("email") === true)
	{
		type = "java.lang.String";
		this.persistable.addParameterValue("semanticType", "Semantic.EMAIL");
	}
	else if (this.value.toLowerCase().contains("phone") === true)
	{
		type = "java.lang.String";
		this.persistable.addParameterValue("semanticType", "Semantic.PHONENUMBER");
	}
	else if (this.value.toLowerCase().contains("zip") === true)
	{
		type = "java.lang.String";
		this.persistable.addParameterValue("semanticType", "Semantic.ZIPCODE");
	}
	else if (this.value.toLowerCase().contains("credit") === true)
	{
		type = "java.lang.String";
		this.persistable.addParameterValue("semanticType", "Semantic.CREDITCARD");
	}
	else if (this.value.toLowerCase().contains("address") === true)
	{
		type = "java.lang.String";
		this.persistable.addParameterValue("semanticType", "Semantic.ADDRESS");
	}
	else if (this.value.toLowerCase().contains("blob") === true)
	{
		type = 	"com.google.appengine.api.datastore.Blob";
	}
	else 
	{
		type = "java.lang.String";
	}

	if (this.value &&
		(
		this.value.toLowerCase().contains("collection") === true ||
		this.value.toLowerCase().contains("list") === true ||
		this.value.toLowerCase().contains("tuple") === true
		)
	   )
	{
		type = "java.util.List<" + type + ">";
	}

	if (this.value &&
		  (
		   this.value.toLowerCase().contains("set") === true ||
		   this.value.toLowerCase().contains("group") === true
		  )
	   )
	{
		type = "java.util.Set<" + type + ">";
	}

	if (type && this.value && this.value.toLowerCase().contains("array") === true)
	{
		type += "[]";
	}

	this.attribute.setType(type);
}

rule.maxLength = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
}

rule.searchable = function()
{
	this.persistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());
}

rule.indexable = function()
{
	this.persistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
}

rule.maximumLength = function()
{
	this.maxLength();
}

rule.minLength = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
}

rule.minimumLength = function()
{
	this.minLength();
}

rule.biggerThan = function()
{
	this.persistable.addParameterValue("minValue", quoteString(this.value));
}

rule.greaterThan = function()
{
	this.biggerThan();
}

rule.lessThan = function()
{
	this.persistable.addParameterValue("maxValue", quoteString(this.value));
}

rule.greaterThanOrEqualTo = function()
{
	this.biggerThan();
}

rule.lessThanOrEqualTo = function()
{
	this.lessThan();
}

rule.smallerThan = function()
{
	this.lessThan();
}

rule.regexFormat = function()
{
	this.presentable.addParameterValue("hasFormat", this.value);
}

rule.calendarFormat = function()
{
	this.presentable.addParameterValue("dateTimePattern", this.value);
}

rule.allowedValues = function()
{
	var allowedValueArray = this.value.replaceAll("^\s*\"", "").replaceAll("\"\s*$", "").split(",");
	var allowedValueStringBuffer = new Packages.java.lang.StringBuffer("{ ");
	
	for (var i = 0; i < allowedValueArray.length; i++)
	{
		allowedValueStringBuffer.append("\"").append(allowedValueArray[i].trim()).append("\": 1,");
	}

	var allowedValueString = allowedValueStringBuffer.toString().replaceAll(",$", " }");
	
	this.presentable.addParameterValue("allowedValues", allowedValueString);
}

rule.required = function()
{
	this.persistable.addParameterValue("required", new Packages.java.lang.Boolean(true).booleanValue());
}

rule.notRequired = function()
{
	this.persistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
}

rule.isNotRequired = function()
{
	this.notRequired();
}

rule.immutable = function(_value)
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Boolean(true).booleanValue());
}

rule.notImmutable = function()
{
	this.persistable.addParameterValue("immutable", new Packages.java.lang.Boolean(false).booleanValue());
}

rule.precision = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
}

rule.scale = function(_value)
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
}

rule.plural = function()
{
	this.presentable.addParameterValue("pluralLabel", quoteString(this.value));
}

rule.pluralSpelling = function()
{
	this.presentable.addParameterValue("pluralLabel", quoteString(this.value));
}

rule.pluralLabel = function()
{
	this.presentable.addParameterValue("pluralLabel", quoteString(this.value));
}

rule.label = function()
{
	var label = this.value.toLowerCase();

	if (label.equalsIgnoreCase(this.value) === false)
	{
		label = Packages.org.apache.commons.lang.WordUtils.capitalizeFully(label);
	}

	this.presentable.addParameterValue("label", quoteString(label.replaceAll("\"", "")));
}

rule.readOnly = function()
{
	this.presentable.addParameterValue(this.airliftName, new Packages.java.lang.Boolean(true).booleanValue());
}

rule.encrypted = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Boolean(true).booleanValue());
}

rule.notEncrypted = function()
{
	this.persistable.addParameterValue("encrypted", new Packages.java.lang.Boolean(false).booleanValue());
}

rule.hidden = function()
{
	this.presentable.addParameterValue("inputType", "HIDDEN");
}

rule.password = function()
{
	this.presentable.addParameterValue("inputType", "PASSWORD");
}

rule.mapTo = function()
{
	this.persistable.addParameterValue("mapTo", quoteString(this.value));
}

rule.primaryKey = function()
{
	this.persistable.addParameterValue("isPrimaryKey", new Packages.java.lang.Boolean(true).booleanValue());
}

rule.widgetTextfield = function()
{
	this.presentable.addParameterValue("inputType", "TEXT");
}

rule.widgetTextarea = function()
{
	this.presentable.addParameterValue("inputType", "TEXTAREA");
}

rule.widgetText = function()
{
	this.widgetTextfield();
}

rule.widgetTextField = function()
{
	this.widgetTextfield();
}

rule.widgetTextArea = function()
{
	this.widgetTextarea();
}

rule.widgetSelect = function()
{
	this.presentable.addParameterValue("inputType", "SELECT");
}

rule.widgetMultipleSelect = function()
{
	this.presentable.addParameterValue("inputType", "MULTISELECT");
}

rule.widgetRadio = function()
{
	this.presentable.addParameterValue("inputType", "RADIO");
}

rule.widgetCheckbox = function()
{
	this.presentable.addParameterValue("inputType", "CHECKBOX");
}

rule.widgetCheckBox = function()
{
	this.widgetCheckbox();
}

rule.widgetCheck = function()
{
	this.widgetCheckbox();
}

rule.present = function(_dictationResource)
{
	var presentable = Packages.airlift.generator.Annotation();
	presentable.name = "presentable";

	Packages.java.lang.System.out.println("Processing persentable: " + presentable.name);
	this.resourceModel.getResourceAnnotationMap().put(presentable.name, presentable);
}

rule.persist = function(_dictationResource)
{
	var persistable = Packages.airlift.generator.Annotation();
	persistable.name = "persistable";
	Packages.java.lang.System.out.println("Processing persistable: " + persistable.name);

	this.resourceModel.getResourceAnnotationMap().put(persistable.name, persistable);
}

rule.cache = function(_dictationResource)
{
	var cacheable = Packages.airlift.generator.Annotation();
	cacheable.name = "cacheable";
	Packages.java.lang.System.out.println("Processing cacheable: " + cacheable.name);
	
	this.resourceModel.getResourceAnnotationMap().put(cacheable.name, cacheable);
}

rule.audit = function(_dictationResource)
{
	var auditable = Packages.airlift.generator.Annotation();
	auditable.name = "auditable";
	Packages.java.lang.System.out.println("Processing auditable: " + auditable.name);

	this.resourceModel.getResourceAnnotationMap().put(auditable.name, auditable);
}

rule.propertyGroup = function(_dictationResource)
{
	this.presentable.addParameterValue("fieldSetName", quoteString(this.value));
}

rule.secure = function(_dictationResource)
{
	var securable = Packages.airlift.generator.Annotation();
	securable.name = "securable";

	var securityMap = new Packages.java.util.HashMap();

	for (var security in Iterator(_dictationResource.securityList))
	{
		if (securityMap.containsKey(security.action) === false) { securityMap.put(security.action, ""); }

		var securityRoleList = securityMap.get(security.action);
		securityRoleList += security.role + new Packages.java.lang.String(",");
		securityMap.put(security.action, securityRoleList);
	}

	for (var securityEntry in Iterator(securityMap.entrySet()))
	{
		var name = securityEntry.getKey();
		var value = securityEntry.getValue().replaceAll(",$", "");

		if ("created".equalsIgnoreCase(name) === true ||
			"create".equalsIgnoreCase(name) === true)
		{
			securable.addParameterValue("postRoles", quoteString(value));
		}
		else if ("updated".equalsIgnoreCase(name) === true ||
			"update".equalsIgnoreCase(name) === true)
		{
			securable.addParameterValue("putRoles", quoteString(value));
		}
		else if ("deleted".equalsIgnoreCase(name) === true ||
			"delete".equalsIgnoreCase(name) === true)
		{
			securable.addParameterValue("deleteRoles", quoteString(value));
		}
		else if ("got".equalsIgnoreCase(name) === true ||
				 "get".equalsIgnoreCase(name) === true ||
				 "seen".equalsIgnoreCase(name) === true ||
				 "viewed".equalsIgnoreCase(name) === true ||
				 "looked at".equalsIgnoreCase(name) === true ||
			"gotten".equalsIgnoreCase(name) === true)
		{
			securable.addParameterValue("getRoles", quoteString(value));
			securable.addParameterValue("headRoles", quoteString(value));
		}
		else if ("collected".equalsIgnoreCase(name) === true ||
			"collect".equalsIgnoreCase(name) === true)
		{
			securable.addParameterValue("collectRoles", quoteString(value));
		}
	}

	Packages.java.lang.System.out.println("Processing securable: " + securable.name);
	this.resourceModel.getResourceAnnotationMap().put(securable.name, securable);
}

function quoteString(_string)
{
	var string = new Packages.java.lang.String(_string);
	
	if (string.startsWith("\"") === true && string.endsWith("\"") === true)
	{
		string = string.substring(1, string.length() - 1);
	}

	print("processed: " + _string + " into: " + string);
			
	return "\"" + string + "\"";
}

function determinePropertySetMapping(_dictationResource, _dictationResourceMap)
{
	var propertyNameToPropertyMap = new Packages.java.util.HashMap();
	var orderedPropertyList = new Packages.java.util.ArrayList();
	print("in determinePropertySetMapping");
	
	for (var likeResourceName in Iterator(_dictationResource.likeDomainList))
	{
		var likeResource = _dictationResourceMap.get(likeResourceName);

		if (likeResource)
		{
			var [tempOrderedPropertyList, tempPropertyMap] = determinePropertySetMapping(likeResource, _dictationResourceMap);

			for (var orderedProperty in Iterator(orderedPropertyList))
			{
				var indexOfOrderedProperty = tempOrderedPropertyList.indexOf(orderedProperty);

				if (indexOfOrderedProperty > -1)
				{
					tempOrderedPropertyList.remove(indexOfOrderedProperty);
					tempPropertyMap.remove(orderedProperty);
				}
			}
			
			orderedPropertyList.addAll(tempOrderedPropertyList);
			propertyNameToPropertyMap.putAll(tempPropertyMap);
		}
	}

	for (var parsedPropertyName in Iterator(_dictationResource.propertyNameList))
	{
		orderedPropertyList.add(parsedPropertyName);
		propertyNameToPropertyMap.put(parsedPropertyName, _dictationResource.propertyMap.get(parsedPropertyName));
	}

	return [orderedPropertyList, propertyNameToPropertyMap];
}

function determineRelationshipSetMapping(_dictationResource, _dictationResourceMap)
{
	var relationshipNameToPropertyMap = new Packages.java.util.HashMap();
	var orderedRelationshipList = new Packages.java.util.ArrayList();

	print("in determineRelationshipSetMapping looking at " + _dictationResource.likeDomainList);
	for (var likeResourceName in Iterator(_dictationResource.likeDomainList))
	{
		var likeResource = _dictationResourceMap.get(likeResourceName);

		if (likeResource)
		{
			var [tempRelationshipList, tempRelationshipMap] = determineRelationshipSetMapping(likeResource, _dictationResourceMap);
			orderedRelationshipList.addAll(tempRelationshipList);
			relationshipNameToPropertyMap.putAll(tempRelationshipMap);
		}
	}

	for (var relationshipMapEntry in Iterator(_dictationResource.relationshipMap.entrySet()))
	{
		var relationshipName = relationshipMapEntry.getKey();
		var relationship = relationshipMapEntry.getValue();

		orderedRelationshipList.add(relationshipName);
		relationshipNameToPropertyMap.put(relationshipName, relationship);
	}

	return [orderedRelationshipList, relationshipNameToPropertyMap];
}

function determineDisplayOrder(_propertyName, _propertyDisplayOrder)
{
	print("Determining display order for:" + _propertyName + " in: "+ _propertyDisplayOrder);
	var displayOrder = 10000;
	var attributeIndex = 0;
	
	for (var i = 0; _propertyDisplayOrder && i < _propertyDisplayOrder.size(); i++)
	{
		if (_propertyName.equalsIgnoreCase(_propertyDisplayOrder.get(i)) === true)
		{
			attributeIndex = i;
			displayOrder = (i * 10) + 10;
		}
	}

	print("Display order is: " + displayOrder);
	
	return [attributeIndex, displayOrder];
}

function convertToResourceModel(_dictationResource, _dictationResourceMap)
{
	var resourceModel = new Packages.airlift.generator.ResourceModel();

	resourceModel.setPackageName(_dictationResource.packageName);
	resourceModel.setRootPackageName(_dictationResource.packageName);
	resourceModel.setBuildPackageName(_dictationResource.packageName);
	resourceModel.setClassName(join(_dictationResource.name, convertToClassName))
	resourceModel.setIsAbstract(_dictationResource.isAbstract);
	resourceModel.setIsReferenced(_dictationResource.isReferenced);
	resourceModel.setIsAudited(_dictationResource.isAudited);

	print ("processing resource named: " + resourceModel.getClassName());

	rule.resourceModel = resourceModel;

	rule.secure(_dictationResource);

	if (resourceModel.isReferencedResource() === true)
	{
		rule.cache(_dictationResource);
	}

	if (resourceModel.isAuditedResource() === true)
	{
		rule.audit(_dictationResource);
	}

	rule.present(_dictationResource);
	rule.persist(_dictationResource);

	//Determine this resource full property set mapping
	var [orderedPropertyList, propertyNameToPropertyMap] = determinePropertySetMapping(_dictationResource, _dictationResourceMap);
	
	//Properties
	for (var propertyName in Iterator(orderedPropertyList))
	{
		var key = propertyName;
		var value = propertyNameToPropertyMap.get(propertyName);

		var persistable = Packages.airlift.generator.Annotation();
		persistable.name = "persistable";

		var presentable = Packages.airlift.generator.Annotation();
		presentable.name = "presentable";
		var [attributeIndex, displayOrder] = determineDisplayOrder(propertyName, _dictationResource.propertyDisplayOrder);
		presentable.addParameterValue("displayOrder", new java.lang.Integer(displayOrder));

		var parsedPropertyName = join(key, convertToParameterName);
		var property = value;
		property.annotationMap.put("label", key);
		var attribute = new Packages.airlift.generator.Attribute();

		attribute.setName(parsedPropertyName);
		attribute.setType("java.lang.String");

		rule.attribute = attribute;
		rule.presentable = presentable;
		rule.persistable = persistable;
		rule.propertyAnnotationMap = property.annotationMap;

		for (var annotationEntry in Iterator(property.annotationMap.entrySet()))
		{
			var annotationName = join(annotationEntry.getKey(), convertToParameterName);
			var annotationValue = annotationEntry.getValue();

			rule.airliftName = annotationName;
			rule.value = annotationValue;

			if (rule[annotationName])
			{
				rule[annotationName]();
			}
			else
			{
				print("No rule defined for annotation named: " + annotationName);
			}
		}

		resourceModel.addAnnotation(rule.attribute, attributeIndex, rule.persistable);
		resourceModel.addAnnotation(rule.attribute, attributeIndex, rule.presentable);
	}

	//Add post date attribute
	var postDateAttribute = new Packages.airlift.generator.Attribute();
	postDateAttribute.setName("auditPostDate");
	postDateAttribute.setType("java.util.Date");

	var postDatePersistable = Packages.airlift.generator.Annotation();
	postDatePersistable.name = "persistable";
	postDatePersistable.addParameterValue("nullable", new Packages.java.lang.Boolean(true).booleanValue());
	postDatePersistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
	postDatePersistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());
	
	var postDatePresentable = Packages.airlift.generator.Annotation();
	postDatePresentable.name = "presentable";
	postDatePresentable.addParameterValue("label", "\"record created date\"");
		
	resourceModel.addAnnotation(postDateAttribute, postDatePersistable);
	resourceModel.addAnnotation(postDateAttribute, postDatePresentable);

	//add put date attribute
	var putDateAttribute = new Packages.airlift.generator.Attribute();
	putDateAttribute.setName("auditPutDate");
	putDateAttribute.setType("java.util.Date");

	var putDatePersistable = Packages.airlift.generator.Annotation();
	putDatePersistable.name = "persistable";
	putDatePersistable.addParameterValue("nullable", new Packages.java.lang.Boolean(true).booleanValue());
	putDatePersistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
	putDatePersistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());
	
	var putDatePresentable = Packages.airlift.generator.Annotation();
	putDatePresentable.name = "presentable";
	putDatePresentable.addParameterValue("label", "\"record updated date\"");
	
	resourceModel.addAnnotation(putDateAttribute, putDatePersistable);
	resourceModel.addAnnotation(putDateAttribute, putDatePresentable);
	
	//add audit user attribute
	var auditUserAttribute = new Packages.airlift.generator.Attribute();
	auditUserAttribute.setName("auditUserId");
	auditUserAttribute.setType("java.lang.String");

	var auditUserPersistable = Packages.airlift.generator.Annotation();
	auditUserPersistable.name = "persistable";
	auditUserPersistable.addParameterValue("nullable", new Packages.java.lang.Boolean(true).booleanValue());
	auditUserPersistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
	auditUserPersistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());

	var auditUserPresentable = Packages.airlift.generator.Annotation();
	auditUserPresentable.name = "presentable";
	auditUserPresentable.addParameterValue("isPresentable", "false");
	auditUserPresentable.addParameterValue("label", "\"changed by user id\"");
	
	resourceModel.addAnnotation(auditUserAttribute, auditUserPersistable);
	resourceModel.addAnnotation(auditUserAttribute, auditUserPresentable);

		//add audit request id attribute
	var auditUserAttribute = new Packages.airlift.generator.Attribute();
	auditUserAttribute.setName("auditRequestId");
	auditUserAttribute.setType("java.lang.String");

	var auditUserPersistable = Packages.airlift.generator.Annotation();
	auditUserPersistable.name = "persistable";
	auditUserPersistable.addParameterValue("nullable", new Packages.java.lang.Boolean(true).booleanValue());
	auditUserPersistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
	auditUserPersistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());

	var auditUserPresentable = Packages.airlift.generator.Annotation();
	auditUserPresentable.name = "presentable";
	auditUserPresentable.addParameterValue("isPresentable", "false");
	auditUserPresentable.addParameterValue("label", "\"web request id\"");

	resourceModel.addAnnotation(auditUserAttribute, auditUserPersistable);
	resourceModel.addAnnotation(auditUserAttribute, auditUserPresentable);

	var [orderedRelationshipList, relationshipNameToRelationshipMap] = determineRelationshipSetMapping(_dictationResource, _dictationResourceMap);
	//Foreign Keys

	print ("ordered relationship list: " + orderedRelationshipList);
	print ("relationship map: " + relationshipNameToRelationshipMap);
	for (var relationshipName in Iterator(orderedRelationshipList))
	{
		var key = relationshipName;
		var value = relationshipNameToRelationshipMap.get(relationshipName);

		print ("Processing relationship: " + value);
		print ("Target name: " + value.targetDomain);
		print ("Type: " + value.type);
		print ("Required: " + value.required);

		var persistable = Packages.airlift.generator.Annotation();
		persistable.name = "persistable";
		persistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
		
		var presentable = Packages.airlift.generator.Annotation();
		presentable.name = "presentable";
		var [attributeIndex, relationshipDisplayOrder] = determineDisplayOrder(relationshipName, _dictationResource.propertyDisplayOrder);
		presentable.addParameterValue("displayOrder", new java.lang.Integer(relationshipDisplayOrder));

		var relationship = value;

		var parsedRelationshipName = join(relationship.targetDomain + " Id", convertToParameterName);
		relationship.annotationMap.put("label", Packages.airlift.util.AirliftUtil.lowerTheFirstCharacter(relationship.targetDomain));
		var targetName = join(relationship.targetDomain, convertToClassName);

		var attribute = new Packages.airlift.generator.Attribute();

		attribute.setName(parsedRelationshipName);
		attribute.setType("java.lang.String");

		rule.attribute = attribute;
		rule.presentable = presentable;
		rule.persistable = persistable;
		rule.propertyAnnotationMap = relationship.annotationMap;

		print("Processing annotation map of size: " + relationship.annotationMap.keySet().size());

		for (var annotationEntry in Iterator(relationship.annotationMap.entrySet()))
		{
			var annotationName = join(annotationEntry.getKey(), convertToParameterName);
			var annotationValue = annotationEntry.getValue();

			print("Processing annotation: " + annotationName + " with value: " + annotationValue);

			rule.airliftName = annotationName;
			rule.value = annotationValue;

			if (rule[annotationName])
			{
				rule[annotationName]();
			}
			else
			{
				print("No rule defined for annotation named: " + annotationName);
			}
		}

		rule.airliftName = "mapTo";
		rule.value = targetName + ".id";
		rule.mapTo();

		resourceModel.addAnnotation(rule.attribute, attributeIndex, rule.persistable);
		resourceModel.addAnnotation(rule.attribute, attributeIndex, rule.presentable);
	}

	//Primary Key
	var persistable = Packages.airlift.generator.Annotation();
	persistable.name = "persistable";
	persistable.addParameterValue("nullable", new Packages.java.lang.Boolean(true).booleanValue());
	persistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(false).booleanValue());
	persistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(false).booleanValue());
	
	var presentable = Packages.airlift.generator.Annotation();
	presentable.name = "presentable";
	presentable.addParameterValue("displayOrder", new java.lang.Integer(0));
	presentable.addParameterValue("label", "\"record id\"");

	var attribute = new Packages.airlift.generator.Attribute();

	attribute.setName("id");
	attribute.setType("java.lang.String");

	rule.attribute = attribute;
	rule.presentable = presentable;
	rule.persistable = persistable;

	rule.airliftName = "primaryKey";
	rule.value = new Packages.java.lang.Boolean(true).booleanValue();

	rule.primaryKey();

	resourceModel.addAnnotation(rule.attribute, rule.persistable);
	resourceModel.addAnnotation(rule.attribute, rule.presentable);

	return resourceModel;
}

function writeAppProfile(_contents)
{
	var fileSeparator = Packages.java.io.File.separator;
	var dir = project.getProperty("src.genjava") + fileSeparator +
							 "airlift" + fileSeparator + "app" +
							 fileSeparator;
	var file = new Packages.java.io.File(dir + fileSeparator + "AppProfile.java");
	file["delete"]();
	writeFile(file, _contents);
}

function writeResourceMeta(_metaName, _contents)
{
	var fileSeparator = Packages.java.io.File.separator;
	var dir = project.getProperty("war") + fileSeparator + "WEB-INF" + fileSeparator +
			  "classes" + fileSeparator + "gen" + fileSeparator +
			  "meta" + fileSeparator + "r";

	var file = new Packages.java.io.File(dir + fileSeparator + _metaName.toLowerCase() + ".js");
	file["delete"]();
	writeFile(file, _contents);
}

function writeAttributeMeta(_metaName, _contents)
{
	var fileSeparator = Packages.java.io.File.separator;
	var dir = project.getProperty("war") + fileSeparator + "WEB-INF" + fileSeparator +
			  "classes" + fileSeparator + "gen" + fileSeparator + 
			  "meta" + fileSeparator + "a";
	var file = new Packages.java.io.File(dir + fileSeparator + _metaName.toLowerCase() + ".js");
	file["delete"]();
	writeFile(file, _contents);
}

function writeFile(_file, _contents)
{
	try
	{
		var fileWriter = new Packages.java.io.FileWriter(_file);
		fileWriter.write(_contents);
	}
	finally
	{
		if (fileWriter) { fileWriter.close(); }
	}
}	

function createNewResource(_resource, _parser)
{
	print("Creating a new resource for: " + _resource.name);
	
	var newResource = _parser.createResource();
	
	newResource.name = "New " + _resource.name;
	newResource.packageName = resource.packageName;
	newResource.isAbstract = false;
	newResource.isReference = false;

	for (var security in Iterator(_resource.securityList))
	{
		if ("created".equalsIgnoreCase(security.action) === true ||
			  "create".equalsIgnoreCase(security.action) === true)
		{
			newResource.securityList.add(_parser.createSecurity("collect", security.role));
		}
	}

	if (newResource.securityList.isEmpty() === true)
	{
		newResource.securityList.add(_parser.createSecurity("collect", "all"));
	}
	
	newResource.securityList.add(_parser.createSecurity("get", "noone"));
	newResource.securityList.add(_parser.createSecurity("create", "noone"));
	newResource.securityList.add(_parser.createSecurity("update", "noone"));
	newResource.securityList.add(_parser.createSecurity("delete", "noone"));
	newResource.securityList.add(_parser.createSecurity("head", "noone"));
	newResource.securityList.add(_parser.createSecurity("trace", "noone"));
	
	return newResource;
}

importClass(org.antlr.runtime.ANTLRFileStream);
importClass(org.antlr.runtime.CommonTokenStream);
importClass(org.antlr.runtime.debug.DebugEventSocketProxy);

var fileSeparator = Packages.java.io.File.separator;
var dictationFile = project.getProperty("src.doc") + fileSeparator + project.getProperty("dictation.file");
var appName = project.getProperty("dictation.appName");

print ("Starting dictation: for file: " + dictationFile);

var dictationLexer = new com.lucidlabs.dsl.dictation.DictationLexer(new ANTLRFileStream(dictationFile, "UTF8"));

print ("Created lexer");
var tokens = new CommonTokenStream(dictationLexer);
print ("Creating Parser");
var dictationParser = new com.lucidlabs.dsl.dictation.DictationParser(tokens);

print ("Starting parsing");
dictationParser.business();
print ("Parsing completed");

var resourceNameToResourceMap = new Packages.java.util.HashMap();
var resourceNameToResourceModelMap = new Packages.java.util.HashMap();
var newResourceNameToResourceModelMap = new Packages.java.util.HashMap();

for (var resource in Iterator(dictationParser.domainList))
{
	print("Class resource: "  + resource.getClass().getName());
	print("Loading Resource name: " + resource.name);
	resourceNameToResourceMap.put(resource.name, resource);
}

print ("Resource name to model map is: " + resourceNameToResourceMap);

for (var resourceEntry in Iterator(resourceNameToResourceMap.entrySet()))
{
	var resource = resourceEntry.getValue();
	print("**** For resource: "  + resource.name + " the property display order is: " + resource.propertyDisplayOrder);
	
	function populatePropertyDisplayOrder(_resource)
	{
		print("in populatePropertyDisplayOrder");
		var likeResourceList = _resource.likeDomainList;
		var tempList = new Packages.java.util.ArrayList();
		
		for (var likeResourceName in Iterator(likeResourceList))
		{
			print("processing like resource name: " + likeResourceName);
			var likeResource = resourceNameToResourceMap.get(likeResourceName);

			if (likeResource === null || likeResource === undefined) { print("ERROR!!! Unable to find resource named: " + likeResourceName); }
			
			tempList.addAll(likeResource.propertyDisplayOrder);
		}

		_resource.propertyDisplayOrder.addAll(0, tempList);
	}

	populatePropertyDisplayOrder(resource);

	print("And now for resource: "  + resource.name + " the property display order is: " + resource.propertyDisplayOrder);
	
	var resourceModel = convertToResourceModel(resource, resourceNameToResourceMap);
	resourceModel.setAppName(appName);
	resourceNameToResourceModelMap.put(resource.name, resourceModel);
}

print ("Fully populated Resource name to model map is: " + resourceNameToResourceModelMap);

var javaGenerator = new Packages.airlift.generator.JavaGenerator();
var appProfileString = javaGenerator.generateApplicationProfile(resourceNameToResourceModelMap);

print("Complete generation of Application Profile");
print(appProfileString);
writeAppProfile(appProfileString);

for (var resourceEntry in Iterator(resourceNameToResourceModelMap.entrySet()))
{
	var resourceName = resourceEntry.getKey();
	var resourceModel = resourceEntry.getValue();

	if (resourceModel.isAbstractResource() === false)
	{
		print ("Processing resource: " + resourceName);
		var javaScriptGenerator = new Packages.airlift.generator.JavaScriptGenerator();
		Packages.java.lang.System.out.println(resourceModel);
		var resourceMetaDataString = javaScriptGenerator.generateResourceMetadata(resourceModel);
		print(resourceMetaDataString);
		writeResourceMeta(resourceModel.getClassName(), resourceMetaDataString);
		var attributeMetadataString = javaScriptGenerator.generateAttributeMetadata(resourceModel);
		print(attributeMetadataString);
		writeAttributeMeta(resourceModel.getClassName(), attributeMetadataString);
	}
	else
	{
		print("Resource: " + resourceName + " is abstract and won't be generated.");
	}
}
