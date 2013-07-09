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

exports.setUp = function()
{

    var tempString = Packages.java.lang.String("fullName=SamJones&emailAddress=emailTest%40gmail.com&mobilePhoneNumber=9999999999&password=AAAAAAAA");
var tempString2 = Packages.java.lang.String("fullName=AAAAAA&emailAddress=emailTest2%40yahoo.com&mobilePhoneNumber=9999999999&password=BBBBBBBB");
var tempString3 = Packages.java.lang.String("fullName=John&emailAddress=emailTest3%40aol.com&mobilePhoneNumber=0000000000&password=1222111222");
var tempString4 = Packages.java.lang.String("fullName=MIKE&emailAddress=myemail%40gmail.com&mobilePhoneNumber=3213213213&password=AAAAAAAA");

        try {

	    var URL = Packages.java.net.URL;
            var theUrl = new URL("http://localhost:8080/a/registration");
            var connection = Packages.java.net.HttpURLConnection(theUrl.openConnection());
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");

            var OutputStreamWriter = Packages.java.io.OutputStreamWriter;
	    var writer = new OutputStreamWriter(connection.getOutputStream());
	    var BufferedWriter = Packages.java.io.BufferedWriter;
	    var bwriter = new BufferedWriter(writer);
            bwriter.write(tempString3);
	    bwriter.flush();
	    util.info('SETUP: The HTTP response code is equal to: ' + connection.getResponseCode());
        } catch (e){
	     util.info('There was an error with setUp');
	   util.info(e.message, e.stack);
	}
 finally
    {
	(bwriter && bwriter.close());
	(writer && writer.close());
    }
};