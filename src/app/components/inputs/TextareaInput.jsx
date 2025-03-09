import { useRef, useEffect } from "react";

export default function TextareaInput({ label, name, value, onChange }) {
    const textareaRef = useRef(null);
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // reset height 
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // set to new height
      }
    }, [value]);
    return (
      <div>
        <label>{label}:</label>
        <textarea
          ref={textareaRef}
          style={{ width: "400px", resize: "none", overflow: "hidden", }}
          placeholder=""
          name={name} 
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={1}
        />
      </div>
    );
  }
  