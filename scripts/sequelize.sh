#!/bin/sh
# This script wraps the sequelize command with babel-node and passes
# parameters required in every single call.

# If the first parameter is `-l` (local), it will append the
# configuration with variables that can be passed from the shell. It
# defaults to the local environment though (hardcoded values).
[ "$1" = "-l" ] && { LOCAL=1; shift; }

# Important paths
ROOT="$( dirname "$(readlink "$0/..")" )"
NODEBIN=${ROOT}/node_modules/.bin
PATH=${PATH}:$NODEBIN

# Environment
SQLENV=${SEQUELIZE_ENV:=${NODE_ENV:=development}}

# Parameters & Command
SEQUELIZE_CONFIG="--models-path src/server/models/ --migrations-path src/server/migrations/ --config config/sequelize_cli.json"
LOCAL_DB_URL="--url postgres://${PG_USERNAME:=}@${PG_HOST:=localhost}:${PG_PORT:=5432}/${PG_DATABASE:=opencollective-email}"
[ -n "$LOCAL" ] && SEQUELIZE_CONFIG="${SEQUELIZE_CONFIG} ${LOCAL_DB_URL}"
COMMAND="babel-node $NODEBIN/sequelize ${SEQUELIZE_CONFIG} $@"

# Variables exported for the exec
export CUSTOM_DB PATH
cd ${ROOT}
echo ${COMMAND}
exec ${COMMAND}
