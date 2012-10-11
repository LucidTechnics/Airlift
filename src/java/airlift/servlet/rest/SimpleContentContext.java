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

import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class SimpleContentContext.
 */
public class SimpleContentContext
   extends ContentContext
{
	
	/** The log. */
	private static Logger log = Logger.getLogger(SimpleContentContext.class.getName());
	
	/** The message list. */
	private java.util.List<String> messageList = new java.util.ArrayList<String>();
	
	/** The content bytes. */
	private byte[] contentBytes = new byte[0];
	
	/** The type. */
	private String type;
	
	/** The response code. */
	private String responseCode = "200";

	/* (non-Javadoc)
	 * @see airlift.servlet.rest.ContentContext#getContent()
	 */
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
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.ContentContext#setContent(java.lang.String)
	 */
	public void setContent(String _content) { if (_content != null) { contentBytes = _content.getBytes(); } else { contentBytes = new byte[0]; } }
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.ContentContext#setContent(byte[])
	 */
	public void setContent(byte[] _content) { contentBytes = _content; }

    /* (non-Javadoc)
     * @see airlift.servlet.rest.ContentContext#getType()
     */
    public String getType() { return type; }
    
    /* (non-Javadoc)
     * @see airlift.servlet.rest.ContentContext#setType(java.lang.String)
     */
    public void setType(String _type) { type = _type; }

	/* (non-Javadoc)
	 * @see airlift.servlet.rest.ContentContext#getResponseCode()
	 */
	public String getResponseCode() { return responseCode; }
	
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.ContentContext#setResponseCode(java.lang.String)
	 */
	public void setResponseCode(String _responseCode) { responseCode = _responseCode; }
	
    /**
     * Instantiates a new simple content context.
     */
    public SimpleContentContext()
    {
		setType("text/html");
		setCorHeaders();
    }

	/**
	 * Instantiates a new simple content context.
	 *
	 * @param _content the _content
	 * @param _type the _type
	 */
	public SimpleContentContext(byte[] _content, String _type)
	{
		setType(_type);
		setContent(_content);
		setCorHeaders();
	}

	public void setCorHeaders()
	{
		addHeader("Access-Control-Allow-Origin", "*");
		addHeader("Access-Control-Allow-Headers", "Content-Type");
		addHeader("Access-Control-Max-Age", "86400");
		addHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS");
	}

    /**
     * Instantiates a new simple content context.
     *
     * @param _content the _content
     * @param _type the _type
     */
    public SimpleContentContext(String _content, String _type)
	{
		this((_content != null) ? _content.getBytes() : new byte[0], _type);
	}

	/* (non-Javadoc)
	 * @see airlift.servlet.rest.ContentContext#debug(java.lang.String)
	 */
	public void debug(String _message)
	{
		this.messageList.add(_message);
	}
}