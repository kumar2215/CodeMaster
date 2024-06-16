"use server"

import { createClient } from '@supabase/supabase-js';
import upload from './upload';



const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function formatTimestamptzFromEpoch(epochTimeSeconds: number): string {
    const isoString = new Date(epochTimeSeconds).toISOString();
    return isoString
}

export async function uploadTournament(questions: any[], deadlineEpoch: number, createdBy: string) {
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

