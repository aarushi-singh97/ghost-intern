function Input({ icon: Icon, className = '', ...props }) {
  return (
    <label className={`input-shell ${className}`.trim()}>
      {Icon ? <Icon size={22} aria-hidden="true" /> : null}
      <input {...props} />
    </label>
  )
}

export default Input
