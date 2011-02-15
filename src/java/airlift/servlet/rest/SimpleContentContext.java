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

import java.util.logging.Logger;

public class SimpleContentContext
   extends ContentContext
{
	private static Logger log = Logger.getLogger(SimpleContentContext.class.getName());
	private java.util.List<String> messageList = new java.util.ArrayList<String>();
	
	private byte[] contentBytes = new byte[0];
	private String type;
	private String responseCode = "200";

	public byte[] getContent()
	{
		StringBuffer stringBuffer = new StringBuffer();

		for (String message: this.messageList)
		{
			stringBuffer.append(message).append("\n");
		}
		
		byte[] messageBytes =  stringBuffer.toString().getBytes();
		byte[] byteArray = new byte[messageBytes.length + contentBytes.length];

		System.arraycopy(messageBytes, 0, byteArray, 0, messageBytes.length);
		System.arraycopy(contentBytes, 0, byteArray, messageBytes.length, contentBytes.length);

		return byteArray;
	}
	
	public void setContent(String _content) { if (_content != null) { contentBytes = _content.getBytes(); } else { contentBytes = new byte[0]; } }
	public void setContent(byte[] _content) { contentBytes = _content; }

    public String getType() { return type; }
    public void setType(String _type) { type = _type; }

	public String getResponseCode() { return responseCode; }
	public void setResponseCode(String _responseCode) { responseCode = _responseCode; }
	
    public SimpleContentContext()
    {
		setType("application/xml");
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