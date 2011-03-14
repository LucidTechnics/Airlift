package airlift.util;

import java.util.Map;
import java.util.logging.Logger;

import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

public final class Browser
{
    private static Logger log = Logger.getLogger(Browser.class.getName());

	public Browser() {}

	public HTTPResponse executeRequest(String _url)
	{
		return executeRequest(_url, HTTPMethod.GET);
	}

	public HTTPResponse executeRequest(String _url, HTTPMethod _method)
	{
		return executeRequest(_url, _method, null);
	}

	public HTTPResponse executeRequest(String _url, HTTPMethod _method, Map<String, String> _parameterMap)
	{
		return executeRequest(_url, _method, _parameterMap, null);
	}

	public HTTPResponse executeRequest(String _url, HTTPMethod _method, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		HTTPRequest httpRequest = null;
		
		try
		{
			if (HTTPMethod.GET == _method)
			{
				_url = _url + createQueryString(_parameterMap);

				if (log.isLoggable(java.util.logging.Level.INFO) == true)
				{
					log.info("The GET URI is: " + _url);
				}
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
		
		for (int i = 0; i < 10; i++)
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

	public String createQueryString(Map<String, String> _parameterMap)
	{
		StringBuffer queryString = new StringBuffer();

		if (_parameterMap != null)
		{
			int count = 0;
			String prefix = "?";

			for (String name: _parameterMap.keySet())
			{
				count++;
				if (count > 1)	{ prefix = "&";	}
				queryString.append(prefix).append(encode(name, "UTF-8")).append("=").append(encode(_parameterMap.get(name), "UTF-8"));
			}
		}

		if (log.isLoggable(java.util.logging.Level.INFO) == true)
		{
			log.info("The query string is: " + queryString.toString());
		}

		return queryString.toString();
	}

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

	public HTTPResponse get(String _url)
	{
		return get(_url, null);
	}

	public HTTPResponse get(String _url, Map<String, String> _parameterMap)
	{
		return get(_url, _parameterMap, null);
	}

	public HTTPResponse get(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.GET, _parameterMap, _headerMap);
	}

	public HTTPResponse post(String _url)
	{
		return post(_url, null);
	}

	public HTTPResponse post(String _url, Map<String, String> _parameterMap)
	{
		return post(_url, _parameterMap, null);
	}

	public HTTPResponse post(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.POST, _parameterMap, _headerMap);
	}

	public HTTPResponse put(String _url)
	{
		return put(_url, null);
	}

	public HTTPResponse put(String _url, Map<String, String> _parameterMap)
	{
		return put(_url, _parameterMap, null);
	}

	public HTTPResponse put(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.PUT, _parameterMap, _headerMap);
	}

	public HTTPResponse delete(String _url)
	{
		return delete(_url, null);
	}

	public HTTPResponse delete(String _url, Map<String, String> _parameterMap)
	{
		return delete(_url, _parameterMap, null);
	}

	public HTTPResponse delete(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.DELETE, _parameterMap, _headerMap);
	}

	public HTTPResponse head(String _url)
	{
		return head(_url, null);
	}

	public HTTPResponse head(String _url, Map<String, String> _parameterMap)
	{
		return head(_url, _parameterMap, null);
	}

	public HTTPResponse head(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		return executeRequest(_url, HTTPMethod.HEAD, _parameterMap, _headerMap);
	}

	public HTTPResponse options(String _url)
	{
		return options(_url, null);
	}

	public HTTPResponse options(String _url, Map<String, String> _parameterMap)
	{
		return options(_url, _parameterMap, null);
	}

	public HTTPResponse options(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		throw new RuntimeException("OPTIONS method is not supported by Google appEngine");
	}

	public HTTPResponse trace(String _url)
	{
		return trace(_url, null);
	}

	public HTTPResponse trace(String _url, Map<String, String> _parameterMap)
	{
		return trace(_url, _parameterMap, null);
	}

	public HTTPResponse trace(String _url, Map<String, String> _parameterMap, Map<String, String> _headerMap)
	{
		throw new RuntimeException("TRACE method is not supported by Google appEngine");
	}

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