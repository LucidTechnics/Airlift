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

package airlift; 

public class MessageManager
{
	java.util.Map<String, java.util.List<Message>> messageMap;

	public MessageManager()
	{
		this.messageMap = new java.util.HashMap<String, java.util.List<Message>>();
	}
	
	public MessageManager(java.util.Map<String, java.util.List<Message>> _messageMap)
	{
		if (_messageMap != null)
		{
			this.messageMap = _messageMap;
		}
		else
		{
			this.messageMap = new java.util.HashMap<String, java.util.List<Message>>();
		}
	}

	public void add(MessageManager _messageManager)
	{
		add(_messageManager.getMessageMap());
	}

	public void add(String _name, String _category, String _message)
	{
		add(new MessageImpl(_name, _category, _message));
	}

	public void add(Message _message)
	{
		if (_message != null)
		{
			java.util.List<Message> list = new java.util.ArrayList<Message>();
			list.add(_message);
			add(_message.getName(), list);
		}
	}

	public void add(java.util.List<Message> _list)
	{
		if (_list != null && _list.isEmpty() == false)
		{
			for (Message message: _list)
			{
				add(message);
			}
		}
	}

	public void add(String _name, java.util.List<Message> _list)
	{
		if (_list != null && _list.isEmpty() == false)
		{
			java.util.Map<String, java.util.List<Message>> map = new java.util.HashMap<String, java.util.List<Message>>();
			map.put(_name, _list);
			add(map);
		}
	}
	
	public void add(java.util.Map<String, java.util.List<Message>> _map)
	{
		if (_map != null && _map.isEmpty() == false)
		{
			for (String name: _map.keySet())
			{
				if (this.messageMap.containsKey(name) != true)
				{
					messageMap.put(name, new java.util.ArrayList<Message>());
				}

				java.util.List<Message> list = this.messageMap.get(name);

				if (_map.get(name) != null) { list.addAll(_map.get(name)); }
			}
		}
	}
	
	public java.util.Iterator propertySet()
	{
		return this.messageMap.keySet().iterator();
	}

	public Message getMessage(String _name)
	{
		Message message = null;

		if (this.messageMap.containsKey(_name))
		{
			java.util.List<Message> list = this.messageMap.get(_name);

			if (list.isEmpty() == false)
			{
				message = (Message) list.get(0);
			}
		}
		
		return message;
	}

	public java.util.List<Message> getMessageList(String _name)
	{
		java.util.List<Message> list = new java.util.ArrayList<Message>();
		
		if (this.messageMap.containsKey(_name) == true)
		{
			list.addAll(this.messageMap.get(_name));
		}

		return list;
	}

	public java.util.List<Message> getMessageList()
	{
		java.util.List<Message> messageList = new java.util.ArrayList<Message>();

		for (java.util.List list: this.messageMap.values())
		{
			messageList.addAll(list);
		}

		return messageList;
	}

	public java.util.Map<String, java.util.List<Message>> getMessageMap()
	{
		return new java.util.HashMap<String, java.util.List<Message>>(this.messageMap);
	}

	public boolean isEmpty()
	{
		return getMessageMap().isEmpty();
	}
}