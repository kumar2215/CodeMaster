"use client";
import Link from "next/link";
import completedLogo from "@/assets/completed-mark.jpg";
import attemptedLogo from "@/assets/attempted-mark.jpg";

export default function TournamentsTable(data: any) {

  const tournaments: any[] = data.tournaments;
  tournaments.sort((d1, d2) => new Date(d2.created_at).getTime() - new Date(d1.created_at).getTime());

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
              gridTemplateColumns: '1.2fr 5.2fr 1.2fr 1fr 1fr',
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
          <div style={{borderRight: '1px solid rgb(156 163 175)', textAlign: 'left', paddingLeft: '1rem'}}>Tournament</div>
          <div style={{borderRight: '1px solid rgb(156 163 175)'}}>Created By</div>
          <div style={{borderRight: '1px solid rgb(156 163 175)'}}>Deadline</div>
          <div>Points</div>
        </div>

        {tournaments.map((entry: any, index: number) => {
          const link = `/forum/discussion/${entry.id}` // TODO: change this
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
            <div style={{ borderRight: '1px solid rgb(156 163 175)' }}>
            {entry.status === "Completed" 
            ? <img src={completedLogo.src} alt="Completed" width={0.6 * completedLogo.width}/>
            : entry.status === "Attempted" 
            ? <img src={attemptedLogo.src} alt="Attempted" width={0.6 * attemptedLogo.width}/>
            : <div className="text-gray-400">-</div>}
            </div>
            <Link href={link}>{entry.name}</Link> 
            <div style={{borderRight: '1px solid rgb(156 163 175)'}}>{entry.created_by}</div>
            <div
            className="hover:text-blue-500 hover:leading-8 hover:font-medium cursor-pointer"
            style={{
              borderRight: '1px solid rgb(156 163 175)',
              textAlign: "start",
              paddingLeft: "1rem"
            }}>
            </div>
            <div style={{borderRight: '1px solid rgb(156 163 175)'}}>{convertDate(entry.deadline)}</div>
            <div>{entry.points}</div>
          </div>
        })}
      </div>
  );
}