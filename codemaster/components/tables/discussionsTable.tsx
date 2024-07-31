"use client";
import { createClient } from "@/utils/supabase/client";
import VerifyPassword from "@/components/buttons/VerifyPassword";
import convertDate from "@/app/utils/dateConversion/convertDateV1";
import Link from "next/link";

export default function DiscussionsTable(data: any) {

  const discussions: any[] = data.discussions;
  discussions.sort((d1, d2) => new Date(d2.created_at).getTime() - new Date(d1.created_at).getTime());

  const updateViews = async (index: number) => {
    const supabase = createClient();

    discussions[index].views += 1;
    const res = await supabase.from("Discussions")
        .update({views: discussions[index].views})
        .eq("id", discussions[index].id)

    if (res.error) { console.error(res.error) }
  }

  return (
      <div className="w-full max-w-4xl border-2 border-gray-400" suppressHydrationWarning={true}>
        <div
          className={`grid 
            grid-cols-[1.4fr_4.5fr_1.6fr_1.1fr_1.1fr]
            lg:grid-cols-[1.8fr_5.2fr_1.2fr_1fr_1fr] 
            w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.8rem] lg:text-base font-semibold`
          }
          style={{backgroundColor: '#f0f0f0'}}>
          <div className="px-1 overflow-x-auto text-nowrap" style={{borderRight: '1px solid rgb(156 163 175)'}}>Created on</div>
          <div className="pl-1 lg:pl-4" style={{borderRight: '1px solid rgb(156 163 175)', textAlign: 'left'}}>Title</div>
          <div className="px-1 overflow-x-auto text-nowrap" style={{borderRight: '1px solid rgb(156 163 175)'}}>Created by</div>
          <div>Posts</div>
          <div style={{borderLeft: '1px solid rgb(156 163 175)'}}>Views</div>
        </div>

        {discussions.map((entry: any, index: number) => {
          const link = `/forum/discussion/${entry.id}`
          return <div
              key={index}
              className={`grid 
                grid-cols-[1.4fr_4.5fr_1.6fr_1.1fr_1.1fr]
                lg:grid-cols-[1.8fr_5.2fr_1.2fr_1fr_1fr] 
                w-full max-w-4xl lg:min-h-8 lg:leading-8 text-center items-center text-[0.7rem] lg:text-sm`
              }
              style={{
                backgroundColor: 'white',
                borderTop: '1px solid rgb(156 163 175)'
              }}>
            <div 
            className="px-1 overflow-x-auto text-nowrap" 
            style={{borderRight: '1px solid rgb(156 163 175)'}}>
              {convertDate(entry.created_at)}
            </div>
            {entry.password_hash === null
            ? <div
              className="pl-1 cursor-pointer lg:pl-4 hover:text-blue-500 hover:font-medium"
              style={{
                borderRight: '1px solid rgb(156 163 175)',
                textAlign: "left"
              }}>
                <Link href={link} onClick={() => updateViews(index)}>{entry.title}</Link>
              </div>
            : <VerifyPassword 
              table="Discussions" id={entry.id} link={link} btnText={entry.title}
              promptText="Enter the password for this discussion: "
              className="pl-1 cursor-pointer lg:pl-4 hover:text-blue-500 hover:font-medium"
              style={{
                borderRight: '1px solid rgb(156 163 175)',
                textAlign: "left"
              }}/>}
            <div 
            className="px-1 overflow-x-auto text-nowrap" 
            style={{borderRight: '1px solid rgb(156 163 175)'}}>
              {entry.created_by}
            </div>
            <div>{entry.posts}</div>
            <div style={{borderLeft: '1px solid rgb(156 163 175)'}}>{entry.views}</div>
          </div>
        })}
      </div>
  );
}