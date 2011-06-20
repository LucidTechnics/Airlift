//This file started out as a file for augmenting JavaScript objects
//with methods suggested by Mr. Crockford.  Now we add anything along
//those lines to this file.
function typeOf(value)
{
	var s = typeof value;

	if (s === 'object')
	{
		if (value)
		{
			if (typeof value.length === 'number' &&
				  !(value.propertyIsEnumerable('length')) &&
				  typeof value.splice === 'function')
			{
				s = 'array';
			}
		}
		else
		{
			s = 'null';
		}
	}
	
	return s;
}

function isEmpty(o)
{
	var i, v;
	if (typeOf(o) === 'object')
	{
		for (i in o)
		{
			v = o[i];
			if (v !== undefined && typeOf(v) !== 'function')
			{
				return false;
			}
		}
	}
	
	return true;
}

String.prototype.quote = function ()
{
	var c, i, l = this.length, o = '"';
	for (i = 0; i < l; i += 1)
	{
		c = this.charAt(i);
		if (c >= ' ')
		{
			if (c === '\\' || c === '"')
			{
				o += '\\';
			}
			o += c;
		}
		else
		{
			switch (c)
			{
				case '\b':
					o += '\\b';
					break;
				case '\f':
					o += '\\f';
					break;
				case '\n':
					o += '\\n';
					break;
				case '\r':
					o += '\\r';
					break;
				case '\t':
					o += '\\t';
					break;
				default:
					c = c.charCodeAt();
					o += '\\u00' + Math.floor(c / 16).toString(16) +
						 (c % 16).toString(16);
			}
		}
	}
	return o + '"';
};

String.prototype.supplant = function (o)
{
	return this.replace(/{([^{}]*)}/g,
		function (a, b)
		{
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};

String.prototype.trim = function ()
{
	return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.replaceAll = function(_regex, _replacement)
{
	//I really want these to work regardless of JavaScript String or
	//java.lang.String .. technically we could actually implement these
	//methods in Javascript, but I am not sure that would actually
	//accomplish anything performance wise ...

	return new Packages.java.lang.String(this).replaceAll(_regex, _replacement);
};

String.prototype.equalsIgnoreCase = function(_string)
{
	return new Packages.java.lang.String(this).equalsIgnoreCase(_string);
};

if (typeof Object.beget !== 'function')
{
	Object.beget = function(_prototype)
	{
		var F = function () {};
		F.prototype = _prototype;

		return new F();
	};
}