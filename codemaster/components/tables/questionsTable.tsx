"use client";
import Link  from "next/link";
import { useState } from "react";
import completedLogo from "@/assets/completed-mark.jpg";
import attemptedLogo from "@/assets/attempted-mark.jpg";

export default function QuestionsTable(data: any) {
  const questions = data.data;

  const pythonQuestions = questions.filter((question: { language: string; }) => question.language === "Python");
  const javaQuestions = questions.filter((question: { language: string; }) => question.language === "Java");
  const cppQuestions = questions.filter((question: { language: string; }) => question.language === "C++");
  const jsQuestions = questions.filter((question: { language: string; }) => question.language === "JavaScript");
  const [filteredQuestions, setFilteredQuestions] = useState(pythonQuestions);
  const [selectedLanguage, setSelectedLanguage] = useState("Python");

  function createListElement(language: string, questions: any[]) {
    return (
    <li 
      className={`${selectedLanguage === language ? "bg-red-200" : "bg-gray-300"} flex flex-col border-black p-1 rounded-t-lg`} 
      style={{borderWidth: "1px", borderBottom: "none"}}
      onClick={() => selectedLanguage !== language && (setFilteredQuestions(questions), setSelectedLanguage(language))}
      >
        <button className="px-1 pt-1 text-[0.9rem] font-semibold align-middle lg:text-lg">{language}</button>
    </li>
    );
  }
  
  return (
    <div className="flex flex-col w-full max-w-4xl gap-0">
    <ul className="flex flex-row">
      {createListElement("Python", pythonQuestions)}
      {createListElement("C++", cppQuestions)}
      {createListElement("Java", javaQuestions)}
      {createListElement("JavaScript", jsQuestions)}
    </ul> 

    <div className="border-2 border-gray-400">
    <div
    className={`grid 
      grid-cols-[1.1fr_4.5fr_1.5fr_1.1fr]
      lg:grid-cols-[0.8fr_6.5fr_1.2fr_1.1fr] 
      w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.8rem] lg:text-base font-semibold`
    }
    style={{backgroundColor: '#f0f0f0'}}>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Status</div>
    <div className="pl-1 lg:pl-4" style={{ borderRight: '1px solid rgb(156 163 175)', textAlign: 'left'}}>Title</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Difficulty</div>
    <div>Points</div>
    </div>
    
    {filteredQuestions.map((entry: any, index: number) => {
      const color = entry.difficulty === "Easy" 
      ? "text-green-500" 
      : entry.difficulty === "Medium" 
      ? "text-yellow-500" 
      : entry.difficulty === "Hard" 
      ? "text-red-400" 
      : "text-gray-400";
      const link = `/questions/${entry.id}`;
      return <div
      key={index}
      className={`grid 
        grid-cols-[1.1fr_4.5fr_1.5fr_1.1fr] 
        lg:grid-cols-[0.8fr_6.5fr_1.2fr_1.1fr] 
        w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.7rem] lg:text-sm`
      }
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid rgb(156 163 175)'
      }}>
      <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>
      {entry.status === "Completed" 
      ? <img src={completedLogo.src} alt="Completed" className="w-4 lg:w-8"/>
      : entry.status === "Attempted" 
      ? <img src={attemptedLogo.src} alt="Attempted" className="w-4 lg:w-8"/>
      : <div className="text-gray-400">-</div>}
      </div>
    <div 
    className="pl-1 cursor-pointer hover:text-blue-500 hover:leading-8 hover:font-medium lg:pl-4"
    style={{ 
      borderRight: '1px solid rgb(156 163 175)', 
      textAlign: 'left'
    }}>
    <Link href={link}>{entry.title}</Link>
    </div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)', fontWeight: "600" }}>{
      <div className={color}>{entry.difficulty}</div>
    }</div>
    <div>{entry.points}</div>
    </div>
  })}
  </div>
  </div>
);
};