package airlift;

public class ConsoleHandler
{
	public ConsoleHandler() {}

	public java.util.logging.ConsoleHandler getConsoleHandler()
	{
		return new java.util.logging.ConsoleHandler();
	}
}