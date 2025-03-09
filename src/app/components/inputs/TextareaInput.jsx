export default function TextareaInput({ label, name, value, onChange }) {
    return (
      <div>
        <label>{label}:</label>
        <textarea
          placeholder=""
          name={name} 
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={4}
        />
      </div>
    );
  }
  