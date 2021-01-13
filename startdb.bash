#!/bin/bash -x
docker start mongodb 2>/dev/null || docker run --name mongodb -d -p 27017:27017 -v $(pwd)/data:/data/db mongo