// import { createClient } from '@supabase/supabase-js';
// import { NextApiRequest, NextApiResponse } from 'next';



// export default async function GET(req: NextApiRequest, res: NextApiResponse){
//     console.log(req.query)
//     const { id } = req.query;    
//     const supabase = createClient();
    
//     const { data, error } = await supabase
//       .from('FreeCode')
//       .select('question, inputs, points,')
//       .eq('id', searchParams); // Filter where id equals searchParams;
  
//     if (error) {
//       console.error('Error fetching data:', error);
//       return;
//     }
//     console.log('Fetched data:', data);

// }