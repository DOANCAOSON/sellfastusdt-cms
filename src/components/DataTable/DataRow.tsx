import Modal from 'antd/es/modal'
import Pagination from 'antd/es/pagination'
import Table from 'rc-table'
import type { ColumnsType, ColumnType } from 'rc-table/lib/interface'
import type { ColumnProps } from 'rc-table/lib/sugar/Column'
import { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateQs } from '../../helper-plugin'
import { useTableStore } from './table-store'
import { addCustomRender } from './util'

const _colsMap = new Map<string, ColumnsType<any>>()
const _dataSourceMap = new Map<string, Array<any>>()

const initLoadingRows = (columns: ColumnsType<any>) => {
  const rows: Array<any> = []
  for (let index = 0; index < 10; index++) {
    const element: Record<string, any> = {}
    columns.forEach((c: ColumnType<any>) => {
      element[c.dataIndex as any] = ''
    })
    element['key'] = index
    rows.push(element)
  }
  return rows
}

const DataPagination = memo(() => {
  const navigate = useNavigate()
  const pagination = useTableStore((store) => store.pagination)
  const onPaginationChange = useTableStore((store) => store.onPaginationChange)

  return (
    <Pagination
      prefixCls='pagination-wrap'
      defaultCurrent={pagination.page}
      defaultPageSize={pagination.pageSize}
      onChange={(page, pageSize) => {
        const sizeChanged = pagination.pageSize !== pageSize
        onPaginationChange?.({ page: sizeChanged ? 1 : page, pageSize, total: pagination.total })
        navigate({ pathname: location.pathname, search: updateQs({ page, pageSize }) }, { replace: true })
      }}
      total={pagination.total}
      pageSizeOptions={[10, 20, 50]}
      showSizeChanger
    />
  )
})

const DeleteRow = (props: { onOk: () => void }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Modal
        className='modal'
        title='Confirm Delete'
        open={open}
        onOk={() => props.onOk()}
        onCancel={() => setOpen(false)}
        centered>
        <span>Are you sure you want to delete?</span>
      </Modal>
      <div className='delete' onClick={() => setOpen(!open)}>
        <img src='/delete.svg' alt='' />
      </div>
    </>
  )
}

const DataRow = (props: { uid: string; columns: ColumnsType<any>; onDelete: (id: number) => void }) => {
  const loading = useTableStore((store) => store.loading)
  const dataSource = useTableStore((store) => store.dataSource)
  const id = `${props.uid}-${loading}`
  let columns: ColumnsType<any> = []

  if (loading) {
    if (_colsMap.has(id)) {
      columns = _colsMap.get(id) || []
    } else {
      const _col = JSON.parse(JSON.stringify(props.columns))
      addCustomRender(_col, loading)
      _colsMap.set(id, _col)
      _dataSourceMap.set(id, initLoadingRows(props.columns))
      columns = _col
    }
  } else {
    if (_colsMap.has(id)) {
      columns = _colsMap.get(id) || []
    } else {
      const actionColumn: ColumnProps<any> = {
        key: 'action',
        title: 'Action',
        align: 'center',
        render: (_, record) => {
          return (
            <div className='action'>
              <Link to={`/${props.uid}/${record.id}`}>
                <img src='/view.svg' alt='' />
              </Link>
              {record.deletable && <DeleteRow onOk={() => props.onDelete(record.id)} />}
            </div>
          )
        }
      }
      const _col = JSON.parse(JSON.stringify(props.columns))
      _col.push(actionColumn)

      addCustomRender(_col, loading)
      _colsMap.set(id, _col)
      columns = _col
    }
  }

  if (columns.length === 0) {
    return <></>
  }

  return (
    <>
      <Table scroll={{ x: true }} columns={columns} data={dataSource || _dataSourceMap.get(id)} />
      <DataPagination />
    </>
  )
}

export default DataRow
