#!/bin/bash
set -eux

webpack --mode production

python server.py &
TEST_SERVER_PORT=8001 TEST_SERVER_HTTPS=1 python server.py &

sleep 3
curl -k http://localhost:8000
curl -k https://localhost:8001

pytest --tests-per-worker 6 test.py
