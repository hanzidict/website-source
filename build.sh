#!/bin/bash

docker build -t registry.languageterminal.com/everest/zen-help:$1 .
docker push registry.languageterminal.com/everest/zen-help:$1
git tag -a release-$1 -m release-$1
git push --tags
