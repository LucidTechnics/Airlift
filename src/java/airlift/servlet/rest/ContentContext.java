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
	public Redirect redirect;

	public abstract String getContent();
    public abstract void setContent(String _content);

    public abstract String getType();
	public abstract void setType(String _type);

	public abstract String getResponseCode();
	public abstract void setResponseCode(String _responseCode);

	public Redirect getRedirect() { return redirect; }
	public void setRedirect(Redirect _redirect) { redirect = _redirect; }

	public void redirect(String _uri)
	{
		Redirect redirect = new Redirect();
		redirect.sendRedirect = true;
		redirect.redirectUri = _uri;

		setRedirect(redirect);
	}

	public boolean isRedirect()
	{
		return (getRedirect() != null);
	}

	public String getRedirectUri()
	{
		return getRedirect().redirectUri;
	}
	
	public class Redirect
	{
		protected boolean sendRedirect;
		protected String redirectUri;

		public Redirect()
		{
			sendRedirect = false;
			redirectUri = null;
		}
	}

	public abstract void debug(String _message);
}