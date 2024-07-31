import add_button from "@/assets/add_button.jpg";

export default function AddButtonImage({ style }: { style?: React.CSSProperties }) {
  return <img src={add_button.src} className="w-5 h-5 rounded-full lg:w-8 lg:h-8" alt="add button" style={style}/>;
}