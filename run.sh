#!/bin/bash -e

cd $(dirname "${BASH_SOURCE[0]}")
source config

prefixCmd=""
if [ "$1" = "remote" ]; then
	prefixCmd="ssh $REMOTE_HOST"
fi

$prefixCmd docker stop $CONTAINER_NAME > /dev/null 2>&1 && echo "Stopping previous container" || echo -n ""
$prefixCmd docker rm $CONTAINER_NAME > /dev/null 2>&1 && echo "Removing previous container" || echo -n ""

$prefixCmd docker run -d --restart unless-stopped --name $CONTAINER_NAME -p $PORT:80 -v $VOLUME_NAME:/data $IMAGE_NAME
echo "Container \"$CONTAINER_NAME\" started"
