import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Convert callback-based functions to Promises
// const writeFile = promisify(fs.writeFile);
// const execPromise = promisify(exec);

export async function POST(req) {
    try {
        const data = await req.json();
        // console.log('Received data:', data);
        const { code, questionId, tests, function_name, format, language } = data;

        const testcases = [];
        for (let i = 0; i < tests.length; i++) {
            testcases.push(tests[i].input);
        }
        // console.log("Testcases: ", testcases);

        if (!code) {
            // console.log('Code not provided');
            return NextResponse.json({ message: 'Code not provided' }, { status: 400 });
        }

        let apiUrl

        if (language == 'python') {
            apiUrl = `${process.env.PYTHON_DOCKER_URL}/run-tests`;
        } else {
            apiUrl = `${process.env.JAVASCRIPT_DOCKER_URL}/run-tests`;

        }


        const dataToSend = {
            usercode: code,
            testCases: tests,
            functionName: function_name,
            format: format
        }
        console.log(dataToSend)

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });
        // const currentDirectory = process.cwd();
        // console.log(testcases, "hello")

        // const codeStoragePath = path.resolve(currentDirectory, 'userCodeStorage', `${questionId}.js`);
        // const testcasesPath = path.resolve(currentDirectory, 'app', 'testcases', `${questionId}.json`);

        // Write the code written by user into a js file
        // await writeFile(codeStoragePath, completeCode);
        // await writeFile(testcasesPath, JSON.stringify(testcases), 'utf8');


        // Define the Docker command
        //Build docker as "usercode"
        // const dockerCommand = `docker run --rm -e FORMAT=${formatData} -e FUNCTION_NAME=${function_name} -e TESTCASE_FILENAME=${questionId}.json -v "${codeStoragePath.replace(/\\/g, '/')}:/usr/src/app/userCode.js" -v "${testcasesPath.replace(/\\/g, '/')}:/usr/src/app/${questionId}.json" usercode node /usr/src/app/runner.js`;

        // Execute the Docker command
        // const { stdout, stderr } = await execPromise(dockerCommand);

        if (!response.ok) {
            throw new Error(`Error with fetching data from docker! Status: ${response.status} ${response.error}`);
        }


        const results = await response.json();


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
        //Hide several sensitive infomation
        const cleanedError = error.message.replace(/\/usr\/src\/app\/[^\s]*/g, '[hidden path]')
        .replace(/Command failed:.*/g, '[hidden command]');
        return NextResponse.json({ message: cleanedError, error: error.message }, { status: 500 });
    }
}