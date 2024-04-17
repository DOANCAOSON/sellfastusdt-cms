import { ButtonProps, Button as RTButton } from 'reactstrap'

const Button = (props: ButtonProps) => {
  const { color = 'primary', ...rest } = props
  return <RTButton color={color} {...rest} />
}

export default Button
