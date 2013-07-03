var util = require('airlift/util');
var assert = require('airlift/assert');

exports['testPUT'] = function(_assert)
{

    var tempString = Packages.java.lang.String("fullName=Sample&emailAddress=testEmail2%40dumbass.com&mobilePhoneNumber=1231231234&password=new1112d54");

        try {

	    var URL = Packages.java.net.URL;
            var theUrl = new URL("http://localhost:8080/a/registration/ca57430d87e2");
            var connection = Packages.java.net.HttpURLConnection(theUrl.openConnection());
            connection.setDoOutput(true);
            connection.setRequestMethod("PUT");
	    connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	    connection.connect();

            var OutputStreamWriter = Packages.java.io.OutputStreamWriter;
	    var writer = new OutputStreamWriter(connection.getOutputStream());
            writer.write(tempString);
	    writer.flush();
	    util.info('The HTTP response code is equal to: ' + connection.getResponseCode());
        } catch (e){
	     util.info('There was an error with testPUT');
	   util.info(e.message, e.stack);
	}
 finally
    {
	(writer && writer.close());
	
    }
};