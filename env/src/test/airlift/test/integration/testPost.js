var util = require('airlift/util');
var assert = require('airlift/assert');

exports['testPOST'] = function(_assert)
{

    var tempString = Packages.java.lang.String("fullName=EEEEEE&emailAddress=emailTest%40gmail.com&mobilePhoneNumber=9999999999&password=AAAAAAAA");

        try {

	    var URL = Packages.java.net.URL;
            var theUrl = new URL("http://localhost:8080/a/registration");
            var connection = Packages.java.net.HttpURLConnection(theUrl.openConnection());
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");

            var OutputStreamWriter = Packages.java.io.OutputStreamWriter;
	    var writer = new OutputStreamWriter(connection.getOutputStream());
            writer.write(tempString);
	    writer.flush();
	    util.info('The HTTP response code is equal to: ' + connection.getResponseCode());
        } catch (e){
	     util.info('There was an error with testPost');
	   util.info(e.message, e.stack);
	}
 finally
    {
	(writer && writer.close());
    }
};
          