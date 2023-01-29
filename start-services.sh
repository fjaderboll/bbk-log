#!/bin/bash

# Start nginx process
nginx -g 'daemon off;' &

# Start cron process
cron -f -L 2 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
