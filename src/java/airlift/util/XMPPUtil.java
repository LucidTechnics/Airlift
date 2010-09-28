/*
 Copyright 2010, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/
package airlift.util;

import com.google.appengine.api.xmpp.JID;
import com.google.appengine.api.xmpp.Message;
import com.google.appengine.api.xmpp.MessageBuilder;
import com.google.appengine.api.xmpp.SendResponse;
import com.google.appengine.api.xmpp.XMPPService;
import com.google.appengine.api.xmpp.XMPPServiceFactory;

/**
 * XMPP Utility Class
 *
 */
public class XMPPUtil 
{
	// Suppress default constructor so it cannot be instantiated.
	private XMPPUtil()
	{
		throw new AssertionError();
	}
	
	/**
	 * Sends an XMPP message to given recipient
	 * @param receiver
	 * @param message
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
