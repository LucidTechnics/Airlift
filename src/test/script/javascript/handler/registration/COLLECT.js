var print = function print(_message)
{
	Packages.java.lang.System.out.println(_message);
};

var util = require('airlift/util');

exports.handle = function(_web)
{
    var da = require('airlift/da/collect').create(_web);
    var listRegistration=da.collect(_web.getResourceName());
    var items = [];
    for(var item in Iterator(listRegistration))
	{
	    items.push(item);
	}
    _web.setContent(JSON.stringify(items));
};