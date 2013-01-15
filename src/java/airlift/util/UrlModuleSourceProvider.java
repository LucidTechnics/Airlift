/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package airlift.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.Reader;
import java.io.Serializable;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import org.mozilla.javascript.commonjs.module.provider.ModuleSource;

/**
 * A URL-based script provider that can load modules from jar files
 * loaded into App Engine against a set of base privileged and fallback URIs.
 * It is deliberately not named "URI provider" but a "URL provider",
 * but it only works for URIs whose path references jar file resources).
 * This file was modified from the class of the same name in the Mozilla Rhino
 * code base.  This was needed because App Engine's whitelist does not
 * support the creation of a protocol handler for URIs.
 * 
 * @author Bediako George
 * @version $Id: UrlModuleSourceProvider.java,v 1.4 2011/04/07 20:26:12 hannes%helma.at Exp $
 */

public class UrlModuleSourceProvider
   extends org.mozilla.javascript.commonjs.module.provider.ModuleSourceProviderBase
{
    private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(JavascriptingUtil.class.getName());
	
    private final Iterable<URI> privilegedUris;
    private final Iterable<URI> fallbackUris;

    /**
     * Creates a new module script provider that loads modules against a set of
     * privileged and fallback URIs. It will use a fixed default cache expiry
     * of 60 seconds, and provide no security domain objects for the resource.
     * @param privilegedUris an iterable providing the privileged URIs. Can be
     * null if no privileged URIs are used.
     * @param fallbackUris an iterable providing the fallback URIs. Can be
     * null if no fallback URIs are used.
     */
    public UrlModuleSourceProvider(Iterable<URI> privilegedUris, Iterable<URI> fallbackUris)
    {
		this.privilegedUris = privilegedUris;
		this.fallbackUris = fallbackUris;
    }

    @Override
    protected ModuleSource loadFromPrivilegedLocations(String moduleId, Object validator)
            throws IOException, URISyntaxException
    {
        return loadFromPathList(moduleId, validator, privilegedUris);
    }

    @Override
    protected ModuleSource loadFromFallbackLocations(String moduleId, Object validator)
            throws IOException, URISyntaxException
    {
        return loadFromPathList(moduleId, validator, fallbackUris);
    }

    private ModuleSource loadFromPathList(String moduleId, Object validator, Iterable<URI> paths)
            throws IOException, URISyntaxException
    {
		if(paths == null)
		{
            return null;
        }

		for (URI path : paths)
		{
			final ModuleSource moduleSource = loadFromUri(path.resolve(moduleId), path, validator);
			
			if (moduleSource != null)
			{
                return moduleSource;
            }
		}
		
        return null;
    }

    @Override
    protected ModuleSource loadFromUri(URI uri, URI base, Object validator)
    throws IOException, URISyntaxException
	{
        // We expect modules to have a ".js" file name extension ...
		URI fullUri = new URI(uri + ".js");
		log.info("loading source from: " + fullUri);
        ModuleSource source = loadFromActualUri(fullUri, base, validator);
        // ... but for compatibility we support modules without extension,
        // or ids with explicit extension.
        return source != null ? source : loadFromActualUri(uri, base, validator);
    }

	protected ModuleSource loadFromActualUri(URI uri, URI base, Object validator)
			throws IOException
    {
        final URL url = new URL(base == null ? null : base.toURL(), uri.toString());

		InputStream inputStream = null;
		String scriptResource = url.getPath().replaceAll("^/", "");

		try
		{
			/*ClassLoader classLoader = airlift.util.JavascriptingUtil.class.getClassLoader();
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			log.info("fetching resource: " + "/" + scriptResource);*/
			
			java.net.URL resourceURL = airlift.util.JavascriptingUtil.class.getResource("/" + scriptResource);
			log.info("resource url object: " + resourceURL.toString());
			
			java.net.URLConnection resourceConnection = resourceURL.openConnection();
			log.info("default value of use caches: " + resourceConnection.getUseCaches());
			resourceConnection.setUseCaches(false);
			log.info("now use caches: " + resourceConnection.getUseCaches());
			inputStream = resourceConnection.getInputStream();
			//inputStream = airlift.util.JavascriptingUtil.class.getResourceAsStream("/" + scriptResource);
		}
		catch(Throwable t)
		{
			java.io.StringWriter stringWriter = new java.io.StringWriter();
			java.io.PrintWriter printWriter = new java.io.PrintWriter(stringWriter);
			t.printStackTrace(printWriter);
			
			log.info("Swallowed this exception: " + stringWriter.toString());
		}

		if (inputStream == null)
		{
			log.warning("Cannot find script: " + url.getPath());
		}

		return (inputStream != null) ? new ModuleSource(getReader(inputStream), null, uri, base, new URLValidator()) : null;
    }

    private static Reader getReader(java.io.InputStream _inputStream)
			throws IOException
    {
        return new InputStreamReader(_inputStream, "utf-8");
    }

    /**
     * Override if you want to get notified if the URL connection fails to
     * close. Does nothing by default.
     * @param urlConnection the connection
     * @param cause the cause it failed to close.
     */
	protected void onFailedClosingUrlConnection(URLConnection urlConnection, IOException cause)
	{
		
    }

	private static class URLValidator
			implements Serializable
	{
        private static final long serialVersionUID = 1L;

        public URLValidator()
		{
        }
    }
}