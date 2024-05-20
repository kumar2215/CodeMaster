const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');



app.use(express.json()); // Middleware to parse JSON bodies

const currentDirectory = process.cwd();

app.get('/', (req, res) => {
    const code = req.body.code;
    const question = req.body.question;

    //ENV variable -> tells docker what is the testcase file name to look out for. 2 volumes to 
    const dockerCommand = `docker run --rm -e TESTCASE_FILENAME=${question}.json -v "${currentDirectory.replace(/\\/g, '/')}/userCode.js:/usr/src/app/userCode.js" -v "${currentDirectory.replace(/\\/g, '/')}/binarysearch.json:/usr/src/app/${question}.json" usercode node /usr/src/app/runner.js`;

    if (!code) {
        return res.status(400).send("cant find code");
    }

    const completeCode = `${code}\nmodule.exports = { binarySearch };`;

    //write the code written by user into a js file
    fs.writeFile('userCode.js', completeCode, (err) => {
        if (err) {
            return res.status(500).send('Failed to save the code');
        }

        // Execute the Docker command
        exec(dockerCommand, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).send(`Error: ${error.message}`);
            }
            if (stderr) {
                return res.status(500).send(`Stderr: ${stderr}`);
            }

            // stdout contains the console.log JSON output from runner.js
            console.log(`Docker command output:\n${stdout}`);  // Log the raw output

            let results;
            try {
                results = JSON.parse(stdout); // Parse the JSON output
                console.log(results, stdout)
            } catch (parseError) {
                return res.status(500).send('Failed to parse test results');
            }

            // Check for any failed tests
            const failedTests = results.filter(result => !result.passed);
            if (failedTests.length > 0) {
                return res.status(200).send({
                    message: "Some tests failed",
                    details: failedTests
                });
            } else {
                return res.status(200).send({
                    message: "All tests passed",
                    details: results
                });
            }
        });
    });
    
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
