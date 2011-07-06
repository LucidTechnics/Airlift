/*
 Copyright 2011, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/
package airlift.util;

import com.google.appengine.api.urlfetch.*;

import java.util.Map;
import java.util.logging.Logger;

/**
 * The Class Browser allows the creation of HTTP requests. It is built on top
 * of Google App Engine's API.
 * @see <a>http://code.google.com/appengine/docs/java/javadoc>Google AppEngine Java Doc</a>
 *
 */
public final class Browser
{
    
    /** The logger. */
    private static Logger log = Logger.getLogger(Browser.class.getName());

	/**
	 * Instantiates a new browser.
	 */
	public Browser() {}

	/**
	 * Executes an HTTP GET request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse executeRequest(String _url)
	{
		return executeRequest(_url, HTTPMethod.GET);
	}

	/**
	 * Execute an HTTP request given an HTTPMethod and URL.
	 *
	 * @param _url the _url
	 * @param _method the _method
	 * @return the hTTP response
	 */
	public HTTPResponse executeRequest(String _url, HTTPMethod _method)
	{
		return executeRequest(_url, _method, null);
	}

	/**
	 * Execute an HTTP request given an HTTPMethod, URL, and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _method the _method
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse executeRequest(String _url, HTTPMethod _method, Map<String, String> _parameterMap)
	{
		return executeRequest(_url, _method, _parameterMap, null);
	}

	/**
	 * Execute an HTTP request given an HTTPMethod, URL, Map of parameters, and Map of Headers.
	 *
	 * @param _url the _url
	 * @param _method the _method
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse executeRequest(String _url, HTTPMethod _method, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		HTTPRequest httpRequest = null;
		
		try
		{
			if (HTTPMethod.GET == _method)
			{
				_url = _url + createQueryString(_parameterMap);
			}

			httpRequest = new HTTPRequest(new java.net.URL(_url), _method);

			if (HTTPMethod.POST == _method || HTTPMethod.PUT == _method || HTTPMethod.DELETE == _method)
			{
				byte[] payload = createQueryString(_parameterMap).getBytes();
				if (payload != null && payload.length > 0) { httpRequest.setPayload(payload); }
			}

			addHeaders(httpRequest, _headerMap);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		HTTPResponse response = null;
		int tryCount = 0;
		Throwable throwable = null;
		boolean success = false;
		
		for (int i = 0; i < 2; i++)
		{
			log.info("Attempting to reach: " + _url + " after this many tries: " + tryCount);
			
			tryCount++;
			
			try
			{
				response = executeRequest(httpRequest);
				success = true;
			}
			catch(Throwable t)
			{
				throwable = t;
			}

			if (success == true)
			{
				break;
			}
		}

		if (success == false)
		{
			log.severe("Unable to reach: " + _url + " after this many tries: " + tryCount);
			log.severe("last error encountered was: " + throwable.getMessage());
		}

		return response;
	}

	/**
	 * Execute an HTTP request using a given com.google.appengine.api.fetc.HTTP
	 *
	 * @param _httpRequest the _http request
	 * @return the hTTP response
	 */
	public HTTPResponse executeRequest(HTTPRequest _httpRequest)
	{
		HTTPResponse httpResponse = null;
		
		try
		{
			httpResponse = URLFetchServiceFactory.getURLFetchService().fetch(_httpRequest);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return httpResponse;
	}

	/**
	 * Creates the query string for a HTTP request with a given Map of parameters.
	 *
	 * @param _parameterMap the _parameter map
	 * @return the string
	 */
	public String createQueryString(Map<String, String> _parameterMap)
	{
		StringBuffer queryString = new StringBuffer();

		if (_parameterMap != null  && _parameterMap.isEmpty() == false)
		{
			int count = 0;
			String prefix = "?";

			for (String name: _parameterMap.keySet())
			{
				count++;
				if (count > 1)	{ prefix = "&";	}
				queryString.append(prefix).append(name).append("=").append(_parameterMap.get(name));
			}
		}

		return queryString.toString();
	}

	/**
	 * Adds the headers to a given HTTPRequest object given a Map of headers.
	 *
	 * @param _httpRequest the _http request
	 * @param _headerMap the _header map
	 */
	public void addHeaders(HTTPRequest _httpRequest, Map<String, String> _headerMap)
	{
		if (_headerMap != null)
		{
			for (String name: _headerMap.keySet())
			{
				_httpRequest.addHeader(new HTTPHeader(name, _headerMap.get(name)));
			}
		}
	}

	/**
	 * Executes a HTTP GET request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse get(String _url)
	{
		return get(_url, null);
	}

	/**
	 * Executes a HTTP GET request for a given URL, and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse get(String _url, Map<String, String> _parameterMap)
	{
		return get(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP GET request for a given URL, Map of parameters, and Map of headers.
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse get(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.GET, _parameterMap, _headerMap);
	}

	/**
	 * Executes a HTTP POST request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse post(String _url)
	{
		return post(_url, null);
	}

	/**
	 * Executes a HTTP POST request for a given URL and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse post(String _url, Map<String, String> _parameterMap)
	{
		return post(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP POST request for a given URL, Map of parameters, and Map of headers.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse post(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.POST, _parameterMap, _headerMap);
	}

	/**
     * Executes a HTTP PUT request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse put(String _url)
	{
		return put(_url, null);
	}

	/**
     * Executes a HTTP PUT request for a given URL and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse put(String _url, Map<String, String> _parameterMap)
	{
		return put(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP PUT request for a given URL, Map of parameters, and Map of headers.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse put(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.PUT, _parameterMap, _headerMap);
	}

	/**
     * Executes a HTTP DELETE request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse delete(String _url)
	{
		return delete(_url, null);
	}

	/**
     * Executes a HTTP DELETE request for a given URL and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse delete(String _url, Map<String, String> _parameterMap)
	{
		return delete(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP DELETE request for a given URL and Map of parameters, and Map of headers.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse delete(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.DELETE, _parameterMap, _headerMap);
	}

	/**
     * Executes a HTTP HEAD request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse head(String _url)
	{
		return head(_url, null);
	}

	/**
     * Executes a HTTP HEAD request for a given URL and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse head(String _url, Map<String, String> _parameterMap)
	{
		return head(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP HEAD request for a given URL, Map of parameters, and Map of headers.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse head(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.HEAD, _parameterMap, _headerMap);
	}

	/**
     * Executes a HTTP OPTIONS request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse options(String _url)
	{
		return options(_url, null);
	}

	/**
     * Executes a HTTP OPTIONS request for a given URL and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse options(String _url, Map<String, String> _parameterMap)
	{
		return options(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP OPTIONS request for a given URL, Map of parameters, and Map of headers.
     * Note: The OPTIONS method is not supported by Google AppEngine and a RuntimeException is
     * thrown.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
     * @throws RuntimeException
	 */
	public HTTPResponse options(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		throw new RuntimeException("OPTIONS method is not supported by Google appEngine");
	}

	/**
     * Executes a HTTP TRACE request for a given URL.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse trace(String _url)
	{
		return trace(_url, null);
	}

	/**
     * Executes a HTTP TRACE request for a given URL and Map of parameters.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @return the hTTP response
	 */
	public HTTPResponse trace(String _url, Map<String, String> _parameterMap)
	{
		return trace(_url, _parameterMap, null);
	}

	/**
     * Executes a HTTP TRACE request for a given URL, Map of parameters, and Map of headers.
	 * Note: The OPTIONS method is not supported by Google AppEngine and a RuntimeException is
     * thrown.
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
     * @throws RuntimeException
	 */
	public HTTPResponse trace(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		throw new RuntimeException("TRACE method is not supported by Google appEngine");
	}

	/**
	 * HTML form encodes a given URI with a given encoding.
	 *
	 * @param _uri the _uri
	 * @param _encoding the _encoding
	 * @return the string
     * @see java.net.URLEncoder
	 */
	public String encode(String _uri, String _encoding)
	{
		String encode = _uri;
		
		try
		{
			encode = java.net.URLEncoder.encode(_uri, _encoding);
		}
		catch(Throwable t)
		{

			throw new RuntimeException(t);
		}

		return encode;
	}
}