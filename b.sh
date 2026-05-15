#!/bin/bash

pnpm turbo build --filter=@scalar/api-reference --force

cp packages/api-reference/dist/browser/standalone.js ../docs/docs/javascripts/scalar/
