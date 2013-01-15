var Reduce = function()
{
	this.reduce(_resource, _function, _filter)
	{
		var result;

		this.resource = _resource;
		this.resourceMeta = require(appName + '/meta/resource/' + _resource.__name);
		this.attributeMeta = require(appName + '/meta/attribute/' + _resource.__name);
		
		_resource.__filter = _resource.__filter||this.resourceMeta.filter;
		this.filter = _filter||_resource.__filter;

		_function.bind(this);
		
		filter.forEach(function(_attributeName, _index)
		{
			result = _function(_attributeName, result, _index); 
		});

		return result;
	};
};

exports.create = function()
{
	return new Reduce();
};