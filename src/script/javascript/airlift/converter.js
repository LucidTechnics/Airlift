var func = require('./func');
var util = require('./util');

var convertUtil = Packages.org.apache.commons.beanutils.ConvertUtils;
var formatUtil = Packages.airlift.util.FormatUtil;

exports.convert = function(_resourceName)
{
	var restContext = this.WEB_CONTEXT.REST_CONTEXT;
	var request = this.WEB_CONTEXT.REQUEST;
	var attributesMetaData = require('meta/a/' + _resourceName).create().attributes;
	var error = {};
	
	var resource = func.map(_resourceName, null, function(_value, _attributeName, _resource)
	{
		try
		{
			var value;
			var type = attributesMetaData[_attributeName].type;
			var mapTo = attributesMetaData[_attributeName].mapTo;

			var parameterValue = request.getParameterValues(_attributeName);

			if ("java.util.Set".equalsIgnoreCase(type) === false &&
				  "java.util.HashSet".equalsIgnoreCase(type) === false &&
				  "java.util.List".equalsIgnoreCase(type) === false &&
				  "java.util.ArrayList".equalsIgnoreCase(type) === false
			   )
			{
				value = parameterValue && (util.isWhitespace(parameterValue) === false) && util.trim(parameterValue[0]) || null;
				value = formatUtil.format(convertUtil.convert(value, util.createClass(type)));

				if (value && "java.lang.Boolean".equalsIgnoreCase(type) === true)
				{
					value = value.booleanValue();
				}
			}
			else
			{
				if ("java.util.Set".equalsIgnoreCase(type) === true &&
					  "java.util.HashSet".equalsIgnoreCase(type) === true)
				{
					value = new Packages.java.util.HashSet();
				}
				else if ("java.util.List".equalsIgnoreCase(type) === true &&
						 "java.util.ArrayList".equalsIgnoreCase(type) === true)
				{
					value = new Packages.java.util.ArrayList();
				}

				if (parameterValue)
				{
					var length = parameterValue.length;

					for (var i = 0; i < length; i++)
					{
						var item = parameterValue[i];
						item = item && (util.isWhitespace(item) === false) && util.trim(item) || null;
						value.add(formatUtil.format(convertUtil.convert(item, util.createClass("java.lang.String"))));
					}
				}
			}
		}
		catch(e)
		{
			error[_attributeName] = util.createError(_attributeName, e.javaException.getMessage(), "conversion");
		}

		if (util.isWhitespace(mapTo) === true)
		{
			value = value || restContext.getParameter(_attributeName.replace('id$', '.id'));
		}
		
		return value;
	});

	return { resource: resource, error: error};
};