const fs = require('fs');
const userCode = require('./userCode');

// Dynamically import user's JavaScript file

const testCaseFileName = process.env.TESTCASE_FILENAME;
const functionName = process.env.FUNCTION_NAME;
const formatString = process.env.FORMAT;
const format = formatString.split(',')

console.log("Running JavaScript script...");


// Load and parse the test cases JSON file
fs.readFile(`./${testCaseFileName}`, 'utf-8', (err, data) => {
    if (err) {
        return;
    }

    let testCases
    try {
        testCases = JSON.parse(data);
    } catch (error) {
        process.exit(1);
    }

    const results = [];
    const args = []
    for (let i = 0; i < format.length - 1; i++) {
        args.push(format[i]);
    }

    testCases.forEach((test, index) => {
        const { expected, ...params } = test;
        const testArgs = args.map(arg => params[arg]);
        const result = userCode[functionName](...testArgs); // Assume binarySearch is exported
        const passed = result === expected;
        results.push({ test: test, passed, result, expected });        
        
        // if (result === expected) {
        //     console.error(`✓ Passed: Correct index found -> ${result}`);
        // } else {
        //     console.error(`✗ Failed: Expected ${expected}, but got ${result}`);
        // }
    });

    console.log(JSON.stringify(results));

});
