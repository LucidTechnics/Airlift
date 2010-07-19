@echo off

:checkJava
if "%JAVA_HOME%" == "" goto noJavaHome
if "%_JAVACMD%" == "" set _JAVACMD=%JAVA_HOME%\bin\java
if not exist "%_JAVACMD%.exe" echo Error: "%_JAVACMD%.exe" not found - check JAVA_HOME && goto end
goto runBuild 

:noJavaHome
if "%_JAVACMD%" == "" set _JAVACMD=java
echo.
echo Warning: JAVA_HOME environment variable is not set.
echo   If build fails because sun.* classes could not be found
echo   you will need to set the JAVA_HOME environment variable
echo   to the installation directory of java.
echo.
goto end

if not %JAVA_HOME%x==x goto set

echo JAVA_HOME not set
exit 1

:runBuild

set JAVA=%JAVA_HOME%\bin\java

rem These are the libraries required to run ant and its associated tasks.
rem Use build.xml to specify the libraries required to build

set CP=%JAVA_HOME%\lib\tools.jar

set CP=lib\ant\ant_optional_1.5.jar;%CP%
set CP=lib\ant\ant_1.5.jar;%CP%
set CP=lib\ant\antlrall_2.7.1.jar;%CP%
set CP=lib\ant\commons-net-1.0.0.jar;%CP%
set CP=lib\ant\netcomponents-1.3.8a.jar;%CP%
set CP=lib\unit\junit_3.7.jar;%CP%
set CP=lib\castor-0.9.3.jar;%CP%
set CP=lib\oro-2.0.4.jar;%CP%
set CP=lib\xerces-J_2.2.0.jar;%CP%
set CP=lib\xerces-api_J_2.2.0.jar;%CP%
set CP=lib\xslp_1.1.jar;%CP%
set CP=lib\jdepend.jar;%CP%


echo %CP%
%JAVA% -classpath %CP% org.apache.tools.ant.Main %1 %2 %3 %4 %5 %6 -buildfile src/build.xml
