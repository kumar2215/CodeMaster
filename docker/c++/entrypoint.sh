#!/bin/bash

# Write the user code to a file
echo "$USER_CODE" > usercode.cpp 

# Compile the C++ code
g++ -o test usercode.cpp

# Run the compiled code and capture the output
timeout "$TIME_LIMIT" ./test