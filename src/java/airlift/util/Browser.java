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

import java.util.Map;
import java.util.logging.Logger;

import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

// TODO: Auto-generated Javadoc
/**
 * The Class Browser.
 */
public final class Browser
{
    
    /** The log. */
    private static Logger log = Logger.getLogger(Browser.class.getName());

	/**
	 * Instantiates a new browser.
	 */
	public Browser() {}

	/**
	 * Execute request.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse executeRequest(String _url)
	{
		return executeRequest(_url, HTTPMethod.GET);
	}

	/**
	 * Execute request.
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
	 * Execute request.
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
	 * Execute request.
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
	 * Execute request.
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
	 * Creates the query string.
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
				//queryString.append(prefix).append(encode(name, "UTF-8")).append("=").append(encode(_parameterMap.get(name), "UTF-8"));
			}
		}

		return queryString.toString();
	}

	/**
	 * Adds the headers.
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
	 * Gets the.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse get(String _url)
	{
		return get(_url, null);
	}

	/**
	 * Gets the.
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
	 * Gets the.
	 *
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
	 * Post.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse post(String _url)
	{
		return post(_url, null);
	}

	/**
	 * Post.
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
	 * Post.
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
	 * Put.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse put(String _url)
	{
		return put(_url, null);
	}

	/**
	 * Put.
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
	 * Put.
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
	 * Delete.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse delete(String _url)
	{
		return delete(_url, null);
	}

	/**
	 * Delete.
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
	 * Delete.
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
	 * Head.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse head(String _url)
	{
		return head(_url, null);
	}

	/**
	 * Head.
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
	 * Head.
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
	 * Options.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse options(String _url)
	{
		return options(_url, null);
	}

	/**
	 * Options.
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
	 * Options.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse options(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		throw new RuntimeException("OPTIONS method is not supported by Google appEngine");
	}

	/**
	 * Trace.
	 *
	 * @param _url the _url
	 * @return the hTTP response
	 */
	public HTTPResponse trace(String _url)
	{
		return trace(_url, null);
	}

	/**
	 * Trace.
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
	 * Trace.
	 *
	 * @param _url the _url
	 * @param _parameterMap the _parameter map
	 * @param _headerMap the _header map
	 * @return the hTTP response
	 */
	public HTTPResponse trace(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		throw new RuntimeException("TRACE method is not supported by Google appEngine");
	}

	/**
	 * Encode.
	 *
	 * @param _uri the _uri
	 * @param _encoding the _encoding
	 * @return the string
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