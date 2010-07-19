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

public class SimpleContentContext
   extends ContentContext
{
	private java.util.List<String> messageList = new java.util.ArrayList<String>();
	
	private String content;
	private String type;
	private String responseCode;

	public String getContent()
	{
		StringBuffer stringBuffer = new StringBuffer();

		for (String message: this.messageList)
		{
			stringBuffer.append(message).append("\n");
		}

		stringBuffer.append(content);
		
		return stringBuffer.toString();
	}
	
    public void setContent(String _content) { content = _content; }

    public String getType() { return type; }
    public void setType(String _type) { type = _type; }

	public String getResponseCode() { return responseCode; }
	public void setResponseCode(String _responseCode) { responseCode = _responseCode; }
	
    public SimpleContentContext()
    {
		setType("text/html");
    }

    public SimpleContentContext(String _content, String _type)
    {
		setType(_type);
		setContent(_content);
	}

	public void debug(String _message)
	{
		this.messageList.add(_message);
	}
}