import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default async function saveMCQ(
  data: any, 
  selectedOption: number
) {

  const questionId: string = data.questionId;
  const partId: string = data.partId;
  const username: string = data.username;
  const part: string = data.part;
  const partOfCompetition: any = data.partOfCompetition;

  let competition: string = partOfCompetition.type;
  let competitionId: string = partOfCompetition.id;

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
    
  let competitionDone: any = {};
  let questionDone: any = {};
  let partDone: any = {};

  if (index !== -1) {
    competitionDone = competitionsDone[index];
    console.log(competitionDone);
    const index2 = competitionDone.questions.findIndex((q : any) => q.id === questionId);
    if (index2 !== -1) {
      const questionDone = competitionDone.questions[index2];
      const index3 = questionDone.parts.findIndex((p: any) => p.partId === partId);
      if (index3 !== -1) {
        const partDone = questionDone.parts[index3];
        partDone.selectedOption = selectedOption;

        questionDone.parts[index3] = partDone;
      } 
    
      else {
        partDone = {
          part: part,
          partId: partId,
          type: "MCQ",
          selectedOption: selectedOption,
          status: "Attempted"
        };
        questionDone.parts.push(partDone);
      }

      competitionDone.questions[index2] = questionDone;
    }
  
    else {
      questionDone = {
        id: questionId,
        parts: [
          {
            part: part,
            partId: partId,
            type: "MCQ",
            selectedOption: selectedOption,
            status: "Attempted"
          }
        ]
      };
      competitionDone.questions.push(questionDone);
    }

    competitionsDone[index] = competitionDone;
  }

  else {
    competitionDone = {
      id: competitionId,
      questions: [
        {
          id: questionId,
          parts: [
            {
              part: part,
              partId: partId,
              type: "MCQ",
              selectedOption: selectedOption,
              status: "Attempted"
            }
          ]
        }
      ],
      status: "Attempted"
    };
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