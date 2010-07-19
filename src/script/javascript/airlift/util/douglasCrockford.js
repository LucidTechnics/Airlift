var airlift;

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

//redefine typeof
if (typeof Object.typeOf !== 'function')
{
	Object.typeOf = function(value) {
		var s = typeof value;
		if (s === 'object') {
			if (value) {
				if (typeof value.length === 'number' &&
					  !(value.propertyIsEnumerable('length')) &&
					  typeof value.splice === 'function') {
					s = 'array';
				}
			} else {
				s = 'null';
			}
		}
		return s;
	}
}

if (typeof Object.isEmpty !== 'function')
{
	Object.isEmpty = function(o) {
		var i, v;
		if (airlifttypeOf(o) === 'object') {
			for (i in o) {
				v = o[i];
				if (v !== undefined && airlifttypeOf(v) !== 'function') {
					return false;
				}
			}
		}
		return true;
	}
}

//This function makes strings replaces &, <, and > with the appropriate
//entities.  Great for XML and HTML embeddings.
String.prototype.entityify = function () {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

String.prototype.quote = function () {
	var c, i, l = this.length, o = '"';
	for (i = 0; i < l; i += 1) {
		c = this.charAt(i);
		if (c >= ' ') {
			if (c === '\\' || c === '"') {
				o += '\\';
			}
			o += c;
		} else {
			switch (c) {
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

String.prototype.supplant = function (o) {
	return this.replace(/{([^{}]*)}/g,
						function (a, b) {
		var r = o[b];
		return typeof r === 'string' || typeof r === 'number' ? r : a;
	}
	);
};

String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.replaceAll = function(_regex, _replacement) {
	return new Packages.java.lang.String(this).replaceAll(_regex, _replacement);
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

Object.prototype.m = function()
{
	var map = Packages.java.util.HashMap();
	var i, v;
	var o = this;

	for (i in o)
	{
		v = o[i];

		if (v !== undefined && airlifttypeOf(v) !== 'function')
		{
			map.put(i, v);
		}
		else if (v === undefined)
		{
			map.put(i, null);
		}
	}

	return map;
};