export default function CheckboxControl({ label, name, checked, onChange, isEditing }) {
    return (
      <div>
        <label>{label}:</label>
        {isEditing ? (
          <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(name, e.target.checked)} />
        ) : (
          <span>{checked ? 'Yes' : 'No'}</span>
        )}
        
      </div>
    );
  }
  