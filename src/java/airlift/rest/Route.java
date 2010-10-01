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

package airlift.rest;

/** This is effectively a path that represents a legal URI
*/

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

public class Route
{
	private static Logger log = Logger.getLogger(Route.class.getName());

	public static final int LABEL = 0;
	public static final int VARIABLE_PARENT = 1;
	public static final int VARIABLE = 2;
	
	private String name;
	private int type;
	private Route parent;
	private Map<String, Route> routeMap;
	private String handlerName;

	public String getName() { return name; }
	public int getType() { return type; }
	public Route getParent() { return parent; }
	public Map<String, Route> getRouteMap() { return routeMap; }
	public String getHandlerName() { return handlerName; }
	
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

	public void setType(int _type) { type = _type; }
	public void setParent(Route _parent) { parent = _parent; }
	public void setRouteMap(Map<String, Route> _routeMap) { routeMap = _routeMap; }
	public void setHandlerName(String _handlerName) { handlerName = _handlerName; }
	
	public Route()
	{
		setParent(this);
		setType(LABEL);
		setRouteMap(new HashMap<String, Route>());
	}

	public Route(String _name)
	{
		this();
		setName(_name);
	}

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

	public static String strip(String _variable)
	{
		String variable = null;
		
		if (_variable != null)
		{
			variable = _variable.replace("{", "").replace("}", "").trim();
		}

		return variable;
	}

	private Route getVariableRoute()
	{	
		Route variableRoute = null;

		for (Route route: getRouteMap().values())
		{
			variableRoute = route;
		}

		return variableRoute;
	}

	public boolean exists(String _route)
	{
		return (find(_route, null) != null);
	}
	
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