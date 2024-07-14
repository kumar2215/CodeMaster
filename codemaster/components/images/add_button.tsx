import add_button from "@/assets/add_button.jpg";

export default function AddButtonImage({ style }: { style?: React.CSSProperties }) {
  return <img src={add_button.src} className="w-8 h-8 rounded-full" alt="add button" style={style}/>;
}