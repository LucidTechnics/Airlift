if (!Array.prototype.forEach) 
{
	Array.prototype.forEach = function(_fn, _scope)
	{
		for (var i = 0, len = this.length; i < len; ++i) 
		{
			_fn.call(_scope, this[i], i, this);
		}
	}
}

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
};

rule.displayLength = function()
{
	this.presentable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
};

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
		type = "bytes";
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
};

rule.maxLength = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
};

rule.searchable = function()
{
	this.persistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());
};

rule.indexable = function()
{
	this.persistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
};

rule.maximumLength = function()
{
	this.maxLength();
};

rule.minLength = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
};

rule.minimumLength = function()
{
	this.minLength();
};

rule.biggerThan = function()
{
	this.persistable.addParameterValue("minValue", quoteString(this.value));
};

rule.biggerThanOrEqualTo = function()
{
	this.biggerThan();
};

rule.greaterThan = function()
{
	this.biggerThan();
};

rule.lessThan = function()
{
	this.persistable.addParameterValue("maxValue", quoteString(this.value));
};

rule.greaterThanOrEqualTo = function()
{
	this.biggerThan();
};

rule.lessThanOrEqualTo = function()
{
	this.lessThan();
};

rule.smallerThan = function()
{
	this.lessThan();
};

rule.smallerThanOrEqualTo = function()
{
	this.lessThan();
};

rule.regexFormat = function()
{
	this.presentable.addParameterValue("hasFormat", this.value);
};

rule.calendarFormat = function()
{
	this.presentable.addParameterValue("dateTimePattern", this.value);
};

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
};

rule.required = function()
{
	this.persistable.addParameterValue("required", new Packages.java.lang.Boolean(true).booleanValue());
};

rule.notRequired = function()
{
	this.persistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
};

rule.isNotRequired = function()
{
	this.notRequired();
};

rule.immutable = function(_value)
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Boolean(true).booleanValue());
};

rule.notImmutable = function()
{
	this.persistable.addParameterValue("immutable", new Packages.java.lang.Boolean(false).booleanValue());
};

rule.precision = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
};

rule.scale = function(_value)
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Integer(this.value).intValue());
};

rule.plural = function()
{
	this.presentable.addParameterValue("pluralLabel", quoteString(this.value));
};

rule.pluralSpelling = function()
{
	this.presentable.addParameterValue("pluralLabel", quoteString(this.value));
};

rule.pluralLabel = function()
{
	this.presentable.addParameterValue("pluralLabel", quoteString(this.value));
};

rule.label = function()
{
	var label = this.value.toLowerCase();

	if (label.equalsIgnoreCase(this.value) === false)
	{
		label = Packages.org.apache.commons.lang.WordUtils.capitalizeFully(label);
	}

	this.presentable.addParameterValue("label", quoteString(label.replaceAll("\"", "")));
};

rule.readOnly = function()
{
	this.presentable.addParameterValue(this.airliftName, new Packages.java.lang.Boolean(true).booleanValue());
};

rule.encrypted = function()
{
	this.persistable.addParameterValue(this.airliftName, new Packages.java.lang.Boolean(true).booleanValue());
};

rule.notEncrypted = function()
{
	this.persistable.addParameterValue("encrypted", new Packages.java.lang.Boolean(false).booleanValue());
};

rule.hidden = function()
{
	this.presentable.addParameterValue("inputType", "HIDDEN");
};

rule.password = function()
{
	this.presentable.addParameterValue("inputType", "PASSWORD");
};

rule.mapTo = function()
{
	if ("mapToMany".equalsIgnoreCase(this.airliftName) === true)
	{
		this.persistable.addParameterValue("mapToMany", (this.value && quoteString(this.value.toLowerCase())) || '');
	}
	else
	{
		this.persistable.addParameterValue("mapTo", (this.value && quoteString(this.value.toLowerCase())) || '');
	}
};

rule.primaryKey = function()
{
	this.persistable.addParameterValue("isPrimaryKey", new Packages.java.lang.Boolean(true).booleanValue());
};

rule.widgetTextfield = function()
{
	this.presentable.addParameterValue("inputType", "TEXT");
};

rule.widgetTextarea = function()
{
	this.presentable.addParameterValue("inputType", "TEXTAREA");
};

rule.widgetText = function()
{
	this.widgetTextfield();
};

rule.widgetTextField = function()
{
	this.widgetTextfield();
};

rule.widgetTextArea = function()
{
	this.widgetTextarea();
};

rule.widgetSelect = function()
{
	this.presentable.addParameterValue("inputType", "SELECT");
};

rule.widgetMultipleSelect = function()
{
	this.presentable.addParameterValue("inputType", "MULTISELECT");
};

rule.widgetRadio = function()
{
	this.presentable.addParameterValue("inputType", "RADIO");
};

rule.widgetCheckbox = function()
{
	this.presentable.addParameterValue("inputType", "CHECKBOX");
};

rule.widgetCheckBox = function()
{
	this.widgetCheckbox();
};

rule.widgetCheck = function()
{
	this.widgetCheckbox();
};

rule.present = function(_dictationResource)
{
	var presentable = Packages.airlift.generator.Annotation();
	presentable.name = "presentable";

	this.resourceModel.getResourceAnnotationMap().put(presentable.name, presentable);
};

rule.persist = function(_dictationResource)
{
	var persistable = Packages.airlift.generator.Annotation();
	persistable.name = "persistable";

	this.resourceModel.getResourceAnnotationMap().put(persistable.name, persistable);
};

rule.cache = function(_dictationResource)
{
	var cacheable = Packages.airlift.generator.Annotation();
	cacheable.name = "cacheable";
	
	this.resourceModel.getResourceAnnotationMap().put(cacheable.name, cacheable);
};

rule.audit = function(_dictationResource)
{
	var auditable = Packages.airlift.generator.Annotation();
	auditable.name = "auditable";

	this.resourceModel.getResourceAnnotationMap().put(auditable.name, auditable);
};

rule.view = function(_dictationResource)
{
	var viewable = Packages.airlift.generator.Annotation();
	viewable.name = "viewable";

	this.resourceModel.getResourceAnnotationMap().put(viewable.name, viewable);
	this.resourceModel.setLookingAt(join(_dictationResource.viewDomainList.get(0), convertToClassName).toLowerCase());
};

rule.propertyGroup = function(_dictationResource)
{
	this.presentable.addParameterValue("fieldSetName", quoteString(this.value));
};

rule.secure = function(_dictationResource)
{
	var securable = Packages.airlift.generator.Annotation();
	securable.name = "securable";

	var securityMap = new Packages.java.util.HashMap();

	var securityListIterator = _dictationResource.securityList.iterator();
	
	while (securityListIterator.hasNext() === true)
	{
		var security = securityListIterator.next();
		if (securityMap.containsKey(security.action) === false) { securityMap.put(security.action, ""); }

		var securityRoleList = securityMap.get(security.action);
		securityRoleList += security.role + new Packages.java.lang.String(",");
		securityMap.put(security.action, securityRoleList);
	}

	var securityEntryIterator = securityMap.entrySet().iterator();
	
	while (securityEntryIterator.hasNext() === true)
	{
		var securityEntry = securityEntryIterator.next();
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

	this.resourceModel.getResourceAnnotationMap().put(securable.name, securable);
};

function quoteString(_string)
{
	var string = new Packages.java.lang.String(_string);
	
	if (string.startsWith("\"") === true && string.endsWith("\"") === true)
	{
		string = string.substring(1, string.length() - 1);
	}
			
	return "\"" + string + "\"";
}

function determinePropertySetMapping(_dictationResource, _dictationResourceMap)
{
	var propertyNameToPropertyMap = new Packages.java.util.HashMap();
	var orderedPropertyList = new Packages.java.util.ArrayList();

	var likeDomainListIterator = _dictationResource.likeDomainList.iterator();
	while (likeDomainListIterator.hasNext() === true)
	{
		var likeResourceName = likeDomainListIterator.next();
		var likeResource = _dictationResourceMap.get(likeResourceName);

		if (likeResource)
		{
			var propertySetMapping = determinePropertySetMapping(likeResource, _dictationResourceMap);

			var orderedPropertyListIterator = orderedPropertyList.iterator();
			while (orderedPropertyListIterator.hasNext() === true)
			{
				var orderedProperty = orderedPropertyListIterator.next();
				var indexOfOrderedProperty = propertySetMapping.orderedPropertyList.indexOf(orderedProperty);

				if (indexOfOrderedProperty > -1)
				{
					propertySetMapping.orderedPropertyList.remove(indexOfOrderedProperty);
					propertySetMapping.propertyMap.remove(orderedProperty);
				}
			}

			orderedPropertyList.addAll(propertySetMapping.orderedPropertyList);
			propertyNameToPropertyMap.putAll(propertySetMapping.propertyMap);
		}
	}

	var viewDomainListIterator = _dictationResource.viewDomainList.iterator();
	while (viewDomainListIterator.hasNext() === true)
	{
		var viewResourceName = viewDomainListIterator.next();
		var viewResource = _dictationResourceMap.get(viewResourceName);

		if (viewResource)
		{
			var propertySetMapping = determinePropertySetMapping(viewResource, _dictationResourceMap);
			
			var orderedPropertyListIterator = orderedPropertyList.iterator();
			while (orderedPropertyListIterator.hasNext() === true)
			{
				var orderedProperty = orderedPropertyListIterator.next();
				var indexOfOrderedProperty = propertySetMapping.indexOf(orderedProperty);

				if (indexOfOrderedProperty > -1)
				{
					propertySetMapping.orderedPropertyList.remove(indexOfOrderedProperty);
					propertySetMapping.propertyMap.remove(orderedProperty);
				}
			}

			orderedPropertyList.addAll(propertySetMapping.orderedPropertyList);
			propertyNameToPropertyMap.putAll(propertySetMapping.propertyMap);
		}
	}

	var propertyNameListIterator = _dictationResource.propertyNameList.iterator();
	while (propertyNameListIterator.hasNext() == true)
	{
		var parsedPropertyName = propertyNameListIterator.next();
		orderedPropertyList.add(parsedPropertyName);
		propertyNameToPropertyMap.put(parsedPropertyName, _dictationResource.propertyMap.get(parsedPropertyName));
	}

	return {orderedPropertyList: orderedPropertyList, propertyMap: propertyNameToPropertyMap};
}

function determineRelationshipSetMapping(_dictationResource, _dictationResourceMap)
{
	var relationshipNameToPropertyMap = new Packages.java.util.HashMap();
	var orderedRelationshipList = new Packages.java.util.ArrayList();

	var likeDomainListIterator = _dictationResource.likeDomainList.iterator();
	while (likeDomainListIterator.hasNext() === true)
	{
		var likeResourceName = likeDomainListIterator.next();
		var likeResource = _dictationResourceMap.get(likeResourceName);

		if (likeResource)
		{
			var relationshipMapping = determineRelationshipSetMapping(likeResource, _dictationResourceMap);
			orderedRelationshipList.addAll(relationshipMapping.orderedRelationshipList);
			relationshipNameToPropertyMap.putAll(relationshipMapping.relationshipNameToPropertyMap);
		}
	}

	var viewDomainListIterator = _dictationResource.viewDomainList.iterator();
	while (viewDomainListIterator.hasNext() === true)
	{
		var viewResourceName = viewDomainListIterator.next();
		var viewResource = _dictationResourceMap.get(viewResourceName);

		if (viewResource)
		{
			var relationshipMapping = determineRelationshipSetMapping(viewResource, _dictationResourceMap);
			orderedRelationshipList.addAll(relationshipMapping.orderedRelationshipList);
			relationshipNameToPropertyMap.putAll(relationshipMapping.relationshipNameToPropertyMap);
		}
	}

	var relationshipMapEntrySetIterator = _dictationResource.relationshipMap.entrySet().iterator();
	while (relationshipMapEntrySetIterator.hasNext() === true)
	{
		var relationshipMapEntry = relationshipMapEntrySetIterator.next();
		var relationshipName = relationshipMapEntry.getKey();
		var relationships = relationshipMapEntry.getValue();

		orderedRelationshipList.add(relationshipName);
		relationshipNameToPropertyMap.put(relationshipName, relationships);
	}

	return {orderedRelationshipList: orderedRelationshipList, relationshipNameToPropertyMap: relationshipNameToPropertyMap};
}

function determineDisplayOrder(_resourceName, _propertyName, _propertyDisplayOrder)
{
	var displayOrder = 10000;
	var attributeIndex = 0;
	
	for (var i = 0; _propertyDisplayOrder && i < _propertyDisplayOrder.size(); i++)
	{
		if (!_propertyName)
		{
			throw 'Unable to process property in resource: ' + _resourceName + ". Perhaps it needs to be quoted?";
		}
		
		if (_propertyName.equalsIgnoreCase(_propertyDisplayOrder.get(i)) === true)
		{
			attributeIndex = i;
			displayOrder = (i * 10) + 10;
		}
	}
	
	return {attributeIndex: attributeIndex, displayOrder: displayOrder};
}

function convertToResourceModel(_dictationResource, _dictationResourceMap)
{
	var resourceModel = new Packages.airlift.generator.ResourceModel();

	resourceModel.setPackageName(_dictationResource.packageName);
	resourceModel.setRootPackageName(_dictationResource.packageName);
	resourceModel.setBuildPackageName(_dictationResource.packageName);
	resourceModel.setClassName(join(_dictationResource.name, convertToClassName));
	resourceModel.setIsAbstract(_dictationResource.isAbstract);
	resourceModel.setIsView(_dictationResource.isView);
	resourceModel.setIsReferenced(_dictationResource.isReferenced);
	resourceModel.setIsAudited(_dictationResource.isAudited);

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

	if (resourceModel.isViewResource() === true)
	{
		rule.view(_dictationResource);
	}

	rule.present(_dictationResource);
	rule.persist(_dictationResource);

	//Determine this resource full property set mapping
	var propertyMapping = determinePropertySetMapping(_dictationResource, _dictationResourceMap);
	var orderedPropertyList = propertyMapping.orderedPropertyList;
	var propertyNameToPropertyMap = propertyMapping.propertyMap;
	
	//Properties
	var orderedPropertyListIterator = orderedPropertyList.iterator();
	while (orderedPropertyListIterator.hasNext() === true)
	{
		var propertyName = orderedPropertyListIterator.next();
		var key = propertyName;
		var value = propertyNameToPropertyMap.get(propertyName);

		var persistable = Packages.airlift.generator.Annotation();
		persistable.name = "persistable";

		var presentable = Packages.airlift.generator.Annotation();
		presentable.name = "presentable";
		var displayResult = determineDisplayOrder(_dictationResource.name, propertyName, _dictationResource.propertyDisplayOrder);
		var attributeIndex = displayResult.attributeIndex;
		var displayOrder = displayResult.displayOrder;
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

		var propertyAnnotationMapEntrySetIterator = property.annotationMap.entrySet().iterator();
		while (propertyAnnotationMapEntrySetIterator.hasNext() === true)
		{
			var annotationEntry = propertyAnnotationMapEntrySetIterator.next();
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
				print("WARNING ... No rule defined for annotation named: " + annotationName);
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
	postDatePersistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
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
	putDatePersistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
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
	auditUserPersistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
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
	auditUserPersistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
	auditUserPersistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());
	auditUserPersistable.addParameterValue("isSearchable", new Packages.java.lang.Boolean(true).booleanValue());

	var auditUserPresentable = Packages.airlift.generator.Annotation();
	auditUserPresentable.name = "presentable";
	auditUserPresentable.addParameterValue("isPresentable", "false");
	auditUserPresentable.addParameterValue("label", "\"web request id\"");

	resourceModel.addAnnotation(auditUserAttribute, auditUserPersistable);
	resourceModel.addAnnotation(auditUserAttribute, auditUserPresentable);

	var relationshipMapping = determineRelationshipSetMapping(_dictationResource, _dictationResourceMap);
	var orderedRelationshipList = relationshipMapping.orderedRelationshipList;
	var relationshipNameToRelationshipMap = relationshipMapping.relationshipNameToPropertyMap;
	//Foreign Keys

	var orderedRelationshipListIterator = orderedRelationshipList.iterator();
	while (orderedRelationshipListIterator.hasNext() === true)
	{
		var relationshipName = orderedRelationshipListIterator.next();
		var key = relationshipName;
		var relationships = relationshipNameToRelationshipMap.get(relationshipName);

		var relationshipsIterator = relationships.iterator();
		while (relationshipsIterator.hasNext() === true)
		{
			var value = relationshipsIterator.next();
			var persistable = Packages.airlift.generator.Annotation();
			persistable.name = "persistable";
			persistable.addParameterValue("isIndexable", new Packages.java.lang.Boolean(true).booleanValue());

			var presentable = Packages.airlift.generator.Annotation();
			presentable.name = "presentable";
			var displayResult = determineDisplayOrder(_dictationResource.name, relationshipName, _dictationResource.propertyDisplayOrder);
			var attributeIndex = displayResult.attributeIndex;
			var relationshipDisplayOrder = displayResult.displayOrder;
			presentable.addParameterValue("displayOrder", new java.lang.Integer(relationshipDisplayOrder));

			var relationship = value;

			var labelCandidate = relationship.annotationMap.get("label"), parsedRelationshipName;

			if (labelCandidate)
			{
				parsedRelationshipName = join(labelCandidate, convertToParameterName);
				relationship.annotationMap.put("label", labelCandidate);
			}
			else
			{		
				parsedRelationshipName = join(relationship.targetDomain, convertToParameterName);
				relationship.annotationMap.put("label", relationship.targetDomain);
			}

			var targetName = join(relationship.targetDomain, convertToClassName);

			var attribute = new Packages.airlift.generator.Attribute();

			attribute.setName(parsedRelationshipName);

			if ("many".equalsIgnoreCase(relationship.type) === true)
			{
				attribute.setType("java.util.ArrayList");
			}
			else
			{
				attribute.setType("java.lang.String");
			}

			rule.attribute = attribute;
			rule.presentable = presentable;
			rule.persistable = persistable;
			rule.propertyAnnotationMap = relationship.annotationMap;

			var relationshipAnnotationMapEntrySetIterator = relationship.annotationMap.entrySet().iterator();
			while (relationshipAnnotationMapEntrySetIterator.hasNext() === true)
			{
				var annotationEntry = relationshipAnnotationMapEntrySetIterator.next();
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
					print("WARNING ... No rule defined for annotation named: " + annotationName);
				}
			}

			if ("many".equalsIgnoreCase(relationship.type) === true)
			{
				rule.airliftName = "mapToMany";
			}
			else
			{
				rule.airliftName = "mapTo";
			}
			
			rule.value = targetName;
			rule.mapTo();

			resourceModel.addAnnotation(rule.attribute, attributeIndex, rule.persistable);
			resourceModel.addAnnotation(rule.attribute, attributeIndex, rule.presentable);
		}
	}

	//Primary Key
	var persistable = Packages.airlift.generator.Annotation();
	persistable.name = "persistable";
	persistable.addParameterValue("required", new Packages.java.lang.Boolean(false).booleanValue());
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
	var newResource = _parser.createResource();
	
	newResource.name = "New " + _resource.name;
	newResource.packageName = resource.packageName;
	newResource.isView = false;
	newResource.isAbstract = false;
	newResource.isReference = false;

	var securityListIterator = _resource.securityList.iterator();
	
	while (securityListIterator.hasNext() === true)
	{
		var security = securityListIterator.next();
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
var dictationFile = project.getProperty("src.doc") + fileSeparator + 'app.dic';
var appName = project.getProperty("appName");

var dictationLexer = new com.lucidlabs.dsl.dictation.DictationLexer(new ANTLRFileStream(dictationFile, "UTF8"));
var tokens = new CommonTokenStream(dictationLexer);
var dictationParser = new com.lucidlabs.dsl.dictation.DictationParser(tokens);

print ("Starting parsing");
dictationParser.business();
print ("Parsing completed");

var resourceNameToResourceMap = new Packages.java.util.HashMap();
var resourceNameToResourceModelMap = new Packages.java.util.HashMap();
var newResourceNameToResourceModelMap = new Packages.java.util.HashMap();

var domainListIterator = dictationParser.domainList.iterator();
while (domainListIterator.hasNext() === true)
{
	var resource = domainListIterator.next();
	resourceNameToResourceMap.put(resource.name, resource);
}

var resourceNameToResourceMapEntrySetIterator = resourceNameToResourceMap.entrySet().iterator();
while (resourceNameToResourceMapEntrySetIterator.hasNext() === true)
{
	var resourceEntry = resourceNameToResourceMapEntrySetIterator.next();
	var resourceName = resourceEntry.getKey();
	var resource = resourceEntry.getValue();
	
	function populatePropertyDisplayOrder(_resource)
	{
		var likeResourceList = _resource.likeDomainList;
		var tempList = new Packages.java.util.ArrayList();

		var likeResourceListIterator = likeResourceList.iterator();
		
		while (likeResourceListIterator.hasNext() === true)
		{
			var likeResourceName = likeResourceListIterator.next();
			var likeResource = resourceNameToResourceMap.get(likeResourceName);

			if (likeResource === null || likeResource === undefined) { print("ERROR!!! Unable to find resource named: " + likeResourceName); }
			
			tempList.addAll(likeResource.propertyDisplayOrder);
		}

		var viewResourceList = _resource.viewDomainList;
		var tempList = new Packages.java.util.ArrayList();

		var viewResourceListIterator = viewResourceList.iterator();

		while (viewResourceListIterator.hasNext() === true)
		{
			var viewResourceName = viewResourceListIterator.next();
			var viewResource = resourceNameToResourceMap.get(viewResourceName);

			if (viewResource === null || viewResource === undefined) { print("ERROR!!! Unable to find resource named: " + viewResourceName); }

			tempList.addAll(viewResource.propertyDisplayOrder);
		}

		_resource.propertyDisplayOrder.addAll(0, tempList);
	}

	populatePropertyDisplayOrder(resource);

	var resourceModel = convertToResourceModel(resource, resourceNameToResourceMap);
	resourceModel.setAppName(appName);
	resourceNameToResourceModelMap.put(resource.name, resourceModel);
}

var javaGenerator = new Packages.airlift.generator.JavaGenerator();
var appProfileString = javaGenerator.generateApplicationProfile(resourceNameToResourceModelMap);

writeAppProfile(appProfileString);

var resourceNameToResourceModelMapEntrySetIterator = resourceNameToResourceModelMap.entrySet().iterator();

while (resourceNameToResourceModelMapEntrySetIterator.hasNext() === true)
{
	var resourceEntry = resourceNameToResourceModelMapEntrySetIterator.next();
	var resourceName = resourceEntry.getKey();
	var resourceModel = resourceEntry.getValue();

	if (resourceModel.isAbstractResource() === false)
	{
		var javaScriptGenerator = new Packages.airlift.generator.JavaScriptGenerator();
		var resourceMetaDataString = javaScriptGenerator.generateResourceMetadata(resourceModel);
		print('');
		print('**************************************************************************');
		print(resourceModel.getClassName().toUpperCase() + ' resource meta data ...');
		print('--------------------------------------------------------------------------');
		print(resourceMetaDataString);
		writeResourceMeta(resourceModel.getClassName(), resourceMetaDataString);
		var attributeMetadataString = javaScriptGenerator.generateAttributeMetadata(resourceModel);
		print('');
		print(resourceModel.getClassName().toUpperCase() + ' attributes meta data ...');
		print('--------------------------------------------------------------------------');
		print(attributeMetadataString);
		writeAttributeMeta(resourceModel.getClassName(), attributeMetadataString);
	}
	else
	{
		print("Resource: " + resourceName + " is abstract and won't be generated.");
	}
}
