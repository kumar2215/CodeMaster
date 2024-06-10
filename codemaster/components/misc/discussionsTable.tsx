"use client";
import {createClient} from "@/utils/supabase/client";
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

  const convertDate = (timeString: string) => {
    const date: string = new Date(timeString).toLocaleDateString();
    let time: string = new Date(timeString).toLocaleTimeString();
    time = time.split(":").slice(0, 2).join(":") + " " + time.split(" ")[1].toLowerCase();
    return date + ", " + time;
  }

  return (
      <div className="w-full max-w-4xl border-2 border-gray-400" suppressHydrationWarning={true}>
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 5.2fr 1.2fr 1fr 1fr',
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
          <div style={{borderRight: '1px solid rgb(156 163 175)'}}>Created on</div>
          <div style={{borderRight: '1px solid rgb(156 163 175)', textAlign: 'left', paddingLeft: '1rem'}}>Title</div>
          <div style={{borderRight: '1px solid rgb(156 163 175)'}}>Created by</div>
          <div style={{borderRight: '1px solid rgb(156 163 175)'}}>Posts</div>
          <div>Views</div>
        </div>

        {discussions.map((entry: any, index: number) => {
          const link = `/forum/discussion/${entry.id}`
          return <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 5.2fr 1.2fr 1fr 1fr',
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
            <div style={{borderRight: '1px solid rgb(156 163 175)'}}>{convertDate(entry.created_at)}</div>
            <div
            className="hover:text-blue-500 hover:leading-8 hover:font-medium cursor-pointer"
            style={{
              borderRight: '1px solid rgb(156 163 175)',
              textAlign: "start",
              paddingLeft: "1rem"
            }}>
              <Link href={link} onClick={() => updateViews(index)}>{entry.title}</Link>
            </div>
            <div style={{borderRight: '1px solid rgb(156 163 175)'}}>{entry.created_by}</div>
            <div style={{borderRight: '1px solid rgb(156 163 175)'}}>{entry.posts}</div>
            <div>{entry.views}</div>
          </div>
        })}
      </div>
  );
}