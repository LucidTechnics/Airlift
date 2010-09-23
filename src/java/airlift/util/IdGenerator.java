package airlift.util;

import java.util.logging.Logger;

public class IdGenerator
{
	private static final Logger log = Logger.getLogger(IdGenerator.class.getName());

	public static String generate()
	{
		airlift.util.PropertyUtil.getInstance().loadProperties("/airlift/airlift.properties", "airlift.cfg");

		String lengthString = airlift.util.PropertyUtil.getInstance().getProperty("airlift.cfg", "airlift.truncated.sha1.id.length");

		int length = (lengthString != null && !org.apache.commons.lang.StringUtils.isWhitespace(lengthString)) ? Integer.valueOf(lengthString) : 10;

		return generate(length);
	}

	public static String generate(int _length)
	{
		java.util.UUID uuid = java.util.UUID.randomUUID();
		String message = uuid.toString();
		String hash = hash("SHA1", message);

		//no ArrayOutOfBoundsExceptions
		int length = (hash.length() > _length) ? _length : (hash.length() - 1);

		return hash.substring(hash.length() - length, hash.length());
	}

	public static String hash(String _hashAlgorithm, String _message)
	{
		byte[] digest = null;

		try
		{
			java.security.MessageDigest messageDigest = java.security.MessageDigest.getInstance(_hashAlgorithm.toUpperCase());

			byte[] byteArray = _message.getBytes();
			digest = messageDigest.digest(byteArray);
		}
		catch (Throwable t)
		{
			throw new RuntimeException(t);
		}

		return bytesToHex(digest);
	}

	public static String bytesToHex(byte[] b)
	{
		char hexDigit[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
		StringBuffer buf = new StringBuffer();
		
		for (byte aB : b)
		{
            buf.append(hexDigit[(aB >> 4) & 0x0f]);
            buf.append(hexDigit[aB & 0x0f]);
        }

		return buf.toString();
	}
}