#!/bin/bash

# Read user code from input payload
echo "$USER_CODE" > usercode.js

# run the js code
timeout "$TIME_LIMIT" node usercode.js