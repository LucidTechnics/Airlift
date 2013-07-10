var util = require('airlift/util');

exports.handle = function(_web)
{
    var da = require('airlift/da/delete').create(_web);
    da.delete(_web.getResourceName(), _web.getId());

};