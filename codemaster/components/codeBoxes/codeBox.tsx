import Parser from "@/app/utils/parser";

function placeInCodeBox(code: string, language: string) {
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
    <Parser code={code} language={language} />
    </div>
  );
}

export default placeInCodeBox;