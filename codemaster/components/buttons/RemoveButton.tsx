import remove_btn from "@/assets/remove_button.jpg";

export default function RemoveButton({ remove, style }: { remove: () => void, style?: React.CSSProperties }) {
  return (
    <button type="button" onClick={() => remove()} style={style}>
      <img src={remove_btn.src} className="w-6 h-6 rounded-full" alt="remove button" />
    </button>
  );
}