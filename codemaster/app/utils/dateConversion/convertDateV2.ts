
export default function convertDate(timeString: string) {
  const date: string = new Date(timeString).toDateString();
  let time: string = new Date(timeString).toLocaleTimeString('en-US');
  time = time.split(":").slice(0, 2).join(":") + " " + time.split(" ")[1].toLowerCase();
  return date + ", " + time;
}
