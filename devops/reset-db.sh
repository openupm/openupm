#!/usr/bin/env bash

if [[ $NODE_ENV == "production" ]]; then
  echo "Can not run in production mode."
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$SCRIPT_DIR/../"
yarn knex migrate:down
yarn knex migrate:up
node ./fixtures/load-fixtures.js
