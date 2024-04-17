import Table from 'rc-table'
import { ColumnType, ColumnsType, DefaultRecordType } from 'rc-table/lib/interface'
import { Key } from 'react'
import Checkbox from '../Checkbox'

interface IProps {
  value: DefaultRecordType[]
  columns?: ColumnsType<DefaultRecordType>
  onChange?: (value: DefaultRecordType[]) => void
}

const Permissions = (props: IProps) => {
  const { value, columns = [], onChange } = props

  const onChangePermissions = (checked: boolean, record: DefaultRecordType, key?: Key) => {
    Object.assign(value.find((x) => x.key === record.key) || {}, { [key as string]: checked })
    onChange?.(value)
  }

  columns.forEach((c: ColumnType<DefaultRecordType>) => {
    if (c.key === 'collection') return
    c.render = (val: boolean, record: DefaultRecordType) => (
      <Checkbox
        className={c.align}
        checked={val}
        defaultChecked={val}
        onChange={(evt) => onChangePermissions(evt.target.checked, record, c.key)}
      />
    )
  })

  return (
    <div className='dataTable-container'>
      <div className='dataTable'>
        <Table scroll={{ x: true }} columns={columns} data={value} />
      </div>
    </div>
  )
}

export default Permissions
