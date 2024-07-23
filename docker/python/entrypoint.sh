#!/bin/bash

# Read user code from input payload
echo "$USER_CODE" > usercode.py

# run the js code
timeout "$TIME_LIMIT" python3 usercode.py