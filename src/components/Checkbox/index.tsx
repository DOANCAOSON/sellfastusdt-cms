import AntCheckbox, { CheckboxChangeEvent, CheckboxProps } from 'antd/es/checkbox'
import classname from 'classnames'
import { useEffect, useState } from 'react'
import './checkbox.scss'

const Checkbox = (props: CheckboxProps) => {
  const { checked: value, onChange, ...rest } = props
  const [checked, setChecked] = useState(value)

  useEffect(() => {
    if (value !== checked) setChecked(value)
  }, [value])

  const onChecked = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked)
    onChange?.(e)
  }

  return (
    <AntCheckbox
      {...rest}
      prefixCls={classname(rest.prefixCls, 'detail-checkbox')}
      checked={checked}
      onChange={onChecked}
    />
  )
}

export default Checkbox
