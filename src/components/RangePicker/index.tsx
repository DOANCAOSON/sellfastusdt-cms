import DatePicker from 'antd/es/date-picker'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import { RangeValue } from 'rc-picker/lib/interface'
dayjs.extend(utc)
dayjs.extend(customParseFormat)

const { RangePicker: AntPicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'

const RangePicker = (props: {
  values?: [string, string]
  onChange: (values: [string, string]) => void
  disabled?: boolean
}) => {
  const onChange = (_: RangeValue<Dayjs>, formatted: [string, string]) => {
    props.onChange(formatted)
  }

  const getValues = (): RangeValue<Dayjs> => {
    const initial: RangeValue<Dayjs> = [null, null]
    initial[0] = props.values && props.values[0] ? dayjs(props.values[0], dateFormat) : null
    initial[1] = props.values && props.values[1] ? dayjs(props.values[1], dateFormat) : null

    return initial
  }

  return (
    <AntPicker
      value={getValues()}
      className='range-picker-container'
      popupClassName='range-picker'
      format={dateFormat}
      disabled={props.disabled}
      onChange={onChange}
    />
  )
}

export default RangePicker
