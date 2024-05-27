import Navbar from "../../utils/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const thisLink = "/problemset";

function parser(code: string) { // for Python code
  const lines = code.split("\n");
  const brackets = ["(", ")", "{", "}", "[", "]"];
  const specialCharacters = brackets.concat([":", ","]);
  const blueKeywords = [
    "and", "class", "def", "False", "global", "in", "is", "lambda",
    "None", "nonlocal", "not", "or", "True"];
  const purpleKeywords = [
    "as", "assert", "break", "continue", "del", "if", "else", "elif",
    "except", "finally", "for", "from", "import", "pass", "raise", "return",
    "try", "while", "with", "yield", "self", "cls"];
  const yellowKeywords = [
    "abs", "aiter", "all", "anext", "any", "ascii", "bin", "bool", "breakpoint", 
    "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex",
    "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter",
    "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help",
    "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list",
    "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open",
    "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set",
    "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple",
    "type", "vars", "zip"
  ];
  const greenKeywords = ["int", "float", "str", "bool", "list", "tuple", "set", "dict"];
  return (
    <div className="pl-4">
      {lines.map((line: string, index: number) => {
        let indent = 0;
        line.split("    ").forEach((part: string) => {if (part === "") {indent++;}});
        let newLine = line;
        for (let i = 0; i < specialCharacters.length; i++) {
          newLine = newLine.replaceAll(specialCharacters[i], ` ${specialCharacters[i]} `);
        }
        const tokens = newLine.split(" ");
        return (
        <div key={index} className={`flex flex-row`} >
          {
            tokens.map((token: string, index: number) => {
              let color = "text-black";
              if (blueKeywords.includes(token)) {color = "text-blue-600";}
              else if (purpleKeywords.includes(token)) {color = "text-purple-600";}
              else if (greenKeywords.includes(token)) {color = "text-green-600";}
              else if (yellowKeywords.includes(token)) {color = "text-yellow-600";}
              else if (brackets.includes(token)) {color = "text-red-600";}
              return (
                <span key={index} className={`${color} 
                ${specialCharacters.includes(token) || specialCharacters.includes(tokens[index+1])? "" : "pr-2"}`}>{token}</span>
              );
            })
          }
        </div>);
      })}
    </div>
  );
}

function placeInCodeBox(code: string) {
  const indents = code.split("\n");

  return (
    <div className="flex bg-gray-100 p-2 m-2 rounded-lg shadow-md font-mono leading-loose">
      {/* Line Numbers */}
      <div className="flex flex-col items-end pr-2 border-r border-gray-300 text-gray-500">
        {indents.map((indent: string, index: number) => (
          <span key={index} className="text-base text-end leading-loose">
          {index+1}
          </span>
        ))}
      </div>

      {/* Code Snippet */}
      {parser(code)}
    </div>
  );
}

export default async function Question({params: {id}}: {params: {id: string}}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: question, error: err } = await supabase.from("Questions").select(`*`).eq("id", id);
  if (err) { console.error(err); }
  const questionData = question && question[0];

  // testing actual links
  // questionData.source = {
  //   link: true,
  //   src: "https://leetcode.com/problems/maximum-product-of-three-numbers/"
  // }

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      {Navbar(thisLink)}
      <div className="w-full max-w-5xl bg-slate-50 p-3 border-4">
        <div className="text-2xl font-bold min-h-10">Question: {questionData.title}</div>
        <div className="text-lg text-gray-500 min-h-10">{questionData.context}</div>
        {placeInCodeBox(questionData.code)}
        { questionData.source.link
        ? <div className="text-lg font-medium leading-10">
          <p>source: 
          <a 
            href={questionData.source.src}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 hover:underline cursor-pointer px-2"
          >{questionData.source.src}</a>
          </p>
          </div>
        : <div className="text-lg font-medium leading-10">source: {questionData.source.src}</div>
        }
      </div>
    </div>
  );
}