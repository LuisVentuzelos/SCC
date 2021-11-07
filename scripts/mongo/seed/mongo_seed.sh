#!/bin/bash
FILE="./init.json"
mongoimport --host $MONGO_HOSTNAME --authenticationDatabase $DB_NAME --username $APP_USER --password $APP_PWD --db $DB_NAME --collection $DB_COLLECTION_NAME --file $FILE --jsonArray