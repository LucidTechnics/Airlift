#!/bin/bash
sleep 5
echo Now exiting Dev App Server...
sleep 5
kill $(ps aux | grep 'Terminal' | awk '{print $2}')