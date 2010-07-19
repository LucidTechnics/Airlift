SCRIPTING.loadScript("/hannibal/util/validate.js");
SCRIPTING.loadScript("/javascript/hannibal/validation/domain/$className$Validator.js");

//$generatorComment$
//
for (name in Iterator(ACTIVE_RECORD.retrieveOrderedPropertyList()))
{
	var value = (PROPERTY_MAP.containsKey(name) === true) ? PROPERTY_MAP.get(name) : null;

	value = ((new Packages.java.lang.String()).equalsIgnoreCase(value) === true || value === null) ? "" : value;

	var validationFunction = "validate" + name.substring(0,1).toUpperCase() + name.substring(1);
	
	if ($className$Validator[validationFunction] != null && name.equalsIgnoreCase(ACTIVE_RECORD.retrievePrimaryKeyName()) === false)
	{
		var errorArray = $className$Validator[validationFunction]("" + value);
		var errorList = new Packages.java.util.ArrayList();

		if (errorArray.length > 0)
		{
			for (var i = 0, length = errorArray.length; i < length; ++i)
			{

				var error = errorArray[i];

				var hannibalError = new Packages.hannibal.ErrorImpl(error.name, error.category, error.message);
				
				errorList.add(hannibalError);
			}

			ERROR_MAP.put(name, errorList);
		}
	}
}