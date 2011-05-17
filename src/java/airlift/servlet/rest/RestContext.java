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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

public class RestContext
{
	private static Logger log = Logger.getLogger(RestContext.class.getName());

	private Map<String, Object> uriParameterMap;
	private java.util.List<String> handlerPathList = new java.util.ArrayList<String>();
	private String method;
	private boolean isUriACollection;
	private boolean isUriANewDomain;
	private String uri;
	private String appName;
	private AbstractUser user;
	private Map<String, airlift.CachingContext> cachingContextMap;
	
	public Map<String, Object> getUriParameterMap() { return uriParameterMap; }
	public void setUriParameterMap(Map _uriParameterMap) { uriParameterMap = _uriParameterMap; }
	public String getMethod() { return method; }
	public boolean getIsUriACollection() { return isUriACollection; }
	public boolean getIsUriANewDomain() { return isUriANewDomain; }
	public String getUri() { return uri; }
	public String getAppName() { return appName; }
	public AbstractUser getUser() { return user; }
	public Map<String, airlift.CachingContext> getCachingContextMap() { return cachingContextMap; }
	
	public java.util.List<String> getHandlerPathList() { return handlerPathList; }
	public void setHandlerPathList(java.util.List<String> _handlerPathList) { handlerPathList = _handlerPathList; }
	
	protected void setMethod(String _method) { method = _method; }
	protected void setIsUriACollection(boolean _isUriACollection) { isUriACollection = _isUriACollection; }
	protected void setIsUriANewDomain(boolean _isUriANewDomain) { isUriANewDomain = _isUriANewDomain; }
	protected void setUri(String _uri) { uri = _uri; }
	protected void setAppName(String _appName) { appName = _appName; }
	protected void setUser(AbstractUser _user) { user = _user; }
	protected void setCachingContextMap(Map<String, airlift.CachingContext> _cachingContextMap) { cachingContextMap = _cachingContextMap; }
	
	public RestContext()
	{
		setUriParameterMap(new HashMap());
	}

	public RestContext(Map _uriParameterMap, Map<String, airlift.CachingContext> _cachingContextMap)
	{
		setUriParameterMap(_uriParameterMap);
		setCachingContextMap(_cachingContextMap);
	}

	public boolean uriIsACollection()
	{
		return getIsUriACollection();
	}

	public boolean uriIsANewDomain()
	{
		return getIsUriANewDomain();
	}

	public String getThisDomain()
	{
		String domainName = "airlift.not.found.domain.name";

		List<String> domainList = (List<String>) getUriParameterMap().get("a.domain.list");

		if (domainList != null && domainList.isEmpty() == false)
		{
			domainName = domainList.get(domainList.size() - 1);
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

	public void addHandlerPath(String _handlerPath)
	{
		if (getHandlerPathList().contains(_handlerPath) == false)
		{
			getHandlerPathList().add(_handlerPath);
		}
	}
	
	public String toString()
	{
		return getUriParameterMap().toString();
	}
}