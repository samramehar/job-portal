import * as React from "react"

export const Checkbox = React.forwardRef(({ id, checked, onCheckedChange, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      id={id}
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      {...props}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  )
})
