@echo off
if "%1" == "js" goto :jsLint
if "%1" == "html" goto :htmlLint
if "%1" == "css" goto :cssLint

echo WTF

goto :done
:jsLint
echo Javascript Lint
jshint --show-non-errors --verbose .\scripts\%2.js

goto :done
:htmlLint
echo HTML Lint
java -jar .\node_modules\vnu-jar\build\dist\vnu.jar --verbose %2.html

goto :done
:cssLint
echo CSS Lint
csslint --ignore=important .\styles\%2.css

goto :done
:done
