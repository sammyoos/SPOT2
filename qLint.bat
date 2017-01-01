@echo off
set qexit=|| EXIT /B 1
set htmllint=java -jar .\node_modules\vnu-jar\build\dist\vnu.jar
set jslint=call jshint --show-non-errors --verbose
set csslint=call csslint --quiet --ignore=important
set minimize=call java -jar ..\yuicompressor-2.4.8.jar

echo HTML Lint
%htmllint% .\body-generator.html || EXIT /B 1
%htmllint% .\parser.html || EXIT /B 1
%htmllint% .\find_small_potions.html || EXIT /B 1
%htmllint% .\index.html || EXIT /B 1

echo Javascript Lint
%jslint% .\data\index_base.js || EXIT /B 1
%jslint% .\data\index_small.js || EXIT /B 1

%jslint% .\scripts\parser.js || EXIT /B 1
%jslint% .\scripts\constants.js || EXIT /B 1
%jslint% .\scripts\utils.js || EXIT /B 1
%jslint% .\scripts\bootstrap-index.js || EXIT /B 1
%jslint% .\scripts\find_small_potions.js || EXIT /B 1

echo CSS Lint
%csslint% .\styles\parser.css || EXIT /B 1
%csslint% .\styles\spot.css || EXIT /B 1

echo Minimize
%minimize% data\index_big.js -o data\index.min.js || EXIT /B 1
%minimize% scripts\utils.js -o scripts\utils.min.js || EXIT /B 1
