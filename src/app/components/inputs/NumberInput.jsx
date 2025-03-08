export default function NumberInput({ label, name, value, onChange }) {
    return (
      <div>
        <label>{label}:</label>
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value === "" ? undefined : Number(e.target.value))}
        />
      </div>
    );
  }
  