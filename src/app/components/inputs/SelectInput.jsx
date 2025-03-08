export default function SelectInput({ label, name, value, options, onChange }) {
    return (
      <div>
        <label>{label}:</label>
        <select name={name} value={value} onChange={(e) => onChange(name, e.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }
  