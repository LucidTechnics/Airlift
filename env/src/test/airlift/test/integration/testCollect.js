var util = require('airlift/util');
var assert = require('airlift/assert');

exports['testCOLLECT'] = function(_assert)
{
        try {
	    var sleeper = Packages.java.lang.Thread.sleep(1000);
	    var url = new Packages.java.net.URL("http://localhost:8080/a/registration/"); //Insert the URL
	    var Stream = url.openStream();
	    var InputStreamReader = new Packages.java.io.InputStreamReader(Stream);
	    var reader = new Packages.java.io.BufferedReader(InputStreamReader);
            var line = new Packages.java.lang.String();
            while ((line = reader.readLine()) != null) {
               Packages.java.lang.System.out.println('HTTP RESPONSE: ' + line); //Prints to console by default
            }  
	}
    catch (e) {
	util.info('There was an error with testCOLLECT');
	util.info(e.message, e.stack);
        }
   finally
    {
	reader && reader.close();
    }
};