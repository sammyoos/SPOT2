@echo off
echo .
echo Bootstrap Lint
call bootlint index.html parser.html
echo .
echo JSHint
call jshint --verbose scripts\parser.js
