export default function NumberControl({ label, name, value, onChange, isEditing }) {
    return (
      <div>
        <label>{label}:</label>
        {isEditing ? (
          <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(name, Number(e.target.value))}
        />
        ) : (
          <span>{value}</span>
        )}
        
      </div>
    );
  }
  