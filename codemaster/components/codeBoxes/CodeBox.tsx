import CodeBlock from "@/components/codeBoxes/CodeBlock";

function placeInCodeBox(code: string, language: string, colorTheme: string) {
  const lines = code.split("\n");
  let lastLine = lines.length - 1;
  while (lines[lastLine].trim() === "") lastLine--;

  return (
    <div className='flex w-full max-w-4xl p-2 m-2 font-mono bg-gray-100 rounded-lg shadow-md'>
    {/* Line Numbers */}
    <div className="flex flex-col items-end pr-2 text-gray-500 border-r border-gray-300">
    {lines.map((line: string, index: number) => (
      index <= lastLine &&
      <span key={index} className="text-sm lg:text-base text-end">
      {index+1}
      </span>
    ))}
    </div>
    
    {/* Code Snippet */}
    <CodeBlock language={language.toLowerCase()} value={code} colorTheme={colorTheme} />
    </div>
  );
}

export default placeInCodeBox;