import Table from 'rc-table'
import { ColumnType, ColumnsType, DefaultRecordType } from 'rc-table/lib/interface'
import Input from '../Input'

interface IProps {
  value: DefaultRecordType[]
  columns?: ColumnsType<DefaultRecordType>
  onChange?: (value: DefaultRecordType[]) => void
}

const Currencies = (props: IProps) => {
  const { value, columns = [], onChange } = props

  const onChangeCurrencies = (record: DefaultRecordType) => {
    Object.assign(value.find((x) => x.currency === record.currency) || {}, record)
    onChange?.([...value])
  }

  const InputField = (props: { record: DefaultRecordType; c: ColumnType<DefaultRecordType> & { max?: number } }) => (
    <Input
      type='number'
      placeholder={`Enter ${props.c.title}`}
      defaultValue={props.record[props.c.dataIndex as string]}
      min={0}
      max={props.c.max}
      className={props.c.align}
      onChange={(evt) => {
        props.record[props.c.dataIndex as string] = Number(evt.target.value)
        onChangeCurrencies(props.record)
      }}
    />
  )

  columns.forEach((c: ColumnType<DefaultRecordType>) => {
    if (c.key === 'currency') return
    if (!c.render) {
      c.render = (_, record) => <InputField c={c} record={record} />
    }
  })

  return (
    <div className='dataTable-container'>
      <div className='dataTable'>
        <Table scroll={{ x: true }} columns={columns} data={value} />
      </div>
    </div>
  )
}

export default Currencies
