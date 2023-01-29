#!/bin/bash -e

logfile=/data/bbk.log
ts=$(date --iso-8601=seconds)
result=$(bbk_cli --quiet) # 7.96551 244.041 11.7359 gbg40a7c3200

echo "$ts $result" >> $logfile
tail -n 1 $logfile
