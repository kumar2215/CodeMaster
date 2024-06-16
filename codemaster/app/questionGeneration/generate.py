import json
import subprocess
from colorama import Fore

question = {}

def keep_asking(prompt: str, allowed_answers: list) -> str:
    allowed_options = "\nAllowed options: " + ", ".join(allowed_answers) if allowed_answers else ""
    while True:
        answer = input(Fore.GREEN + prompt + allowed_options + "\n")
        if allowed_answers:
            if answer in allowed_answers:
                return answer
            print(Fore.RED + "Invalid entry. Please try again.")
        return answer
        
question["type"] = keep_asking(
    "Enter type of question.", 
    ["Debugging", "Code Understanding", "Code Principles", "Refactoring"]
)

question["title"] = keep_asking(
    "Enter title of question.",
    []
).title()

question["content"] = []
while (new_content := (keep_asking(
    """Add description for question. 
    Use the following format:
        - For regular text, enter it in the format "TEXT, text" where text is the actual text you want to add.
        - For code, enter it in the format "CODE, code" where code is the actual code you want to add.
    Type 'Done' when finished.""",
    []
))) != "Done":
    try:
        value = new_content.split(", ", 1)
        if value[0] == "TEXT" or value[0] == "CODE":
            question["content"].append({
                "value": value[1],
                "category": value[0].lower()
            })
        else:
            print(Fore.RED + "Invalid entry. Please try again.")
    except Exception as e:
        print(e)
        print(Fore.RED + "Invalid entry. Please try again.")
        
question["language"] = keep_asking(
    "Enter the programming language used in the question.",
    ["Python", "C++", "Java", "JavaScript"]
)

question["difficulty"] = keep_asking(
    "Enter the difficulty of the question.",
    ["Easy", "Medium", "Hard"]
)

while (source := (keep_asking(
    """Enter the source for the question. This will be used to give credit to the source.
    Use the following format:
        - If the source is a link, enter it in the format "True, link" where link is the actual link you want to add.
        - Else if the source is generic, enter it in the format "False, source" where source is the actual source you want to add.
        - Or if the source is not available or not willing to be known, enter "None".
    """,
    []
))) != "None" or ("," in source and source.split(", ", 1)[0] not in ["True", "False"]):
    print(Fore.RED +  "Invalid entry. Please try again.")
    
if source == "None":
    question["source"] = {
        "link": False,
        "src": "Anonymous"
    }
else:
    value = source.split(", ", 1)
    question["source"] = {
        "link": eval(value[0]),
        "src": value[1]
    }

parts = []
try:
    while (numOfParts := int(keep_asking(
        """Enter the number of parts the question will have.
        Maximum number of parts is 5.
        Enter -1 if you want to re-enter the number of parts.""",
        [] 
    ))) != -1 and not (1 <= numOfParts <= 5):
        if not (1 <= numOfParts <= 5):
            print(Fore.RED + "Invalid entry. Please try again.")
except ValueError:
    print(Fore.RED + "Invalid entry. Please try again.")
    
parts = [{} for _ in range(numOfParts)]
for part in parts:
    part["question"] = keep_asking(
        "Enter the question for the part.",
        []
    )
    part["questionType"] = keep_asking(
        "Enter the type of question for the part.",
        ["MCQ", "MRQ, Multiple-Responses", "Freestyle"]
    )
    if part["questionType"] == "MCQ" or part["questionType"] == "MRQ":
        part["options"] = []
        while (option := keep_asking(
            """Enter the options for the part.
            Use the following format:
                - For regular text, enter it in the format "TEXT, text" where text is the actual text you want to add.
                - For code, enter it in the format "CODE, code" where code is the actual code you want to add.
            Type 'Done' when finished.""",
            []
        )) != "Done":
            try:
                value = option.split(", ", 1)
                if value[0] == "TEXT" or value[0] == "CODE":
                    part["options"].append({
                        "value": value[1],
                        "category": value[0].lower()
                    })
                else:
                    print(Fore.RED + "Invalid entry. Please try again.")
            except:
                print(Fore.RED + "Invalid entry. Please try again.")
        try:
            while (points := int(keep_asking(
                "Enter the points for the part.",
                []
            ))) <= 0:
                print(Fore.RED + "Invalid entry. Please try again.")
            part["points"] = points
        except ValueError:
            print(Fore.RED + "Invalid entry. Please try again.")
        numOfOptions = len(part["options"])
        if part["questionType"] == "MCQ":
            try:
                part["expected"] = int(keep_asking(
                    "Enter the correct answer for the part.",
                    [str(i) for i in range(1, numOfOptions+1)]
                ))
            except ValueError:
                print(Fore.RED + "Invalid entry. Please try again.")
        else:
            try:
                while (ans := int(keep_asking(
                    """Enter the correct answers for the part individually.
                    Type 'Done' when finished.""",
                    [str(i) for i in range(1, numOfOptions+1)]
                ))) != "Done":
                    part["expected"].append(ans)
            except ValueError:
                print(Fore.RED + "Invalid entry. Please try again.")
    if part["questionType"] == "Multiple-Responses" or part["questionType"] == "Freestyle":
        part["format"] = []
        part["format"]= keep_asking(
            "Enter the arguments for the main function being tested as a comma separated list."
        ).split(", ")
        numOfInputs = None
        while (numOfInputs := int(keep_asking(
            "Enter the number of inputs you want to test for this part.",
            []
        ))) <= 0:
            print(Fore.RED + "Invalid entry. Please try again.")
        part["inputs"] = []
        part["points"] = []
        for _ in range(numOfInputs):
            testcase = {}
            for arg in part["format"]:
                testcase[arg] = keep_asking(
                    f"Enter the value for the argument '{arg}' for test case {_+1}.",
                    []
                )
            testcase["expected"] = keep_asking(
                f"Enter the expected output for test case {_+1}.",
                []
            )
            part["inputs"].append(testcase)
            points = None
            try:
                while (points := int(keep_asking(
                    f"Enter the points for test case {_+1}.",
                    []
                ))) <= 0:
                    print(Fore.RED + "Invalid entry. Please try again.")
                part["points"].append(points)
            except ValueError:
                print(Fore.RED + "Invalid entry. Please try again.")
    if part["questionType"] == "Freestyle":
        part["code"] = keep_asking(
            "Enter the code to be used for this part. Ensure its in the language declared for this question.",
            []
        )
        part["functionName"] = keep_asking(
            "Enter the name of the function being tested.",
            []
        )
if len(parts) == 1:
    parts[0]["part"] = "null"
else:
    letters = ["a", "b", "c", "d", "e"]
    for part in parts:
        part["part"] = letters.pop(0)
question["parts"] = parts

with open("sample.json", "w") as question_file:
    json.dump(question, question_file)
    
OUTER_PATH = f"../../../../Questions/{question['type']}/{question['language']}/{question['title']}.json"
    
if input("""
    Question has been successfully generated and saved in 'sample.json'.
    Please check if the question is correct. Upload the question to the server?
    (y/n)
""") == "y":
    subprocess.run(["ts-node", "upload.ts"])
    try:
        with open(OUTER_PATH, "w") as question_file:
            json.dump(question, question_file)
        print("Question has been saved to the Questions folder.")
    except Exception:
        print("Something went wrong. Question may not have been saved to the Questions folder.")    
        