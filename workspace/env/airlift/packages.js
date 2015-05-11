var print = function print(_message)
{
	Packages.java.lang.System.out.println(_message);
};

var baseDir = project.getProperty("classes");

var directoryScanner = new org.apache.tools.ant.DirectoryScanner();
var includes = 	Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.String, 1);
includes[0] = "**/node_modules";

directoryScanner.setIncludes(includes);
directoryScanner.setBasedir(new Packages.java.io.File(baseDir));
directoryScanner.setCaseSensitive(true);
directoryScanner.scan();

print("Looking for node_modules in " + classes);

var files = directoryScanner.getIncludedDirectories();

for (var i = 0; i < files.length; i++)
{
	print(files[i]);
}

print("Done looking for node_modules ...");