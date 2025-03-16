export default function TextInput({ label, name, value, onChange, isEditing }) {
    return (
      <div>
        <label>{label}:</label>
        {isEditing ? (
          <input
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  }
  