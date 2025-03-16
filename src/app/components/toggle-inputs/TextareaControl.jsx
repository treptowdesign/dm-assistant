import { useRef, useEffect } from "react";
import { simpleMarkdownToHtml } from "@/app/lib/markdown";

export default function TextareaInput({ label, name, value, onChange, isEditing }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Adjust to new height
    }
  }, [value, isEditing]);

  return (
    <div>
      <label>{label}:</label>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          style={{ width: "400px", resize: "none", overflow: "hidden" }}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={1}
        />
      ) : (
        <div style={{ width: "400px", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          <div dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(value || "") }} />
        </div>
      )}
    </div>
  );
}
