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

import java.util.*;

public class RestContext
{
	private static Logger log = Logger.getLogger(RestContext.class.getName());

	private Map<String, Object> uriParameterMap;

	public Map<String, Object> getUriParameterMap() { return uriParameterMap; }
	public void setUriParameterMap(Map _uriParameterMap) { uriParameterMap = _uriParameterMap; }
	
	public RestContext()
	{
		setUriParameterMap(new HashMap());
	}

	public RestContext(Map _uriParameterMap)
	{
		setUriParameterMap(_uriParameterMap);
	}

	public String getThisDomain()
	{
		String domainName = null;

		List<String> domainList = (List<String>) getUriParameterMap().get("a.domain.list");

		log.info("RestContext has this domain list: " + domainList);

		if (domainList != null && domainList.isEmpty() == false)
		{
			domainName = domainList.get(domainList.size() - 1);
		}
		else
		{
			throw new RuntimeException("Domain list is null or empty for this URI");
		}

		return domainName;
	}

	public List<String> getDomainNames()
	{
		List<String> domainList = new ArrayList<String>();

		if (getUriParameterMap().get("a.domain.list") != null)
		{
			domainList.addAll((List<String>) getUriParameterMap().get("a.domain.list"));
		}

		return domainList;
	}

	public Set<String> getDomainIds()
	{
		Set<String> domainIds = new HashSet<String>(getUriParameterMap().keySet());

		domainIds.remove("a.domain.list");
		
		return domainIds;
	}

	public List<String> getThisDomainIds()
	{
		List<String> idList = new ArrayList<String>();
		
		String domainName = getThisDomain();

		for (String domainId: (Set<String>)getUriParameterMap().keySet())
		{
			if (domainId.startsWith(domainName) == true)
			{
				idList.add(domainId);
			}
		}

		return idList;
	}

	public List<String> getOtherDomainIds()
	{
		List<String> otherIds = new ArrayList<String>(getUriParameterMap().keySet());
		otherIds.remove("a.domain.list");

		otherIds.remove(getThisDomainIds());
	
		return otherIds; 
	}

	public Boolean hasIdentifier()
	{
		return Boolean.valueOf((getThisDomainIds().isEmpty() == false));
	}

	public String getIdValue(String _id)
	{
		return (String)getUriParameterMap().get(_id.toLowerCase());
	}

	public String constructDomainId()
	{
		String domainId = null;
		
		Iterator ids = getThisDomainIds().iterator();	
		StringBuffer id = (ids.hasNext() == true) ? new StringBuffer(getIdValue((String)ids.next())) : new StringBuffer();

		while (ids.hasNext() == true)
		{
			id.append(",").append(getIdValue((String)ids.next()));
		}

		return id.toString();
	}

	public String extractDomainObjectPath(String _domainName, String _path)
	{
		return extractDomainObjectPaths(_path).get(_domainName);
	}
	
	public Map<String, String> extractDomainObjectPaths(String _path)
	{
		Map domainObjectPathMap = new HashMap<String, String>();
		String[] pathToken = _path.split("/");
		
		for (String domainName: getDomainNames())
		{
			for (int i = 0; i < pathToken.length; i++)
			{
				if (pathToken[i].equalsIgnoreCase(domainName) == true)
				{
					StringBuffer stringBuffer = new StringBuffer();

					for (int j = 0; j <= i; j++)
					{
						stringBuffer.append(pathToken[j]).append("/");
					}

					if (pathToken.length > (i + 1))
					{
						stringBuffer.append(pathToken[i + 1]);
					}

					domainObjectPathMap.put(domainName, stringBuffer.toString().replaceFirst("/$", ""));

					i = pathToken.length;
				}
			}
		}
		
		return domainObjectPathMap;
	}

	public String toString()
	{
		return getUriParameterMap().toString();
	}
}