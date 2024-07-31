"use client";
import editIcon from "@/assets/editting-icon.jpg";

export default function EditButton({ editingMode, setEditingMode } : any) {

  const edit = () => {
    setEditingMode(!editingMode);
  };

  return (
    <div>
      <button onClick={edit} className="">
        <img alt="edit" title="edit" src={editIcon.src} className="w-3 h-3 mt-3 lg:mt-2 lg:w-5 lg:h-5"/>
      </button>
    </div>
  );
}