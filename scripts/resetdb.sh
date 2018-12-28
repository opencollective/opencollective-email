#!/usr/bin/env bash

set -e
PG_DATABASE="citizenspring"

echo "- dropping $PG_DATABASE database";
dropdb $PG_DATABASE

echo "- creating $PG_DATABASE database";
createdb $PG_DATABASE
echo "- running migration"
npm run db:migrate:dev

echo ""
echo "You can now start the open collective citizenspring application by running:"
echo "$> npm run dev"
echo ""
