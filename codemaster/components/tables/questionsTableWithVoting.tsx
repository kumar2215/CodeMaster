"use client";
import Link  from "next/link";
import { useState } from "react";
import completedLogo from "@/assets/completed-mark.jpg";
import attemptedLogo from "@/assets/attempted-mark.jpg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function QuestionsTable(data: any) {
  const questions = data.data;

  const pythonQuestions = questions.filter((question: { language: string; }) => question.language === "Python");
  const javaQuestions = questions.filter((question: { language: string; }) => question.language === "Java");
  const cppQuestions = questions.filter((question: { language: string; }) => question.language === "C++");
  const jsQuestions = questions.filter((question: { language: string; }) => question.language === "JavaScript");
  const [filteredQuestions, setFilteredQuestions] = useState(pythonQuestions);
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const router = useRouter();

  function createListElement(language: string, questions: any[]) {
    return (
    <li 
      className={`${selectedLanguage === language ? "bg-red-200" : "bg-gray-300"} flex flex-col border-black p-1 rounded-t-lg`} 
      style={{borderWidth: "1px", borderBottom: "none"}}
      onClick={() => selectedLanguage !== language && (setFilteredQuestions(questions), setSelectedLanguage(language))}
      >
        <button className="px-1 pt-1 text-lg font-semibold align-middle">{language}</button>
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
    style={{
      display: 'grid',
      gridTemplateColumns: '0.8fr 5.2fr 1.2fr 1.1fr 1.1fr',
      width: '100%',
      maxWidth: '56rem',
      minHeight: '2rem',
      lineHeight: '2rem',
      textAlign: 'center',
      alignItems: 'center',
      fontSize: '1rem',
      fontWeight: '600',
      backgroundColor: '#f0f0f0'
    }}>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Status</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)', textAlign: 'left', paddingLeft: '1rem'}}>Title</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Difficulty</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>Points</div>
    <div>Voting</div>
    </div>
    
    {filteredQuestions.map((entry: any, index: number) => {
      const color = entry.difficulty === "Easy" 
      ? "text-green-500" 
      : entry.difficulty === "Medium" 
      ? "text-yellow-500" 
      : entry.difficulty === "Hard" 
      ? "text-red-400" 
      : "text-gray-400";
      const questionlink = `/questions/${entry.id}`;
      const votinglink = `/voting/${entry.freestyle_id}`;
      const redirection = () => {
        if (entry.voted_alr && entry.voting_status === "Open") {
          toast.info("You have already voted for this question.", {autoClose: 3000});
        } else {
          router.push(votinglink);
        }
      }
      return <div
      key={index}
      style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 5.2fr 1.2fr 1.1fr 1.1fr',
        width: '100%',
        maxWidth: '56rem',
        minHeight: '2rem',
        lineHeight: '2rem',
        textAlign: 'center',
        alignItems: 'center',
        fontSize: '0.875rem',
        fontWeight: '400',
        backgroundColor: 'white',
        borderTop: '1px solid rgb(156 163 175)'
      }}>
      <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>
      {entry.status === "Completed" 
      ? <img src={completedLogo.src} alt="Completed" width={0.6 * completedLogo.width}/>
      : entry.status === "Attempted" 
      ? <img src={attemptedLogo.src} alt="Attempted" width={0.6 * attemptedLogo.width}/>
      : <div className="text-gray-400">-</div>}
      </div>
    <div 
    className="cursor-pointer hover:text-blue-500 hover:leading-8 hover:font-medium"
    style={{ 
      borderRight: '1px solid rgb(156 163 175)', 
      textAlign: 'left', 
      paddingLeft: '1rem'
    }}>
    {entry.voting_status === "Open"
    ? <Link href={questionlink}>{entry.title}</Link>
    : <Link href={votinglink}>{entry.title}</Link>}
    </div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)', fontWeight: "600" }}>{
      <div className={color}>{entry.difficulty}</div>
    }</div>
    <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>{entry.points}</div>
    <div
    className={`font-semibold ${entry.voting_status === "Open" ? "text-green-500" : "text-red-400"} cursor-pointer`}
    >
      <button onClick={redirection}>{entry.voting_status.toUpperCase()}</button>
    </div>
    </div>
  })}
  </div>
  </div>
);
};