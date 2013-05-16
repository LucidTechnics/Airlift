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

import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

public class ResourceUtil
{
	private static Logger log = Logger.getLogger(ResourceUtil.class.getName());

	private static Map<String, String> resourceMap = new HashMap();
	private boolean cacheResource = false;
	
	/**
     * Instantiates a new javascripting util.
     */
	public ResourceUtil()
	{
		this.cacheResource = false;
	}

	public ResourceUtil(boolean _cacheResource)
	{
		this();
		this.cacheResource = _cacheResource;
	}

	public String load(String _resource)
	{
		return load(_resource, true);
	}
	
	public String load(String _resource, boolean _throwException)
	{
		String resource = _resource.replaceAll("^/", "");
		String resourceString = this.resourceMap.get(resource);

		if (resourceString == null)
		{
			StringBuffer stringBuffer = new StringBuffer();
			InputStream inputStream = null;

			try
			{
				inputStream = airlift.util.ResourceUtil.class.getResourceAsStream("/" + resource);
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}

			if (inputStream == null && _throwException == true)
			{
				throw new airlift.servlet.rest.HandlerException("Unable to find resource using classloader getResourceAsStream(). Is this resource: " + resource + " in the application's classpath?",
					airlift.servlet.rest.HandlerException.ErrorCode.RESOURCE_NOT_FOUND);
			}

			if (inputStream != null)
			{
				BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

				String line = null;

				do
				{
					try
					{
						line = reader.readLine();

						if (line != null)
						{
							stringBuffer.append(line);
						}
					}
					catch(Throwable e)
					{
						throw new RuntimeException(e);
					}
				}
				while (line != null);

				resourceString = stringBuffer.toString();

				if (this.cacheResource == true)
				{
					resourceMap.put(resource, resourceString);
				}
			}
		}

		return resourceString;
	}
}