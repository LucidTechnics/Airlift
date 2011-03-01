/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/


package airlift.servlet.rest;

public abstract class ContentContext
{
	public static final String JSON_TYPE = "application/json";
	public static final String HTML_TYPE = "text/html";
	public static final String XML_TYPE = "application/xml";
	public static final String ATOM_TYPE = "application/atom+xml";
	public static final String PDF_TYPE = "application/pdf";
	public static final String FORM_TYPE = "application/x-www-form-urlencoded";

	public String redirectUri;
	public java.util.Map<String, String> headerMap = new java.util.HashMap<String, String>();

	public String getRedirectUri() { return redirectUri; }
	public java.util.Map<String, String> getHeaderMap() { return headerMap; }
	
	public void setRedirectUri(String _redirectUri) { redirectUri = _redirectUri; }
	public void setHeaderMap(java.util.Map<String, String> _headerMap) { headerMap = _headerMap; }

	public abstract byte[] getContent();
	public abstract void setContent(String _content);
	public abstract void setContent(byte[] _content);

	public abstract String getType();
	public abstract void setType(String _type);

	public abstract String getResponseCode();
	public abstract void setResponseCode(String _responseCode);

	public void redirect(String _uri)
	{
		setRedirectUri(_uri);
		setResponseCode("301");
	}

	public boolean isRedirect()
	{
		return (getRedirectUri() != null);
	}

	public void lastModified(java.util.Date _lastModifiedDate)
	{
		//This gives the developer a hook into setting the last
		//modified date header
		addHeader("Last-Modified", airlift.util.FormatUtil.format(_lastModifiedDate, "EEE, d MMM yyyy HH:mm:ss zzz"));
	}

	public void notCacheable()
	{
		//this says that the content is always expired.
		addHeader("Expires",  "Sat, 1 Jan 2005 00:00:00 GMT");
		//this says that the content can always be different.
		addHeader("Cache-Control", " no-cache, must-revalidate");
		//this says that the content should not be cached.
		addHeader("Pragma",  "no-cache");
	}

	public void isCacheable()
	{
		//This basically says it has never been modified.
		addHeader("Last-Modified", "Sat, 1 Jan 2005 00:00:00 GMT");
	}

	public void setDownloadFile(String _downloadFileName)
	{
		addHeader("Content-Disposition", "attachment; filename=request-" + _downloadFileName);
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

	public void addHeader(String _key, String _value)
	{
		getHeaderMap().put(_key, _value);
	}
	
	public abstract void debug(String _message);
}