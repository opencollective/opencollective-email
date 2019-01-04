#!/usr/bin/env bash
set -e
PG_DATABASE="opencollective-email"

# Only run migrations automatically on staging and production
if [ "$NODE_ENV" = "staging" ] || [ "$NODE_ENV" = "production" ]; then
  echo "- running db:migrate on $NODE_ENV environment"
  npm run db:migrate
  echo "- building"
  npm run build
  exit $?; # exit with return code of previous command
fi

# On any other environment, first let's check if postgres is installed
if command -v psql > /dev/null; then
  echo "✓ Postgres installed"

  if psql -lqt | cut -d \| -f 1 | grep -qw $PG_DATABASE; then
    echo "✓ $PG_DATABASE database exists"
  else
    echo "- creating $PG_DATABASE database";
    createdb $PG_DATABASE
  fi
  echo "- running migration if any"
  npm run db:migrate:dev
else
  echo "𐄂 psql command doesn't exist. Make sure you have Postgres installed ($> brew install postgres)"
fi


echo ""
echo "You can now start the open collective email application by running:"
echo "$> npm run dev"
echo ""
