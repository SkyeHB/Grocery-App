#!/usr/bin/bash
if [ ! "$#" -eq 1 ] 
then
	echo "Usage: start.sh [start | stop]"  
	exit 1
fi

# Run NPM install before starting services 
npm install

[ "$1" = "start" ] \
	&& export PGUSER="postgres" \
	&& export PGHOST="localhost" \
	&& export PGDATABASE="grocerypal" \
	&& export PGPASSWORD="vDPFM4LVbz7MCxYD" \
	&& export PGPORT="5432" \
	&& npx tsc \
	&& pm2 start "./index.js" > log.txt 
[ "$1" = "stop" ] && pm2 stop "index.js"

