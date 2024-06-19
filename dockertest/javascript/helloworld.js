const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');


app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/run-tests', (req, res) => {
  const { testCases, functionName, format, usercode } = req.body;

  if (!testCases || !functionName || !format || !usercode) {
      return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
      // Extract the function body from usercode (assuming usercode is a string)
      const functionBody = usercode.slice(usercode.indexOf('{') + 1, usercode.lastIndexOf('}'));

      // console.log(functionBody)
      // Construct the function using arguments (if any) and function body
      const userFunction = format ? new Function(...format, functionBody) : new Function(functionBody);
      console.log('Running javascript code!')
      const results = [];

      testCases.forEach((test, index) => {
          const { expected, ...params } = test['input'];
          const testArgs = format.map(arg => params[arg]);

          // Call the dynamically created function with test arguments
          const result = userFunction(...testArgs);
          const passed = result === expected;

          //Only return the input part of test!!!
          results.push({ test : test['input'], passed, result, expected });
      });

      // Return results as JSON response
      console.log(results)
      console.log(results);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(results));

  } catch (error) {
      console.error('Error creating or calling function:', error);
      res.status(500).json({ error: `${error} Failed to run tests` });
  }
});


// Start the server
app.listen(port,'0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
  } else {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  }
});