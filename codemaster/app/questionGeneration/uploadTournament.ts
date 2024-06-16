import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import upload from './upload';

const envFile = fs.readFileSync("./.env.local").toString();
const lines = envFile.split("\n");
const NEXT_PUBLIC_SUPABASE_URL = lines[0].split("=")[1];
const NEXT_PUBLIC_SUPABASE_ANON_KEY = lines[1].split("=")[1];
const EMAIL = lines[2].split("=")[1];
const PASSWORD = lines[3].split("=")[1];

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatTimestamptzFromEpoch(epochTimeSeconds: number) : string {
    const isoString = new Date(epochTimeSeconds).toISOString();
    return isoString
}

export async function uploadTournament(questions: any[], deadlineEpoch: number, createdBy: string) {

  if (!questions || questions.length === 0) {
    throw new Error('No questions found.');
  }

  const { data, error: err } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD
  });
  if (err) { console.error(err); }

  try {
    if (!deadlineEpoch) {
      throw new Error('Deadline is required.');
    }

    // Ensure deadline is a valid date string
    const deadlineTimestamptz = formatTimestamptzFromEpoch(deadlineEpoch);

    const questionIDs = [];
    console.log(questions)
    for (const question of questions) {
        const id = await upload(question, false);
        console.log(id,'qnid single')
        questionIDs.push(id);
    }

    console.log(questionIDs, 'qnidaray')
    const { data, error } = await supabase
      .from('Tournaments')
      .insert([
        {
          questions: questionIDs, 
          deadline: deadlineTimestamptz,
          created_by: createdBy 
        }
      ])
      .single(); 

    if (error) {
      throw error;
    }

    console.log('Inserted tournament:', data);
    return data; // Return inserted data if needed
  } catch (error) {
    console.error('Error inserting tournament:', error.message);
    throw error;
  }
}

