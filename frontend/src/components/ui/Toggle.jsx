function Toggle({ checked = false, onChange, label }) {
  return (
    <button
      aria-label={label}
      aria-pressed={checked}
      className={`toggle ${checked ? 'is-on' : ''}`}
      type="button"
      onClick={onChange}
    >
      <span />
    </button>
  )
}

export default Toggle
