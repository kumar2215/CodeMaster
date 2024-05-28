import React from 'react'
import FreeStylePage from './FreeStylePage'
import { createClient } from "@/utils/supabase/server";


export default async function page () {
  //an example freestyle id taken from parts in Question table. To be passed into props
  const FreestyleID = "73882731-65cc-4cea-a221-95376f7a8d4a"

  //fetching a sample code from the Question table to put into props
  const supabase = createClient();

  const response = await supabase
  .from('Questions')
  .select('code')
  .eq('id', "a25a13dc-1bd6-427a-89ac-8191edf95263"); 

  const code = response.data[0].code

  return (
    <div style={{ width: '60vw' }}>
      {/*Props to pass in 
      1)the id of the freestyle question
      2)Code taken from the Question table in its text form
      */}
      <FreeStylePage FreestyleID={FreestyleID} code={code}/>
    </div>
  )
}
