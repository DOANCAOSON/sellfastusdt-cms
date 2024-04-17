import { ObservableObject } from '@legendapp/state'
import { observer, useObservable } from '@legendapp/state/react'
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JSX } from 'react/jsx-runtime'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Row
} from 'reactstrap'
import { cancelToken, getFetchClient } from '../../helper-plugin'

import type { UploadFile } from 'antd/es/upload/interface'
import type { InputType } from 'reactstrap/types/lib/Input'
import Notification from 'antd/es/notification'
import Skeleton from 'antd/es/skeleton'
import dayjs from 'dayjs'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Currencies from '../Currencies'
import Forbidden from '../Forbidden'
import ImageInput from '../ImageInput'
import Input from '../Input'
import OrdersProducts from '../OrdersProducts'
import Permissions from '../Permissions'
import Select from '../Select'
import RichTextEditor from '../FormEditor/RichTextEditor'
import { useAppStore } from '../../store/app-store'
import { debounce } from 'debounce'
import { Space } from 'antd'

interface IFormBase {
  form: ObservableObject<Record<string, any>>
  errors: ObservableObject<Record<string, any>>
}

interface IFormInput extends IFormBase {
  name: string
  placeholder: string
  label: string
  mode: string
  required: boolean
  size: number
  targetField: string
  type: string
  dependOnValue: string
  target: string
  enum: string[]
  dependOn: string
  relations: string[]
  disabled: boolean
  object: string
  max: number
  min: number
  skipRequiredEdit?: boolean
  regex?: [string, string]
  reges?: {
    message: string
    value: [string, string]
  }[]
}

const validationMessage = {
  required: 'This field is required.',
  invalid: 'Value is not valid.'
}

const toSlug = (str: string) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A')
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/Đ/g, 'D')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
  str = str.replace(/\u02C6|\u0306|\u031B/g, '')
  return str
    .replace(/  +/g, '-')
    .replace(/ /g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')
    .toLowerCase()
}

const validateOnChange = (value: any, props: IFormInput) => {
  const length = `${value}`.length
  props.form[props.name].set(value)
  props.errors[props.name].set(undefined)
  if (props.errors[props.name].get() === validationMessage.required && length > 0) {
    props.errors[props.name].set(undefined)
  }
  if (length === 0 && props.required) {
    props.errors[props.name].set(validationMessage.required)
  }
}

const checkDisabled = (props: IFormInput) => {
  let isDisabled = false
  if (props.disabled) {
    isDisabled = true
  } else if (props.dependOn) {
    isDisabled = props.form['isSubmit'].get() || !props.form[props.dependOn].get()
  } else {
    isDisabled = props.form['isSubmit'].get()
  }

  return isDisabled
}

const validateForm = (values: Record<string, any>, layouts: Array<Record<string, any>>) => {
  const errors: Record<string, string> = {}
  let isValid = true
  layouts.forEach((row) => {
    row.forEach((item: IFormInput) => {
      const isEmpty = !values[item.name] || `${values[item.name]}`.trim().length === 0
      if (!isEmpty) {
        if (item.regex) {
          const regex = new RegExp(item.regex[0], item.regex[1])
          if (!regex.test(values[item.name])) {
            errors[item.name] = validationMessage.invalid
            isValid = false
          }
        }
        if (item.reges) {
          item.reges.forEach((regex) => {
            const { value, message } = regex
            const regexInput = new RegExp(value[0], value[1])
            if (regexInput.test(values[item.name])) {
              errors[item.name] = message
              isValid = false
            }
          })
        }
      } else {
        if (!item.required) return

        if (values.isEdit && item.skipRequiredEdit) return

        errors[item.name] = validationMessage.required
        isValid = false
      }
    })
  })

  return { isValid, errors }
}

const FormInputRelative = observer((props: IFormInput) => {
  let isError = props.errors[props.name].get()?.length > 0
  const getValue = () => {
    const value = (props.form[props.name].get() || '') as string
    return value
  }
  const bin = props.form[props.dependOnValue].get()
  const accountNumber = props.form[props.dependOnValue].get()

  const onChange = debounce(() => {
    if (bin && accountNumber) {
      fetch('https://api.vietqr.io/v2/lookup', {
        headers: {
          'x-client-id': '9110153a-34b1-4a2b-badb-16160d5850b6',
          'x-api-key': 'bb44afd0-6fe9-43e1-abd5-b4ac15996148',
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({
          bin: props.form[props.dependOnValue].get(),
          accountNumber: props.form[props.dependOn].get()
        })
      })
        .then((x) => x.json())
        .then((data) => {
          props.form[props.name].set(data.data.accountName)
          props.errors[props.name].set(undefined)
        })
        .catch(console.error)
    }
  }, 1000)

  useEffect(() => {
    onChange()
  }, [bin, accountNumber])

  const type = (!new RegExp(/string|uid/).test(props.type) ? props.type : 'text') as InputType

  return (
    <Input
      type={type}
      className='form-control'
      name={props.name}
      value={getValue()}
      placeholder={props.placeholder}
      invalid={isError}
      // disabled={isDisabled}
      maxLength={props.max}
      min={props.min}
    />
  )
})

const FormInput = observer((props: IFormInput) => {
  let isError = props.errors[props.name].get()?.length > 0
  const getValue = () => {
    const value = (props.form[props.name].get() || '') as string
    if (props.type === 'uid' && props.targetField) {
      const targetField = toSlug(props.form[props.targetField].get() || '')
      if (targetField) {
        props.form[props.name].set(targetField)
        props.errors[props.name].set(undefined)
        isError = false
      }
      return targetField
    }
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
    return value
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = props.type === 'number' ? Number(e.target.value) : e.target.value
    validateOnChange(val, props)
  }

  const type = (!new RegExp(/string|uid/).test(props.type) ? props.type : 'text') as InputType

  const isDisabled = checkDisabled(props)

  return (
    <Input
      type={type}
      className='form-control'
      name={props.name}
      value={getValue()}
      placeholder={props.placeholder}
      onChange={onChange}
      invalid={isError}
      disabled={isDisabled}
      maxLength={props.max}
      min={props.min}
    />
  )
})

const FormImagesInput = observer((props: IFormInput) => {
  const [open, setOpen] = useState<string>('-1')
  const values = (props.form[props.name].get() as UploadFile[]) || []

  const toggle = (id: SetStateAction<string>) => {
    if (open === id) {
      setOpen('-1')
    } else {
      setOpen(id)
    }
  }

  const isDisabled = props.dependOn
    ? props.form['isSubmit'].get() || !props.form[props.dependOn].get()
    : props.form['isSubmit'].get()

  const aProps = { open, toggle }
  return (
    <Accordion {...aProps}>
      <AccordionItem>
        <AccordionHeader targetId='1'>Add/Remove Images</AccordionHeader>
        <AccordionBody accordionId='1'>
          <ImageInput
            max={props.max}
            images={values}
            onChange={(val) => validateOnChange(val, props)}
            disabled={isDisabled}
          />
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
})

const FormSelect = observer((props: IFormInput) => {
  const type = props.type === 'relation' ? 'relation' : 'enumeration'
  const isError = props.errors[props.name].get()?.length > 0
  const isDisabled = checkDisabled(props)
  const [values, setValues] = useState<Array<any>>()

  const otherProps = { type, enum: props.enum, values, setValues } as any
  if (type === 'relation') {
    otherProps['optionTarget'] = props.target
  }

  return (
    <Select
      mode={props.mode === 'tags' ? undefined : 'multiple'}
      autocomplete={props.mode === 'autocomplete' ? true : undefined}
      className='form-control'
      placeholder={props.placeholder}
      value={props.form[props.name].get()}
      onChange={(val: any) => {
        validateOnChange(val, props)
        if (props.relations && values) {
          props.relations.forEach((rel: string) => {
            const idx = values.findIndex((x: any) => x.value === val)
            if (idx !== -1) {
              props.form[rel].set(values[idx][props.object])
            }
          })
          otherProps['enum'] = props.relations
        }
      }}
      status={isError ? 'error' : undefined}
      disabled={isDisabled}
      {...otherProps}
    />
  )
})

const FormNetworkInput = observer((props: IFormInput) => {
  const isError = props.errors[props.name].get()?.length > 0
  const isDisabled = checkDisabled(props)
  const [values, setValues] = useState<Array<any>>()
  const [select, setSelect] = useState<{ value: string; slug: string; id: string }>()
  const [address, setAddress] = useState<string>()
  const [inputs, setInputs] = useState<{ address: string; network: string }[]>([])

  const otherProps = { type: 'relation', enum: props.enum, values, setValues } as any
  otherProps['optionTarget'] = props.target

  return (
    <div>
      <Space.Compact>
        <Select
          mode={undefined}
          className='form-control'
          placeholder='Network'
          value={select?.slug}
          onChange={(val: any) => {
            if (values) {
              const idx = values?.findIndex((x: any) => x.value === val)
              setSelect(values[idx])
            }
          }}
          status={isError ? 'error' : undefined}
          disabled={isDisabled}
          {...otherProps}
        />
        <Input
          type='text'
          className='form-control'
          name={props.name}
          value={address}
          disable={select}
          placeholder={props.placeholder}
          onChange={(e) => {
            if (select) {
              const { value } = select
              const val = e.target.value
              if (!new RegExp(value).test(val.trim())) {
                props.errors[props.name].set(validationMessage.invalid)
              } else {
                setAddress(val)
                props.errors[props.name].set(undefined)
              }
            }
          }}
          invalid={isError}
          disabled={isDisabled}
          maxLength={props.max}
          min={props.min}
        />
        <Button
          color='primary'
          onClick={() => {
            if (select && address) {
              setInputs((prev) => [...prev, { address, network: select.value, networkId: select.id }])
              setSelect(undefined)
              setAddress(undefined)
              props.form[props.name].set([...inputs, { address, network: select.value, networkId: select.id }])
            } else {
              alert('Bạn chưa nhập địa chỉ hoặc địa chỉ không hợp lệ!')
            }
          }}>
          Add
        </Button>
      </Space.Compact>
      {inputs.map((i) => (
        <p>
          {i.address}/{i.network}
        </p>
      ))}
    </div>
  )
})

const FormControl = observer((props: IFormInput) => {
  switch (props.type) {
    case 'string':
    case 'uid':
    case 'number':
    case 'textarea':
    case 'password':
      return <FormInput {...props} />
    case 'editor':
      return (
        <RichTextEditor
          {...props}
          data={props.form[props.name].get()}
          onChange={(value) => props.form[props.name].set(value)}
        />
      )
    case 'enumeration':
      return <FormSelect {...props} />
    case 'relation':
      return <FormSelect {...props} />
    case 'input-relative':
      return <FormInputRelative {...props} />
    case 'boolean':
      return (
        <Checkbox
          checked={props.form[props.name].get()}
          disabled={props.form['isSubmit'].get()}
          onChange={(evt) => props.form[props.name].set(evt.target.checked)}
        />
      )
    case 'images':
      return <FormImagesInput {...props} />
    case 'table':
      return (
        <Permissions
          {...props}
          value={props.form[props.name].get()}
          onChange={(value) => props.form[props.name].set(value)}
        />
      )
    case 'networks':
      return <FormNetworkInput {...props} />
    case 'currencies':
      return (
        <Currencies
          {...props}
          value={props.form[props.name].get()}
          onChange={(value) => props.form[props.name].set(value)}
        />
      )
    case 'orders-products':
      return <OrdersProducts {...props} value={props.form[props.name].get()} />
    default:
      return <></>
  }
})

const FormItem = observer((props: IFormInput) => {
  return (
    <Col sm={props.size}>
      <div className='mb-3'>
        <Label htmlFor={props.name}>
          {props.label}
          {props.required ? <span className='required'>*</span> : ''}
        </Label>
        <FormControl {...props} />
        <FormItemError errors={props.errors} name={props.name} />
      </div>
    </Col>
  )
})

const FormItemError = observer((props: { errors: ObservableObject<Record<string, any>>; name: string }) => {
  if (props.errors[props.name].get()?.length > 0) {
    return <div className='error'>{props.errors[props.name].get()}</div>
  }
  return null
})

const SubmitItem = observer((props: IFormBase & { onSubmit: () => void }) => {
  const isSubmit = props.form['isSubmit'].get()
  return (
    <ul className='pager wizard twitter-bs-wizard-pager-link'>
      <li className='next'>
        <Button type='button' onClick={props.onSubmit} children='Submit' disabled={isSubmit} />
      </li>
    </ul>
  )
})

const FormLoading = (props: { edit: Array<Record<string, any>> }) => {
  return props.edit.map((row, idx) => {
    return (
      <Row key={idx}>
        {row?.map((item: JSX.IntrinsicAttributes & IFormInput) => (
          <Col key={item.name} sm={item.size}>
            <div className='mb-3'>
              <Label htmlFor={item.name}>
                {item.label}
                {item.required ? <span className='required'>*</span> : ''}
              </Label>
              <Skeleton.Input active block />
            </div>
          </Col>
        ))}
      </Row>
    )
  })
}

const bindErrorMessage = (data: { message: string[] }) => {
  const errorObject = {} as Record<string, string>
  for (const errorMessage of data.message) {
    const [field, message] = errorMessage.split(': ')
    errorObject[field] = message
  }
  return errorObject
}

const FormBasic = (props: { uid: string; notify: boolean; layouts: ILayouts }) => {
  const { edit, displayName, defaultValue, editable = true } = props.layouts
  const [notFound, setNotFound] = useState<boolean>(false)
  const emitSocket = useAppStore((store) => store.emitSocket)
  const [loading, setLoading] = useState(location.pathname.split('/').pop() !== 'new')
  const [api, contextHolder] = Notification.useNotification()
  const form = useObservable<Record<string, any>>()
  const formErrors = useObservable<Record<string, any>>({})
  const navigate = useNavigate()
  const fetchClient = getFetchClient()
  const lastPath = location.pathname.split('/').pop()

  useEffect(() => {
    const token = cancelToken()
    if (lastPath !== 'new') {
      form.isSubmit.set(true)
      fetchClient
        .get(`${props.uid}/${lastPath}`, { cancelToken: token.token })
        .then(({ data }) => {
          form.set(data)
          form.isEdit.set(true)
        })
        .catch(() => setNotFound(true))
        .finally(() => {
          setLoading(false)
          form.isSubmit.set(false)
        })
    } else {
      form.set(JSON.parse(JSON.stringify(defaultValue)))
    }
    return () => {
      Object.keys(form.peek()).forEach((k) => {
        form[k].delete()
      })
      token.cancel()
    }
  }, [props.uid])

  if (notFound) {
    return <Forbidden />
  }

  const doSubmit = () => {
    const { isSubmit, ...values } = form.peek()
    if (isSubmit) {
      return
    }
    // validate form
    const { isValid, errors } = validateForm(values, edit)
    if (!isValid) {
      formErrors.set(errors)
    } else {
      form.isSubmit.set(true)
      const isEdit = lastPath !== 'new'
      const label = isEdit ? 'Update' : 'Create'
      //  submit form
      delete values.isEdit
      const action = isEdit
        ? fetchClient.patch(`${props.uid}/${lastPath}`, values)
        : fetchClient.post(props.uid, values)
      action
        .then(({ data }) => {
          formErrors.set({})
          api['success']({ message: 'Success', description: `${label} item successful.` })
          if (!isEdit) {
            navigate(`/${props.uid}/${data.id}`, { replace: true })
          } else {
            emitSocket(props.uid, data)
            if (props.layouts.notify) {
              const body = {
                userId: data.userId,
                url: `https://sellfastusdt.com/transaction/${data.type?.toLowerCase()}?transactionID=${data.id}`,
                content: `Your transaction ${data.code} has been updated, please check again`,
                image: data.image,
                isRead: false,
                text: 'Transaction successfully updated!'
              }
              emitSocket('notifies', body)
            }
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            const errors = bindErrorMessage(error.response.data)
            formErrors.set(errors)
            api['error']({ message: 'Error', description: `${label} item unsuccessful.` })
          } else {
            api['error']({ message: 'Error', description: `${label} item unsuccessful.` })
          }
        })
        .finally(() => form.isSubmit.set(false))
    }
  }

  return (
    <Container className='form-basic-container' fluid={true}>
      {contextHolder}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row className='mb-5'>
                <Col sm={6}>
                  <Button color='secondary' children='Back' style={{ width: 100 }} onClick={() => navigate(-1)} />
                </Col>
                <Col sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
                  <h4 className='card-title mb-4'>{displayName} Form</h4>
                </Col>
              </Row>
              <div id='basic-pills-wizard' className='twitter-bs-wizard'>
                <Form>
                  {loading ? (
                    <FormLoading edit={edit} />
                  ) : (
                    <>
                      {edit.map((row, idx) => {
                        return (
                          <Row key={idx}>
                            {row?.map((item: JSX.IntrinsicAttributes & IFormInput) => {
                              return <FormItem {...item} key={item.name} form={form} errors={formErrors} />
                            })}
                          </Row>
                        )
                      })}
                    </>
                  )}
                </Form>
                {editable && <SubmitItem form={form} errors={formErrors} onSubmit={doSubmit} />}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default FormBasic
