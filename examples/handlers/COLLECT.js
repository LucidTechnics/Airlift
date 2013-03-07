var collection = require('airlift/collection');
var util = require('airlift/util');

exports.handle = function(_web)
{
	util.info("IN COLLECT HANDLER: " + Packages.java.lang.System.currentTimeMillis());
	
	var da = require('airlift/da/collect').create(_web);
	var res = require('airlift/resource').create(_web);

	util.info("START COLLECT: " + Packages.java.lang.System.currentTimeMillis());
	var persons = da.collect('person', {limit: 1000});

	util.info("START REDUCE: " + Packages.java.lang.System.currentTimeMillis());

	/*var personArray = [];
	for (var person in Iterator(persons))
	{
		personArray.push(person);
	}*/
	
	/*var content = collection.reduce(persons, function(_base, _value, _index)
	{
		var result = _base;

		if (_index > 0)
		{
			result += ',' +  res.json(_value);
		}
		else
		{
			result += res.json(_value);
		}
		
		return result;
	}, '[');*/

	var content = collection.reduce(persons, function(_base, _value, _index)
	{
		util.info("BEGIN SINGLE REDUCE: " + Packages.java.lang.System.currentTimeMillis());
		var base;

		if (_index > 0)
		{
			base = _base.append(',').append(res.json(_value));
		}
		else
		{
			base = _base.append(res.json(_value));
		}
		util.info("END SINGLE REDUCE: " + Packages.java.lang.System.currentTimeMillis());
		return base;
	}, new Packages.java.lang.StringBuffer('[')).toString();

	//var content = res.json(personArray); 

	util.info("END REDUCE: " + Packages.java.lang.System.currentTimeMillis());

	_web.setContent(content + "]");
	_web.setType('application/json');
	
	util.info("OUT COLLECT HANDLER: " + Packages.java.lang.System.currentTimeMillis());
};