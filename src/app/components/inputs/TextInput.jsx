export default function TextInput({ label, name, value, onChange }) {
    return (
      <div>
        <label>{label}:</label>
        <input name={name} value={value} onChange={(e) => onChange(name, e.target.value)} />
      </div>
    );
  }
  