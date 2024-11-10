#!/usr/bin/env bash

set -e
set -u
set -o pipefail

export CLAUSUAS_PARAGRAFOS_DB_USER="$(aws ssm get-parameter --name /${PARAMETER_STORE}/clausulas_paragrafos_crud/db/username --output text --query Parameter.Value)"
export CLAUSUAS_PARAGRAFOS_DB_PASS="$(aws ssm get-parameter --with-decryption --name /${PARAMETER_STORE}/clausulas_paragrafos_crud/db/password --output text --query Parameter.Value)"

exec node dist/main