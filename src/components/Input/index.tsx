import { EyeInvisibleFilled } from '@ant-design/icons'
import Button from 'antd/es/button'
import { useState } from 'react'
import { InputGroup, InputGroupText, InputProps, Input as RTInput } from 'reactstrap'

const InputPassword = (props: InputProps) => {
  const [raw, setRaw] = useState(false)
  return (
    <InputGroup>
      <RTInput {...props} type={`${raw ? 'text' : 'password'}`} />
      <InputGroupText>
        <Button prefixCls='raw-button' onClick={() => setRaw(!raw)} icon={<EyeInvisibleFilled />} />
      </InputGroupText>
    </InputGroup>
  )
}

const Input = (props: InputProps) => {
  if (props.type === 'password') {
    return <InputPassword {...props} />
  }
  return <RTInput {...props} />
}

export default Input
