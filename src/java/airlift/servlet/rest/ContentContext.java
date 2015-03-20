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


package airlift.servlet.rest;

// TODO: Auto-generated Javadoc
/**
 * The Class ContentContext.
 */
public abstract class ContentContext
{
	
	/** The Constant JSON_TYPE. */
	public static final String JSON_TYPE = "application/json";
	
	/** The Constant HTML_TYPE. */
	public static final String HTML_TYPE = "text/html";
	
	/** The Constant XML_TYPE. */
	public static final String XML_TYPE = "application/xml";
	
	/** The Constant ATOM_TYPE. */
	public static final String ATOM_TYPE = "application/atom+xml";
	
	/** The Constant PDF_TYPE. */
	public static final String PDF_TYPE = "application/pdf";
	
	/** The Constant FORM_TYPE. */
	public static final String FORM_TYPE = "application/x-www-form-urlencoded";

	public static final String OCTET_STREAM_TYPE = "application/octet-stream";

	/** The redirect uri. */
	public String redirectUri;
	
	/** The header map. */
	public java.util.Map<String, java.util.List<String>> headerMap = new java.util.HashMap<String, java.util.List<String>>();

	public boolean streamed = false;
	
	/**
	 * Gets the redirect uri.
	 *
	 * @return the redirect uri
	 */
	public String getRedirectUri() { return redirectUri; }
	
	/**
	 * Gets the header map.
	 *
	 * @return the header map
	 */
	public java.util.Map<String, java.util.List<String>> getHeaderMap() { return headerMap; }
	
	/**
	 * Sets the redirect uri.
	 *
	 * @param _redirectUri the new redirect uri
	 */
	public void setRedirectUri(String _redirectUri) { redirectUri = _redirectUri; }
	
	/**
	 * Sets the header map.
	 *
	 * @param _headerMap the _header map
	 */
	public void setHeaderMap(java.util.Map<String, java.util.List<String>> _headerMap) { headerMap = _headerMap; }

	/**
	 * Gets the content.
	 *
	 * @return the content
	 */
	public abstract byte[] getContent();
	
	/**
	 * Sets the content.
	 *
	 * @param _content the new content
	 */
	public abstract void setContent(String _content);
	
	/**
	 * Sets the content.
	 *
	 * @param _content the new content
	 */
	public abstract void setContent(byte[] _content);

	/**
	 * Gets the type.
	 *
	 * @return the type
	 */
	public abstract String getType();
	
	/**
	 * Sets the type.
	 *
	 * @param _type the new type
	 */
	public abstract void setType(String _type);

	/**
	 * Gets the response code.
	 *
	 * @return the response code
	 */
	public abstract String getResponseCode();
	
	/**
	 * Sets the response code.
	 *
	 * @param _responseCode the new response code
	 */
	public abstract void setResponseCode(String _responseCode);

	/**
	 * Redirect.
	 *
	 * @param _uri the _uri
	 */
	public void redirect(String _uri)
	{
		setRedirectUri(_uri);
		setResponseCode("301");
	}

	public void redirect(String _uri, String _responseCode)
	{
	    setRedirectUri(_uri);
	    setResponseCode(_responseCode);
	}

	/**
	 * Checks if is redirect.
	 *
	 * @return true, if is redirect
	 */
	public boolean isRedirect()
	{
		return (getRedirectUri() != null);
	}

	/**
	 * Last modified.
	 *
	 * @param _lastModifiedDate the _last modified date
	 */
	public void lastModified(java.util.Date _lastModifiedDate)
	{
		addHeader("Last-Modified", airlift.util.FormatUtil.format(_lastModifiedDate, "EEE, d MMM yyyy HH:mm:ss") + " GMT");
	}

	/**
	 * Not cacheable.
	 */
	public void notCacheable()
	{
		//this says that the content is always expired.
		addHeader("Expires",  "Sat, 1 Jan 2005 00:00:00 GMT");
		//this says that the content can always be different.
		addHeader("Cache-Control", "no-cache, must-revalidate");
		//this says that the content should not be cached.
		addHeader("Pragma",  "no-cache");
	}

	public void setCacheable(Integer _seconds)
	{
		int seconds = 60 * 60 * 24 * 7;
		
		if (_seconds != null)
		{
			seconds = _seconds.intValue();
		}

		String cacheControl = "max-age=" + seconds + ", public, must-revalidate";
		
		addHeader("Cache-Control", cacheControl);
		addHeader("Vary", "Accept");
		addHeader("Vary", "Accept-Encoding");
	}

	/**
	 * Sets the download file.
	 *
	 * @param _downloadFileName the new download file
	 */
	public void setDownloadFile(String _downloadFileName)
	{
		addHeader("Content-Disposition", "attachment; filename=\"" + _downloadFileName + "\"");
	}

	public void isJson()
	{
		setType(JSON_TYPE);
	}

	public void isHtml()
	{
		setType(HTML_TYPE);
	}

	public void isXml()
	{
		setType(XML_TYPE);
	}
	
	public void isAtom()
	{
		setType(ATOM_TYPE);
	}

	public void isPdf()
	{
		setType(PDF_TYPE);
	}

	public void isOctetStream()
	{
		setType(OCTET_STREAM_TYPE);
	}

	/**
	 * Adds the header.
	 *
	 * @param _key the _key
	 * @param _value the _value
	 */
	public void addHeader(String _key, String _value)
	{
		java.util.List<String> headers = getHeaderMap().get(_key);

		if (headers == null)
		{
			headers = new java.util.ArrayList();
		}

		getHeaderMap().put(_key, headers);
		headers.add(_value);
	}

	public void addHeaders(String _key, java.util.List<String> _value)
	{
	    getHeaderMap().put(_key, _value);
	}

	/**
	 * Debug.
	 *
	 * @param _message the _message
	 */
	public abstract void debug(String _message);
}