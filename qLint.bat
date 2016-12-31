@echo off
set qexit=|| EXIT /B 1
set htmllint=java -jar .\node_modules\vnu-jar\build\dist\vnu.jar
set jslint=call jshint --show-non-errors --verbose
set csslint=call csslint --quiet --ignore=important

echo HTML Lint
%htmllint% .\data\body-generator.html || EXIT /B 1
%htmllint% .\data\parser.html || EXIT /B 1

echo Javascript Lint
%jslint% .\scripts\parser.js || EXIT /B 1
%jslint% .\data\index_base.js || EXIT /B 1

echo CSS Lint
%csslint% .\styles\parser.css || EXIT /B 1
%csslint% .\styles\spot.css || EXIT /B 1

