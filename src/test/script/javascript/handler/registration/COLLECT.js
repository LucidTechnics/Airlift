var util = require('airlift/util');

exports.handle = function(_web)
{
    var da = require('airlift/da/collect').create(_web);
    var listRegistration=da.collect(_web.getResourceName());
    var string='';
    for(var item in Iterator(listRegistration))
	{
	   string += JSON.stringify(item);
	}
    _web.setContent(string);
};