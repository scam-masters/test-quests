#!/bin/sh

host="$1"
port="$2"
timeout="$3"
sleep_interval=2

echo "Waiting for $host:$port to be available..."

while ! nc -z "$host" "$port"; do
    if [ "$timeout" -le 0 ]; then
        echo "Timeout: Server not available after waiting."
        exit 1
    fi

    echo "Retrying in $sleep_interval seconds..."
    echo "$host $port"
    sleep "$sleep_interval"
    timeout=$((timeout - sleep_interval))
done

echo "$host:$port is now available."