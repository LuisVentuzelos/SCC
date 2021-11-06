FROM mongo

COPY init.json /init.json
CMD mongoimport --host db --port 27017 --db reach-engine --collection MyDummyCollection --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --type json --file /init.json --jsonArray