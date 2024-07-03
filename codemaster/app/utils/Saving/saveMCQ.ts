import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default async function saveMCQ(
  data: any, 
  selectedOption: number
) {
  const part: string = data.part;
  const username: string = data.username;
  const partOfCompetition: any = data.partOfCompetition;

  let competition: string = partOfCompetition.type;
  let competitionId: string = partOfCompetition.id;
  const questionNumber: number = partOfCompetition.questionNumber;
  const totalQuestions: number = partOfCompetition.totalQuestions;
  
  if (!selectedOption) {
    toast(`Please select an option before saving.`, {type: "warning", autoClose: 3000});
    return;
  }
  
  const supabase = createClient();
  
  const res = await supabase.from("Users").select("*").eq("username", username);
  if (res.error) { console.error(res.error); }

  let competitionsDone: any[];
  if (competition === "Contests") {
    competitionsDone = res.data && res.data[0].contests_done;
  } else {
    competitionsDone = res.data && res.data[0].tournaments_done;
  }
  
  competitionsDone = competitionsDone ? competitionsDone : [];
  
  const index = competitionsDone.findIndex(
    (competition: { id: string }) => competition.id === competitionId);

  if (index !== -1) {
    competitionsDone[index].questions[questionNumber - 1][part] = {
      type: "MCQ",
      selectedOption,
      status: "Attempted"
    }
  }

  else {
    const competitionDone: any = {
      id: competitionId,
      questions: Array.from({length: totalQuestions}, () => ({})),
      status: "Attempted"
    };
    competitionDone.questions[questionNumber - 1][part] = {
      type: "MCQ",
      selectedOption,
      status: "Attempted"
    }
    competitionsDone.push(competitionDone);
  }
    
  const res3 = await supabase.from("Users")
    .update(
      competition === "Contests" 
      ? {contests_done: competitionsDone} 
      : {tournaments_done: competitionsDone})
    .eq("username", username);

  if (res3.error) { 
    console.error(res3.error); 
    toast(`Something went wrong when saving. Please try again.`, {type: "error", autoClose: 3000});
  } else {
    toast(`Question saved.`, {type: "success", autoClose: 3000});
  }

};