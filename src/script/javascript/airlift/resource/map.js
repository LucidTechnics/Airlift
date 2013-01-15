var Map = function()
{
	this.map(_resource, _function, _filter)
	{
		var result = {};
		
		_function.bind(this);
		this.resource = _resource;
		this.resourceMeta = require(appName + '/meta/resource/' + _resource.__name);
		this.attributeMeta = require(appName + '/meta/attribute/' + _resource.__name);
		
		_resource.__filter = _resource.__filter||this.resourceMeta.filter;
		var filter = _filter||_resource.__filter;

		filter.forEach(function(_attributeName)
		{
			result[_attributeName] = _function(_attributeName); 
		});

		return result;
	};
};

exports.create = function()
{
	return new Map();
};