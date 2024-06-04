import CodeBlock from "@/components/codeBoxes/CodeBlock";

function placeInCodeBox(code: string, language: string) {
  const lines = code.split("\n");
  let lastLine = lines.length - 1;
  while (lines[lastLine].trim() === "") lastLine--;
  const overflow = lines.some((line) => line.length > 105) ? "overflow-x-scroll" : "";

  return (
    <div className={`flex w-full max-w-4xl bg-gray-100 p-2 m-2 rounded-lg shadow-md font-mono ${overflow}`}>
    {/* Line Numbers */}
    <div className="flex flex-col items-end pr-2 border-r border-gray-300 text-gray-500">
    {lines.map((line: string, index: number) => (
      index <= lastLine &&
      <span key={index} className="text-base text-end">
      {index+1}
      </span>
    ))}
    </div>
    
    {/* Code Snippet */}
    <CodeBlock language={language.toLowerCase()} value={code} />
    </div>
  );
}

export default placeInCodeBox;