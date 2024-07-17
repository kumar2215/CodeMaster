"use client";
import editIcon from "@/assets/editting-icon.jpg";

export default function EditButton({ editingMode, setEditingMode } : any) {

  const edit = () => {
    setEditingMode(!editingMode);
  };

  return (
    <div>
      <button onClick={edit} className="">
        <img alt="edit" title="edit" src={editIcon.src} className="w-5 h-5 mt-2"/>
      </button>
    </div>
  );
}