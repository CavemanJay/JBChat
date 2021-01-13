#!/bin/bash -x
docker run -d -p 27017:27017 -v $(pwd)/data:/data/db mongo