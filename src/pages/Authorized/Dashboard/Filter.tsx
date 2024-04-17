import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import qs from 'qs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Form, FormGroup, Row } from 'reactstrap'
import Button from '../../../components/Button'
import RangePicker from '../../../components/RangePicker'
import Select from '../../../components/Select'
import { updateQs } from '../../../helper-plugin'

dayjs.extend(customParseFormat)

const OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Month To Date', 'Custom']

const DATE_FORMAT = 'YYYY-MM-DD'

const TIME_RANGES: Record<string, [string, string]> = {
  'Last 7 Days': [dayjs().subtract(6, 'day').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  'Last 30 Days': [dayjs().subtract(29, 'day').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  'Month To Date': [dayjs().startOf('month').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  Custom: ['', '']
}

const checkRangeValid = (dates: [string, string]) => {
  return dates && dates.every((d) => dayjs(d).isValid())
}

const initialValue = () => {
  const query = qs.parse(location.search.slice(1))
  const dates = query.date as [string, string]
  if (checkRangeValid(dates)) {
    return { selected: OPTIONS[OPTIONS.length - 1], dates }
  }

  return { selected: OPTIONS[0], dates: TIME_RANGES[OPTIONS[0]] }
}

const Filter = () => {
  const navigate = useNavigate()
  const [state, setState] = useState(initialValue())

  useEffect(() => {
    if (location.href.search('[?&]date') === -1) {
      navigate(`${location.pathname}?` + updateQs({ date: state.dates }))
    }
  }, [])

  const handleDateChange = (selected: string) => setState({ selected, dates: TIME_RANGES[selected] })

  const handleRangeChange = (values: [string, string]) => {
    const from = dayjs(values[0])
    const to = dayjs(values[1])
    if (from.isBefore(to)) {
      setState({ dates: values, selected: OPTIONS[OPTIONS.length - 1] })
    }
  }

  const onRefresh = () => navigate(`${location.pathname}?` + updateQs({ date: state.dates }))

  const isDisabled = state.selected === OPTIONS[OPTIONS.length - 1] && state.dates.some((x) => !x)
  return (
    <Form className='filter filter-form' noValidate>
      <FormGroup className='form-group'>
        <Row id='date-range'>
          <Col md={3}>
            <Select
              type='enumeration'
              defaultActiveFirstOption
              value={state.selected}
              enum={OPTIONS}
              placeholder='Select date'
              onChange={handleDateChange}
            />
          </Col>
          <Col md={4}>
            <RangePicker onChange={handleRangeChange} values={state.dates} />
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'end' }} className='mt-3'>
          <Button type='button' onClick={onRefresh} disabled={isDisabled}>
            Refresh
          </Button>
        </div>
      </FormGroup>
    </Form>
  )
}

export default Filter
