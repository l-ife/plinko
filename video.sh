#!/usr/bin/env bash

node ./lib/node/canvas-websocket.js | tee >(ffplay -)  | ffmpeg -y -vsync 0 -i - -r 30 -s 250x600 -preset veryslow -b:v 2000k -fflags genpts ./data/test4.mkv