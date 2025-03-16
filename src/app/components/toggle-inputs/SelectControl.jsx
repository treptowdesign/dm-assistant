export default function SelectControl({ label, name, value, options, onChange, isEditing }) {
    return (
      <div>
        <label>{label}:</label>
        {isEditing ? (
          <select name={name} value={value} onChange={(e) => onChange(name, e.target.value)}>
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
            </select>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  }
  