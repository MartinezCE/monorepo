#!/bin/bash

cd apps/wimet-frontend

git pull
yarn

cd packages/api/shared/
yarn build

cd ../work-spaces/
yarn build
pm2 restart wimet-api-stage
