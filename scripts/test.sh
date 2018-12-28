#!/usr/bin/env bash
set -e
PG_DATABASE="opencollective-email-test"

# Only run migrations automatically on staging and production
if [ "$SEQUELIZE_ENV" = "staging" ] || [ "$SEQUELIZE_ENV" = "production" ]; then
  echo "- running db:migrate on $SEQUELIZE_ENV environment"
  npm run db:migrate
  exit $?; # exit with return code of previous command
fi

# On any other environment, first let's check if postgres is installed
if command -v psql > /dev/null; then
  echo "✓ Postgres installed"

  if psql -lqt | cut -d \| -f 1 | grep -qw $PG_DATABASE; then
    echo "✓ $PG_DATABASE database exists"
    # dropdb $PG_DATABASE
    else
      echo "- creating $PG_DATABASE database";
      createdb $PG_DATABASE
  fi
else
  echo "𐄂 psql command doesn't exist. Make sure you have Postgres installed ($> brew install postgres)"
fi


echo ""
echo "Running tests with jest"
jest -w 1 --verbose false --detectOpenHandles --testMatch **/__tests__/**/*.test.js
echo ""
