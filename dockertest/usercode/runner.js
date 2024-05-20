const fs = require('fs');

// Dynamically import user's JavaScript file
const userCode = require('./userCode');

const testCaseFileName = process.env.TESTCASE_FILENAME;


// Load and parse the test cases JSON file
fs.readFile(`./${testCaseFileName}`, 'utf-8', (err, data) => {
    if (err) {
        console.error("Failed to read test cases:", err);
        return;
    }
    const testCases = JSON.parse(data);
    const results = [];


    testCases.forEach((test, index) => {
        const { array, target, expected } = test;
        const result = userCode.binarySearch(array, target); // Assume binarySearch is exported
        const passed = result === expected;
        results.push({ test: index + 1, passed, result, expected });        
        
        // if (result === expected) {
        //     console.error(`✓ Passed: Correct index found -> ${result}`);
        // } else {
        //     console.error(`✗ Failed: Expected ${expected}, but got ${result}`);
        // }
    });

    console.log(JSON.stringify(results));

});
