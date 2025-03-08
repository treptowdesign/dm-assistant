export default function CheckboxInput({ label, name, checked, onChange }) {
    return (
      <div>
        <label>{label}:</label>
        <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(name, e.target.checked)} />
      </div>
    );
  }
  