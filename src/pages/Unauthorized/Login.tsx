import { ObservableObject } from '@legendapp/state'
import { observer, useObservable } from '@legendapp/state/react'
import Notification from 'antd/es/notification'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import logo from '../../assets/images/logo.png'
import { auth, getFetchClient } from '../../helper-plugin'

interface IFormBase {
  form: ObservableObject<Record<string, any>>
  errors: ObservableObject<Record<string, any>>
  onSubmit?: () => void
}

interface IFormInput extends IFormBase {
  size: number
  name: string
  label: string
  required: boolean
  placeholder: string
  type: 'text' | 'password'
}

const validateForm = (value: Record<string, any>) => {
  const errors: Record<string, string> = {}

  if (!value.email || value.email.length <= 0) {
    errors.email = 'This field is required.'
  }
  if (!value.password || value.password.length <= 0) {
    errors.password = 'This field is required.'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

const FormInput = observer((props: IFormInput) => {
  const value = (props.form[props.name].get() || '') as string

  const isError = props.errors[props.name].get()?.length > 0
  return (
    <>
      <Input
        type={props.type}
        className='form-control'
        name={props.name}
        value={value}
        placeholder={props.placeholder}
        onChange={(e) => props.form[props.name].set(e.target.value)}
        invalid={isError}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            props.onSubmit?.()
          }
        }}
      />
      {isError && <FormFeedback type='invalid'>{props.errors[props.name].get()}</FormFeedback>}
    </>
  )
})

const FormItem = observer((props: IFormInput) => {
  return (
    <Col sm={props.size}>
      <div className='mb-3'>
        <Label htmlFor={props.name}>
          {props.label}
          {props.required ? <span className='required'>*</span> : ''}
        </Label>
        <FormInput {...props} />
      </div>
    </Col>
  )
})

const SubmitItem = observer((props: IFormBase & { onClick: () => void }) => {
  const isSubmit = props.form['isSubmit'].get()
  return (
    <div className='d-grid mt-4'>
      <button
        disabled={isSubmit === true}
        className='btn btn-primary waves-effect waves-light'
        type='button'
        onClick={props.onClick}>
        Log In
      </button>
    </div>
  )
})

const FormNotification = observer((props: IFormBase) => {
  const navigate = useNavigate()
  const [api, contextHolder] = Notification.useNotification()

  const redirect = props.form.redirect.get()
  const notification = props.errors.notification.get()
  useEffect(() => {
    if (notification) {
      api['error']({ message: 'Login Failed', description: 'Invalid credentials .' })
    }
    if (redirect) {
      const query = new URLSearchParams(location.search)
      const redirectTo = query.get('redirectTo')
      const redirectUrl = redirectTo ? decodeURIComponent(redirectTo) : '/'

      navigate(redirectUrl, { replace: true })
      navigate(0)
    }
  }, [notification, redirect])

  return <>{contextHolder}</>
})

const Login = () => {
  const form = useObservable<Record<string, any>>({})
  const formErrors = useObservable<Record<string, any>>({})
  const { post } = getFetchClient()

  useEffect(() => {
    document.title = 'Login | sellfastusdt Admin Portal'
    document.body.classList.add('Login')
    return () => {
      document.body.classList.remove('Login')
    }
  })

  const onSubmit = () => {
    const values = form.peek()
    formErrors.notification.set(null)
    // validate form
    const { isValid, errors } = validateForm(values)
    if (!isValid) {
      formErrors.set(errors)
    } else {
      form.isSubmit.set(true)
      post('/auth/sign-in', values)
        .then(({ data }) => {
          const { token, ...userInfo } = data
          auth.setToken(token)
          auth.setUserInfo(userInfo)
          form.redirect.set(true)
        })
        .catch(() => formErrors.notification.set('err'))
        .finally(() => {
          form.isSubmit.set(false)
        })
    }
  }

  return (
    <>
      <FormNotification form={form} errors={formErrors} />
      <div className='bg-overlay'></div>
      <div className='account-pages my-5 pt-5'>
        <Container>
          <Row className='justify-content-center'>
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className='p-4'>
                  <div>
                    <div className='text-center'>
                      <Link to='/'>
                        <img src={logo} alt='' height='24' className='auth-logo logo-dark mx-auto' />
                      </Link>
                    </div>
                    <h4 className='font-size-18 text-muted mt-2 text-center'>Welcome Back Hoang LOng</h4>
                    <p className='mb-5 text-center'>Sign in to continue to sellfastusdt.</p>
                    <Form className='form-horizontal' noValidate>
                      <Row>
                        <Col md={12}>
                          <FormItem
                            label='Email'
                            name='email'
                            required
                            size={12}
                            type='text'
                            placeholder='Enter email'
                            form={form}
                            errors={formErrors}
                            onSubmit={onSubmit}
                          />
                          <FormItem
                            label='Password'
                            name='password'
                            required
                            size={12}
                            type='password'
                            placeholder='Enter password'
                            form={form}
                            errors={formErrors}
                            onSubmit={onSubmit}
                          />

                          <SubmitItem form={form} errors={formErrors} onClick={onSubmit} />
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Login
