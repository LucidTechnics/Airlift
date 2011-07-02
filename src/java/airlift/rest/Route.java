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

package airlift.rest;

/** This is effectively a path that represents a legal URI
*/

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class Route.
 */
public class Route
{
	
	/** The log. */
	private static Logger log = Logger.getLogger(Route.class.getName());

	/** The Constant LABEL. */
	public static final int LABEL = 0;
	
	/** The Constant VARIABLE_PARENT. */
	public static final int VARIABLE_PARENT = 1;
	
	/** The Constant VARIABLE. */
	public static final int VARIABLE = 2;
	
	/** The name. */
	private String name;
	
	/** The type. */
	private int type;
	
	/** The parent. */
	private Route parent;
	
	/** The route map. */
	private Map<String, Route> routeMap;
	
	/** The handler name. */
	private String handlerName;

	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() { return name; }
	
	/**
	 * Gets the type.
	 *
	 * @return the type
	 */
	public int getType() { return type; }
	
	/**
	 * Gets the parent.
	 *
	 * @return the parent
	 */
	public Route getParent() { return parent; }
	
	/**
	 * Gets the route map.
	 *
	 * @return the route map
	 */
	public Map<String, Route> getRouteMap() { return routeMap; }
	
	/**
	 * Gets the handler name.
	 *
	 * @return the handler name
	 */
	public String getHandlerName() { return handlerName; }
	
	/**
	 * Sets the name.
	 *
	 * @param _name the new name
	 */
	public void setName(String _name)
	{
		if ((_name == null) || (_name != null && "".equals(_name) == true))
		{
			throw new RuntimeException("Invalid route name: " + _name);
		}

		if (_name.startsWith("{") == true)
		{
			setType(VARIABLE);
		}

		name = _name;
	}

	/**
	 * Sets the type.
	 *
	 * @param _type the new type
	 */
	public void setType(int _type) { type = _type; }
	
	/**
	 * Sets the parent.
	 *
	 * @param _parent the new parent
	 */
	public void setParent(Route _parent) { parent = _parent; }
	
	/**
	 * Sets the route map.
	 *
	 * @param _routeMap the _route map
	 */
	public void setRouteMap(Map<String, Route> _routeMap) { routeMap = _routeMap; }
	
	/**
	 * Sets the handler name.
	 *
	 * @param _handlerName the new handler name
	 */
	public void setHandlerName(String _handlerName) { handlerName = _handlerName; }
	
	/**
	 * Instantiates a new route.
	 */
	public Route()
	{
		setParent(this);
		setType(LABEL);
		setRouteMap(new HashMap<String, Route>());
	}

	/**
	 * Instantiates a new route.
	 *
	 * @param _name the _name
	 */
	public Route(String _name)
	{
		this();
		setName(_name);
	}

	/**
	 * Adds the.
	 *
	 * @param _route the _route
	 * @return the route
	 */
	public Route add(Route _route)
	{
		Route addedRoute = null;
		
		if (_route == null || _route.getName() == null || "".equals(_route.getName()) == true)
		{
			throw new RuntimeException("Cannot have null route or route with no name");
		}

		Route route = getRouteMap().get(_route.getName());

		if (route == null)
		{
			if (Route.VARIABLE_PARENT == getType())
			{
				String message = "You are not allowed to add a new route: " +
								 _route.getName() +
								 " to variable parent route: " + getName() +
								 " since the parent already contains a variable route child: " + getRouteMap();
				
				throw new RuntimeException(message);
			}
			else if (Route.VARIABLE == getType() && Route.VARIABLE == _route.getType())
			{
				throw new RuntimeException("Cannot add variable route: " + _route.getName() + " to variable route: " + getName());
			}
			else if (Route.VARIABLE == _route.getType())
			{
				setType(Route.VARIABLE_PARENT);
			}
			
			getRouteMap().put(_route.getName(), _route);
			_route.setParent(this);
			addedRoute = _route;
		}
		else
		{
			addedRoute = route;
		}

		return addedRoute;
	}

	/**
	 * Find.
	 *
	 * @param _route the _route
	 * @param _bindings the _bindings
	 * @return the route
	 */
	public Route find(String _route, Map _bindings)
	{
		Route find = null;
		
		if (_route != null && "".equals(_route) == false)
		{
			String route = _route;
			
			route  = _route.replaceFirst("^/", "");

			if ("".equals(route) == false)
			{
				String[] tokenArray = route.split("/");

				if (tokenArray.length > 0 && tokenArray[0] != null)
				{
					if (_bindings == null)
					{
						find = find(0, tokenArray, this, new HashMap());
					}
					else
					{
						find = find(0, tokenArray, this, _bindings);
					}
				}
			}
			else
			{
				throw new RuntimeException("Cannot process route that is an empty string");
			}
		}
		
		return find;
	}

	/**
	 * Find.
	 *
	 * @param _level the _level
	 * @param _tokenArray the _token array
	 * @param _route the _route
	 * @param _bindings the _bindings
	 * @return the route
	 */
	private Route find(int _level, String[] _tokenArray, Route _route, Map _bindings)
	{
		if (_route == null)
		{
			throw new RuntimeException("Cannot process null route");
		}
		
		Route find = null;

		if (_tokenArray[_level].trim().equals(_route.getName()) == true ||
			  _route.getType() == VARIABLE)
		{			
			int level = _level + 1;

			if (level < _tokenArray.length && _tokenArray[level] != null)
			{
				Route nextRoute = _route.getRouteMap().get(_tokenArray[level].trim());

				if (nextRoute != null)
				{
					find = find(level, _tokenArray, nextRoute, _bindings);
				}
				else if (_route.getType() == VARIABLE_PARENT && _route.getRouteMap().isEmpty() == false)
				{
					nextRoute = _route.getVariableRoute();
					addBindings(_bindings, _route.getName(), nextRoute.getName(), _tokenArray[level].trim());
					find = find(level, _tokenArray, nextRoute, _bindings);
				}
				else if (_route.getType() == LABEL && _route.getRouteMap().isEmpty() == false)
				{
					addDomainName(_bindings, _route.getName());
				}
			}
			else
			{
				find = _route;

				if (_route.getType() != VARIABLE) { addDomainName(_bindings, _route.getName()); }
			}
		}

		return find;
	}

	/**
	 * Adds the domain name.
	 *
	 * @param _bindings the _bindings
	 * @param _domainName the _domain name
	 */
	public static void addDomainName(Map _bindings, String _domainName)
	{
		List<String> domainList = (List<String>) _bindings.get("a.domain.list");

		if (domainList == null)
		{
			domainList = new ArrayList<String>();
			_bindings.put("a.domain.list", domainList);
		}

		String domainName = _domainName.toLowerCase();
		
		if (domainList.contains(domainName) == false)
		{
			domainList.add(domainName);
		}
	}

	/**
	 * Adds the suffix.
	 *
	 * @param _bindings the _bindings
	 * @param _suffix the _suffix
	 */
	public static void addSuffix(Map _bindings, String _suffix)
	{
		_bindings.put("a.suffix", _suffix);
	}

	/**
	 * Adds the bindings.
	 *
	 * @param _bindings the _bindings
	 * @param _parentName the _parent name
	 * @param _name the _name
	 * @param _value the _value
	 */
	public static void addBindings(Map _bindings, String _parentName, String _name, String _value)
	{
		String token = "[,;]";
		
		String[] tokenArray = _name.split(token);
		String[] valueArray = _value.split(token);

		if (valueArray.length != tokenArray.length)
		{
			throw new RuntimeException("Expected this number of tokens: " + tokenArray.length);
		}

		for (int i = 0; i < tokenArray.length; i++)
		{
			String name = _parentName.toLowerCase() + "." + strip(tokenArray[i]);
			_bindings.put(name, (valueArray[i] == null ? "" : valueArray[i].trim()));
		}

		addDomainName(_bindings, _parentName);
	}

	/**
	 * Strip.
	 *
	 * @param _variable the _variable
	 * @return the string
	 */
	public static String strip(String _variable)
	{
		String variable = null;
		
		if (_variable != null)
		{
			variable = _variable.replace("{", "").replace("}", "").trim();
		}

		return variable;
	}

	/**
	 * Gets the variable route.
	 *
	 * @return the variable route
	 */
	private Route getVariableRoute()
	{	
		Route variableRoute = null;

		for (Route route: getRouteMap().values())
		{
			variableRoute = route;
		}

		return variableRoute;
	}

	/**
	 * Exists.
	 *
	 * @param _route the _route
	 * @return true, if successful
	 */
	public boolean exists(String _route)
	{
		return (find(_route, null) != null);
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("Route\n");
		stringBuffer.append("name -> ").append(getName()).append("\n");
		stringBuffer.append("type -> ").append(getType()).append("\n");
		stringBuffer.append("handlerName -> ").append(getHandlerName()).append("\n");
		stringBuffer.append("with routes ... ").append("\n");

		for (Route route: getRouteMap().values())
		{
			stringBuffer.append(route.toString());
		}

		stringBuffer.append("done with route:").append(getName()).append("\n");
		
		return stringBuffer.toString();
	}
}	