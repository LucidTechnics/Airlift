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

import java.util.*;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class RestContext.
 */
public class RestContext
{
	
	/** The log. */
	private static Logger log = Logger.getLogger(RestContext.class.getName());

	/** The uri parameter map. */
	private Map<String, Object> uriParameterMap;
	
	/** The handler path list. */
	private java.util.List<String> handlerPathList = new java.util.ArrayList<String>();
	
	/** The method. */
	private String method;
	
	/** The is uri a collection. */
	private boolean isUriACollection;
	
	/** The is uri a new domain. */
	private boolean isUriANewDomain;
	
	/** The uri. */
	private String uri;
	
	/** The app name. */
	private String appName;
	
	/** The user. */
	private AbstractUser user;
	
	/** The caching context map. */
	private Map<String, airlift.CachingContext> cachingContextMap;
	
	/** The security context. */
	private airlift.SecurityContext securityContext;
	
	/**
	 * Gets the uri parameter map.
	 *
	 * @return the uri parameter map
	 */
	public Map<String, Object> getUriParameterMap() { return uriParameterMap; }
	
	/**
	 * Gets the method.
	 *
	 * @return the method
	 */
	public String getMethod() { return method; }
	
	/**
	 * Gets the checks if is uri a collection.
	 *
	 * @return the checks if is uri a collection
	 */
	public boolean getIsUriACollection() { return isUriACollection; }
	
	/**
	 * Gets the checks if is uri a new domain.
	 *
	 * @return the checks if is uri a new domain
	 */
	public boolean getIsUriANewDomain() { return isUriANewDomain; }
	
	/**
	 * Gets the uri.
	 *
	 * @return the uri
	 */
	public String getUri() { return uri; }
	
	/**
	 * Gets the app name.
	 *
	 * @return the app name
	 */
	public String getAppName() { return appName; }
	
	/**
	 * Gets the user.
	 *
	 * @return the user
	 */
	public AbstractUser getUser() { return user; }
	
	/**
	 * Gets the caching context map.
	 *
	 * @return the caching context map
	 */
	public Map<String, airlift.CachingContext> getCachingContextMap() { return cachingContextMap; }
	
	/**
	 * Gets the security context.
	 *
	 * @return the security context
	 */
	public airlift.SecurityContext getSecurityContext() { return securityContext; }
	
	/**
	 * Gets the handler path list.
	 *
	 * @return the handler path list
	 */
	public java.util.List<String> getHandlerPathList() { return handlerPathList; }

	/**
	 * Sets the handler path list.
	 *
	 * @param _handlerPathList the new handler path list
	 */
	protected void setHandlerPathList(java.util.List<String> _handlerPathList) { handlerPathList = _handlerPathList; }
	
	/**
	 * Sets the method.
	 *
	 * @param _method the new method
	 */
	protected void setMethod(String _method) { method = _method; }
	
	/**
	 * Sets the checks if is uri a collection.
	 *
	 * @param _isUriACollection the new checks if is uri a collection
	 */
	protected void setIsUriACollection(boolean _isUriACollection) { isUriACollection = _isUriACollection; }
	
	/**
	 * Sets the checks if is uri a new domain.
	 *
	 * @param _isUriANewDomain the new checks if is uri a new domain
	 */
	protected void setIsUriANewDomain(boolean _isUriANewDomain) { isUriANewDomain = _isUriANewDomain; }
	
	/**
	 * Sets the uri.
	 *
	 * @param _uri the new uri
	 */
	protected void setUri(String _uri) { uri = _uri; }
	
	/**
	 * Sets the app name.
	 *
	 * @param _appName the new app name
	 */
	protected void setAppName(String _appName) { appName = _appName; }
	
	/**
	 * Sets the user.
	 *
	 * @param _user the new user
	 */
	protected void setUser(AbstractUser _user) { user = _user; }
	
	/**
	 * Sets the caching context map.
	 *
	 * @param _cachingContextMap the _caching context map
	 */
	protected void setCachingContextMap(Map<String, airlift.CachingContext> _cachingContextMap) { cachingContextMap = _cachingContextMap; }
	
	/**
	 * Sets the security context.
	 *
	 * @param _securityContext the new security context
	 */
	protected void setSecurityContext(airlift.SecurityContext _securityContext) { securityContext = _securityContext; }
	
	/**
	 * Sets the uri parameter map.
	 *
	 * @param _uriParameterMap the new uri parameter map
	 */
	protected void setUriParameterMap(Map _uriParameterMap) { uriParameterMap = _uriParameterMap; }

	/**
	 * Instantiates a new rest context.
	 */
	public RestContext()
	{
		setUriParameterMap(new HashMap());
	}

	/**
	 * Instantiates a new rest context.
	 *
	 * @param _uriParameterMap the _uri parameter map
	 * @param _cachingContextMap the _caching context map
	 */
	public RestContext(Map _uriParameterMap, Map<String, airlift.CachingContext> _cachingContextMap)
	{
		setUriParameterMap(_uriParameterMap);
		setCachingContextMap(_cachingContextMap);
	}

	/**
	 * Uri is a collection.
	 *
	 * @return true, if successful
	 */
	public boolean uriIsACollection()
	{
		return getIsUriACollection();
	}

	/**
	 * Uri is a new domain.
	 *
	 * @return true, if successful
	 */
	public boolean uriIsANewDomain()
	{
		return getIsUriANewDomain();
	}

	/**
	 * Gets the this domain.
	 *
	 * @return the this domain
	 */
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

	/**
	 * Gets the domain names.
	 *
	 * @return the domain names
	 */
	public List<String> getDomainNames()
	{
		List<String> domainList = new ArrayList<String>();

		if (getUriParameterMap().get("a.domain.list") != null)
		{
			domainList.addAll((List<String>) getUriParameterMap().get("a.domain.list"));
		}

		return domainList;
	}

	/**
	 * Gets the domain ids.
	 *
	 * @return the domain ids
	 */
	public Set<String> getDomainIds()
	{
		Set<String> domainIds = new HashSet<String>(getUriParameterMap().keySet());

		domainIds.remove("a.domain.list");
		
		return domainIds;
	}

	/**
	 * Gets the this domain ids.
	 *
	 * @return the this domain ids
	 */
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

	/**
	 * Gets the other domain ids.
	 *
	 * @return the other domain ids
	 */
	public List<String> getOtherDomainIds()
	{
		List<String> otherIds = new ArrayList<String>(getUriParameterMap().keySet());
		otherIds.remove("a.domain.list");

		otherIds.remove(getThisDomainIds());
	
		return otherIds; 
	}

	/**
	 * Checks for identifier.
	 *
	 * @return the boolean
	 */
	public Boolean hasIdentifier()
	{
		return Boolean.valueOf((getThisDomainIds().isEmpty() == false));
	}

	/**
	 * Gets the id value.
	 *
	 * @param _id the _id
	 * @return the id value
	 */
	public String getIdValue(String _id)
	{
		return (String)getUriParameterMap().get(_id.toLowerCase());
	}

	/**
	 * Construct domain id.
	 *
	 * @return the string
	 */
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

	/**
	 * Extract domain object path.
	 *
	 * @param _domainName the _domain name
	 * @param _path the _path
	 * @return the string
	 */
	public String extractDomainObjectPath(String _domainName, String _path)
	{
		return extractDomainObjectPaths(_path).get(_domainName);
	}
	
	/**
	 * Extract domain object paths.
	 *
	 * @param _path the _path
	 * @return the map
	 */
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

	/**
	 * Adds the handler path.
	 *
	 * @param _handlerPath the _handler path
	 */
	public void addHandlerPath(String _handlerPath)
	{
		if (getHandlerPathList().contains(_handlerPath) == false)
		{
			getHandlerPathList().add(_handlerPath);
		}
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return getUriParameterMap().toString();
	}
}