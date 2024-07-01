
export default function convertDate(timeString: string) {
  const date: string = new Date(timeString).toLocaleDateString();
  let time: string = new Date(timeString).toLocaleTimeString();
  time = time.split(":").slice(0, 2).join(":") + " " + time.split(" ")[1].toLowerCase();
  return date + ", " + time;
}
