var util = require('airlift/util');

exports.handle = function(_web)
{
    var da = require('airlift/da/get').create(_web);
    var registration=da.get(_web.getResourceName(), _web.getId());
    _web.setContent(JSON.stringify(registration));

};