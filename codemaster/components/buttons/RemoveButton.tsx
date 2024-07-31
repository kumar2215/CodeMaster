import remove_btn from "@/assets/remove_button.jpg";

export default function RemoveButton({ remove, style }: { remove: () => void, style?: React.CSSProperties }) {
  return (
    <button type="button" onClick={() => remove()} style={style}>
      <img src={remove_btn.src} className="w-5 h-5 rounded-full lg:w-6 lg:h-6" alt="remove button" />
    </button>
  );
}