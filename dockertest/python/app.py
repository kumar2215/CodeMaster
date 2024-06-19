from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World11!'

@app.route('/run-tests', methods=['POST'])
def run_tests():
    data = request.get_json()
    test_cases = data.get('testCases')
    function_name = data.get('functionName')
    format_args = data.get('format')
    user_code = data.get('usercode')

    if not (test_cases and function_name and format_args and user_code):
        return jsonify({'error': 'Missing required parameters'}), 400

    try:

        print(user_code)

        func_def = exec(user_code, globals())

        results = []
        for test in test_cases:
            print(test)
            expected = test['input']['expected']
            #Keep all fields except 'expected' field 
            params = {key: value for key, value in test['input'].items() if key != 'expected'}
            test_args = [params[arg] for arg in format_args]
            print(test_args)

            # Call the dynamically created function with test arguments
            if function_name in globals():
                result = globals()[function_name](*test_args)
                passed = result == test['input']['expected']
                results.append({'test': test['input'], 'passed': passed, 'result': result, 'expected': test['input']['expected']})

                # results.append({'test': params, 'passed': passed, 'result': result, 'expected': test['input']['expected']})
            else:
                raise Exception(f"Function '{function_name}' not found in globals()")

        return jsonify(results), 200

    except Exception as e:
        error_message = f'Error creating or calling function: {str(e)}'
        print(error_message)
        return jsonify({'error': f'{str(e)} Failed to run tests'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
