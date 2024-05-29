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
        const { code, questionId, testcases, function_name, format } = data;

        if (!code) {
            console.log('Code not provided');
            return NextResponse.json({ message: 'Code not provided' }, { status: 400 });
        }
        const currentDirectory = process.cwd();
        console.log(testcases, "hello")

        const completeCode = `${code}\nmodule.exports = { ${function_name} };`;
        const codeStoragePath = path.resolve(currentDirectory, 'userCodeStorage', `${questionId}.js`);
        const testcasesPath = path.resolve(currentDirectory, 'app', 'testcases', `${questionId}.json`);

        // Write the code written by user into a js file
        await writeFile(codeStoragePath, completeCode);

        await writeFile(testcasesPath, JSON.stringify(testcases), 'utf8');


        // Ensure the paths are correct
        // console.log('Code storage path:', codeStoragePath);
        // console.log('Test case path:', testcasesPath);

        // Define the Docker command
        //Build docker as "usercode"
        const formatData = format.join(',')
        const dockerCommand = `docker run --rm -e FORMAT=${formatData} -e FUNCTION_NAME=${function_name} -e TESTCASE_FILENAME=${questionId}.json -v "${codeStoragePath.replace(/\\/g, '/')}:/usr/src/app/userCode.js" -v "${testcasesPath.replace(/\\/g, '/')}:/usr/src/app/${questionId}.json" usercode node /usr/src/app/runner.js`;

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
        console.log('Caught error:', error.message, "hellokid");
        //Hide several sensitive infomation
        const cleanedError = error.message.replace(/\/usr\/src\/app\/[^\s]*/g, '[hidden path]')
        .replace(/Command failed:.*/g, '[hidden command]');
        return NextResponse.json({ message: cleanedError, error: error.message }, { status: 500 });
    }
}