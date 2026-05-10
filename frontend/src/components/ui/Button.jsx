function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  )
}

export default Button
