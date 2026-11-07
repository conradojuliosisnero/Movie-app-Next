export function CategoryTabs({ categories, value, onChange }) {
  return (
    <div className="tn-tabs" role="tablist">
      {categories.map((c) => (
        <button key={c} role="tab" aria-selected={c === value} className={"tn-tab" + (c === value ? " is-active" : "")} onClick={() => onChange(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
