var util = require('airlift/util');
var assert = require('airlift/assert');

exports['testDELETE'] = function(_assert)
{

        try {
	    
	    var URL = Packages.java.net.URL;
            var theUrl = new URL("http://localhost:8080/a/registration/63dde05dd20b");
            var connection = Packages.java.net.HttpURLConnection(theUrl.openConnection());
            connection.setDoOutput(true);
            connection.setRequestMethod("DELETE");
	    connection.connect();

	    util.info('The HTTP response code is equal to: ' + connection.getResponseCode());
        } catch (e){
	     util.info('There was an error with testDELETE');
	   util.info(e.message, e.stack);
	}
};