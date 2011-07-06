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

import com.google.appengine.api.xmpp.*;

/**
 * XMPP Utility Class.
 */
public class XMPPUtil 
{
	/**
	 * Instantiates a new XMPP util.
	 */
	private XMPPUtil()
	{
        // Suppress default constructor so it cannot be instantiated.
		throw new AssertionError();
	}
	
	/**
	 * Sends an XMPP message to given recipient.
	 *
	 * @param receiver the receiver
	 * @param message the message
	 * @return boolean whether message sent
	 */
	public static boolean sendMessage(final String receiver, final String message)
	{
		boolean messageSent = false;
		
        JID jid = new JID(receiver);
        String msgBody = message;
        Message msg = new MessageBuilder()
            .withRecipientJids(jid)
            .withBody(msgBody)
            .build();

        XMPPService xmpp = XMPPServiceFactory.getXMPPService();
        if (xmpp.getPresence(jid).isAvailable()) 
		{
            SendResponse status = xmpp.sendMessage(msg);
            messageSent = (status.getStatusMap().get(jid) == SendResponse.Status.SUCCESS);
        }

		return messageSent;
	}	
}
