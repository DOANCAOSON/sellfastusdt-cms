import { ObservableObject } from '@legendapp/state'
import { observer, useObservable } from '@legendapp/state/react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ChangeEvent, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Form, FormGroup, Label, Row } from 'reactstrap'
import { parseQs, updateQs } from '../../helper-plugin'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Input from '../Input'
import RangePicker from '../RangePicker'
import Select from '../Select'

dayjs.extend(utc)

interface IFilterBase {
  form: ObservableObject<Record<string, any>>
  type: string
  name: string
  placeholder: string
  enum?: string[]
  target?: string
  onRefresh?: () => void
}

const FilterInput = observer((props: IFilterBase) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.form[props.name].set(e.target.value)
  }

  return (
    <Input
      className='form-control'
      name={props.name}
      value={props.form[props.name].get() || ''}
      placeholder={props.placeholder}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter') {
          props.onRefresh?.()
        }
      }}
      onChange={onChange}
    />
  )
})

const FilterControl = observer((props: IFilterBase) => {
  switch (props.type) {
    case 'string':
      return <FilterInput {...props} />
    case 'boolean':
      return (
        <Checkbox
          checked={props.form[props.name].get() === 'true'}
          onChange={(evt) => props.form[props.name].set(`${evt.target.checked}`)}
        />
      )
    case 'date':
      return (
        <RangePicker values={props.form[props.name].get()} onChange={(values) => props.form[props.name].set(values)} />
      )
    case 'relation':
      return (
        <Select
          type='relation'
          mode='multiple'
          optionTarget={props.target || ''}
          placeholder={props.placeholder}
          value={props.form[props.name].get()}
          onChange={(values) => props.form[props.name].set(values)}
        />
      )
    case 'enumeration':
      return (
        <Select
          type='enumeration'
          placeholder={props.placeholder}
          enum={props.enum || []}
          value={props.form[props.name].get()}
          onChange={(values) => props.form[props.name].set(values)}
        />
      )
    default:
      return <></>
  }
})

const Filter = (props: { filterable: Array<any> }) => {
  if (!props.filterable || props.filterable.length === 0) {
    return <></>
  }

  const cleared = useRef(true)
  const navigate = useNavigate()
  const form = useObservable<Record<string, any>>({})

  useEffect(() => {
    const qs = parseQs()
    Object.keys(qs).forEach((k) => {
      if (Array.isArray(qs[k])) {
        form[k].set(Array.from(qs[k] as any).map((x) => x))
      } else {
        form[k].set(qs[k])
      }
      cleared.current = false
    })
  }, [])

  const updateSearch = (search: string) => {
    navigate({ pathname: location.pathname, search }, { replace: true })
  }

  const onRefresh = () => {
    form['page'].set(1)
    const search = updateQs(form.peek())
    if (search !== location.search.slice(1)) {
      updateSearch(search)
      cleared.current = false
    }
  }

  const onClear = () => {
    if (cleared.current) return
    Object.keys(form.peek()).forEach((k) => {
      form[k].set(undefined)
    })
    updateSearch(updateQs(form.peek()))
    cleared.current = true
  }

  return (
    <Form className='filter-form' noValidate>
      {props.filterable.map((r, idx) => (
        <Row key={idx}>
          {r.map((c: { label: string; placeholder: string; name: string; size: string; type: string }, i: number) => (
            <Col key={i} sm={c.size}>
              <FormGroup className='mb-3'>
                <Label htmlFor={c.name}>{c.label}</Label>
                <FilterControl {...c} form={form} onRefresh={onRefresh} />
              </FormGroup>
            </Col>
          ))}
        </Row>
      ))}
      <Row>
        <Col lg={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button color='light' type='button' onClick={onClear} children='Clear' style={{ marginRight: 16 }} />
          <Button type='button' onClick={onRefresh} children='Refresh' />
        </Col>
      </Row>
    </Form>
  )
}

export default Filter
