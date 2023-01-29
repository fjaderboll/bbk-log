#!/bin/bash -e

cd $(dirname "${BASH_SOURCE[0]}")
source config

dockerImageFile=/tmp/image_$IMAGE_NAME.tar

./build.sh
docker save -o $dockerImageFile $IMAGE_NAME
scp $dockerImageFile $REMOTE_HOST:/tmp/.
ssh $REMOTE_HOST docker load -i $dockerImageFile
./run.sh remote
