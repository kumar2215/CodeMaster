"use server";
import { createClient } from "@/utils/supabase/server";

export default async function submitCompetition(data: any) {

  const type: string = data.type;
  const id: string = data.id;
  const field: any = type === "contest" ? "contests_done" : "tournaments_done";
  const field2: any = type === "contest" ? "contest_XP" : "tournament_XP";
  const table: string = type === "contest" ? "Contests" : "Tournaments";
  const username: string = data.username;

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const supabase = createClient();

  const res = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (res.error) { 
    console.error(res.error); 
    return [
      "Something went wrong. Please try again.",
      "error"
    ]
  }
  const competitionData = res.data;
  const answers = competitionData.answers;

  const res2 = await supabase
    .from("Users")
    .select(`${field}, ${field2}`)
    .eq("username", username)
    .single();

  if (res2.error) { 
    console.error(res2.error); 
    return [
      "Something went wrong. Please try again.",
      "error"
    ]; 
  }

  let competition_XP: any = res2.data && res2.data[field2];
  competition_XP = competition_XP ? competition_XP : 0;

  let competitionsDone: any = res2.data && res2.data[field];
  competitionsDone = competitionsDone ? competitionsDone : [];

  const idx = competitionsDone.findIndex((competition: any) => competition.id === id);

  if (idx === -1) {
    return [
      `You have not done any part of this ${type}.
      Make sure to save your progress before submitting.`,
      "error"
    ];
  }

  const competitionDone = competitionsDone[idx];
  const questions = competitionDone.questions;

  let pointsAccumulated: number[] = Array.from({ length: answers.length }, () => 0);
  const userSavedData: any = Array.from({ length: answers.length }, () => ({}));
  
  for (let i = 0; i < answers.length; i++) {

    const question = questions[i];
    const answer = answers[i];
    const parts = Object.keys(answer);
  
    for (let j = 0; j < parts.length; j++) {

      const part = parts[j];
      const partValue = parts.length === 1 ? "" : "part " + part;

      if (!question[part]) {
        return [
          `You have not done or saved question ${i + 1} ${partValue} of this ${type}.
          Make sure to save your progress before submitting.`,
          "error"
        ];
      }

      const questionType = question[part].type;
      let pointsAwarded: number = 0;
      let expected: any;
      let points: any;
      let answeredRight: any;

      switch (questionType) {
        case "MCQ":
          const selectedOption = question[part].selectedOption;
          expected = answer[part].expected;
          points = answer[part].points;
          answeredRight = selectedOption === expected ? "Correct" : "Incorrect";
          pointsAwarded = selectedOption === expected ? points : 0;
          pointsAccumulated[i] += pointsAwarded;

          userSavedData[i][part] = {
            part,
            answered: selectedOption,
            status: answeredRight,
            pointsAccumulated: pointsAwarded
          };
          break;

        case "MRQ":
          const selectedOptions = question[part].selectedOptions;
          expected = answer[part].expected;
          points = answer[part].points;
          answeredRight = [];
          const partialPoints = points / expected.length;

          for (let k = 0; k < selectedOptions.length; k++) {
            if (selectedOptions[k] && expected.includes(k+1)) {
              answeredRight.push("Correct");
              pointsAwarded += partialPoints;
            } else if (!selectedOptions[k] && !expected.includes(k+1)) {
              answeredRight.push("Correct");
            } else {
              answeredRight.push("Incorrect");
            }
          }
          pointsAwarded = Math.round(pointsAwarded);
          pointsAccumulated[i] += pointsAwarded;

          userSavedData[i][part] = {
            part,
            answered: selectedOptions,
            status: answeredRight,
            pointsAccumulated: pointsAwarded
          }
          break;
        
        case "Multiple-Responses":
          const savedInputs = question[part].savedInputs;
          expected = answer[part].expected;
          points = answer[part].points;
          answeredRight = [];

          for (let k = 0; k < savedInputs.length; k++) {
            if (savedInputs[k] === expected[k].toString()) { // need to change this later
              answeredRight.push("Correct");
              pointsAwarded += points[k];
            } else {
              answeredRight.push("Incorrect");
            }
          }
          pointsAccumulated[i] += pointsAwarded;

          userSavedData[i][part] = {
            part,
            answered: savedInputs,
            status: answeredRight,
            pointsAccumulated: pointsAwarded
          };
          break;

        case "Freestyle":
          const code = question[part].savedCode;
          expected = answer[part].expected;
          points = answer[part].points;
          answeredRight = [];

          const questionId = competitionData.questions[i];
          const index = part === "null" ? 0 : part.charCodeAt(0) - "a".charCodeAt(0);

          const res = await supabase.from("Questions").select(`*`).eq("id", questionId).single();
          if (res.error) { 
            console.error(res.error); 
            return [
              "Something went wrong. Please try again.",
              "error"
            ];
          }

          const parts = res.data.parts;
          const partId = parts[index].part_id;

          const res2 = await supabase.from("Freestyle").select("*").eq("id", partId).single();
          if (res2.error) { 
            console.error(res2.error); 
            return [
              "Something went wrong. Please try again.",
              "error"
            ];
          }

          const partData: any = res2.data;
          const language: string = res.data.language.toLowerCase();
          const precode: string = partData.pre_code;
          const postcode: string = partData.post_code;
          const function_name: string = partData.function_name;
          const parameters: any = partData.parameters;
          const inputs: any[] = partData.inputs;
          const testcases: any[] = Array.from({ length: inputs.length }, () => ({}));

          let res3: any;
          for (let k = 0; k < inputs.length; k++) {
            const inputId = inputs[k];

            res3 = await supabase.from("Testcases").select("data").eq("id", inputId).single();    
            if (res3.error) {
              console.error(res3.error);
              return [
                "Something went wrong. Please try again.",
                "error"
              ];
            } 
            testcases[k] = res3.data.data;
          }

          try {
            const response = await fetch(`${SERVER_URL}/api/runCode`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                code,
                precode,
                postcode,
                language,
                parameters,
                function_name,
                testcases
              })
            });

            if (response.ok) {
              const data = await response.json();
              const result = data.results;
  
              if (!result.error) {
                result.forEach((res: any, index: number) => {
                  if (res.actual === res.expected) {
                    answeredRight[index] = "Correct";
                    pointsAwarded += points[index];
                  }
                });
                pointsAccumulated[i] += pointsAwarded;
              }
  
            } else {
              console.error(response.status, response.statusText);
              return [
                "Something went wrong. Please try again.",
                "error"
              ];
            }
          } catch (error) {
            console.error(error);
            return [
              "Something went wrong. Please try again.",
              "error"
            ];
          }
          
          userSavedData[i][part] = {
            part,
            answered: code,
            status: answeredRight,
            pointsAccumulated: pointsAwarded
          };
          break;
      }
    }
  }

  const totalPoints = pointsAccumulated.reduce((a, b) => a + b, 0);
  const submissionData = {
    id,
    questions: userSavedData,
    pointsAccumulated: totalPoints,
    status: "Completed"
  }

  competitionsDone[idx] = submissionData;
  const res4 = await supabase
    .from("Users")
    .update(
      type === "contest" 
      ? {contests_done: competitionsDone, contest_XP: competition_XP + totalPoints} 
      : {tournaments_done: competitionsDone, tournament_XP: competition_XP + totalPoints}
    ).eq("username", username);
  if (res4.error) { 
    console.error(res4.error); 
    return [
      "Something went wrong. Please try again.",
      "error"
    ];
  }

  const res5 = await supabase
    .from(table)
    .select("users_completed")
    .eq("id", id)
    .single();

  if (res5.error) { 
    console.error(res5.error); 
    return [
      "Something went wrong. Please try again.",
      "error"
    ];
  }

  let usersCompleted = res5.data.users_completed;
  usersCompleted = usersCompleted ? usersCompleted : [];
  usersCompleted.push({
    username,
    pointsAccumulated: totalPoints
  })

  const res6 = await supabase
    .from(table)
    .update({users_completed: usersCompleted})
    .eq("id", id);

  if (res6.error) { 
    console.error(res6.error); 
    return [
      "Something went wrong. Please try again.",
      "error"
    ];
  }

  return [
    `${type[0].toUpperCase() + type.slice(1)} submission successful.`,
    "success"
  ];
}