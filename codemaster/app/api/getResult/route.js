import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Convert callback-based functions to Promises
const writeFile = promisify(fs.writeFile);
const execPromise = promisify(exec);

export async function POST(req) {
    try {
        const data = await req.json();
        console.log('Received data:', data);
        const { code, question } = data;

        if (!code) {
            console.log('Code not provided');
            return NextResponse.json({ message: 'Code not provided' }, { status: 400 });
        }

        const currentDirectory = process.cwd();
        const completeCode = `${code}\nmodule.exports = { binarySearch };`;
        const codeStoragePath = path.resolve(currentDirectory, 'userCodeStorage', `${question}.js`);
        const testCasePath = path.resolve(currentDirectory, 'app', 'testcases', `${question}.json`);

        console.log('Writing code to:', codeStoragePath);
        // Write the code written by user into a js file
        await writeFile(codeStoragePath, completeCode);

        // Ensure the paths are correct
        console.log('Code storage path:', codeStoragePath);
        console.log('Test case path:', testCasePath);

        // Define the Docker command
        const dockerCommand = `docker run --rm -e TESTCASE_FILENAME=${question}.json -v "${codeStoragePath.replace(/\\/g, '/')}:/usr/src/app/userCode.js" -v "${testCasePath.replace(/\\/g, '/')}:/usr/src/app/${question}.json" usercode node /usr/src/app/runner.js`;

        console.log('Executing Docker command:', dockerCommand);
        // Execute the Docker command
        const { stdout, stderr } = await execPromise(dockerCommand);

        if (stderr) {
            console.log('Docker stderr:', stderr);
            return NextResponse.json({ message: 'Docker error', error: stderr }, { status: 500 });
        }

        // stdout contains the console.log JSON output from runner.js
        console.log(`Docker command output:\n${stdout}`);  // Log the raw output

        let results;
        try {
            results = JSON.parse(stdout); // Parse the JSON output
            console.log('Parsed results:', results);
        } catch (parseError) {
            console.log('Failed to parse test results:', parseError.message);
            return NextResponse.json({ message: 'Failed to parse test results', error: parseError.message }, { status: 500 });
        }

        // Check for any failed tests
        const failedTests = results.filter(result => !result.passed);
        if (failedTests.length > 0) {
            console.log('Some tests failed:', failedTests);
            return NextResponse.json({
                message: 'Some tests failed',
                details: failedTests,
            }, { status: 200 });
        } else {
            console.log('All tests passed');
            return NextResponse.json({
                message: 'All tests passed',
                details: results,
            }, { status: 200 });
        }
    } catch (error) {
        console.log('Caught error:', error.message);
        return NextResponse.json({ message: 'Failed to process the request. Is your code free of syntax errors?', error: error.message }, { status: 500 });
    }
}