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

	public String redirectUri;

	public String getRedirectUri() { return redirectUri; }
	public void setRedirectUri(String _redirectUri) { redirectUri = _redirectUri; }
	
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
	
	public abstract void debug(String _message);
}