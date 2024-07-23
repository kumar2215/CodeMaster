#!/bin/bash

# Read user code from input payload
echo "$USER_CODE" > "$MAIN_CLASS".java
echo "$TEST_CODE" > Test.java

# Compile the Java code
javac *.java
if [ $? -eq 0 ]; then
    # Run the Java code
    timeout "$TIME_LIMIT" java Test
else
    echo "Compilation failed"
fi
