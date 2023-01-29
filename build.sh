#!/bin/bash -e

cd $(dirname "${BASH_SOURCE[0]}")
source config

docker build -t $IMAGE_NAME .
