import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cancelToken, getFetchClient } from '../../helper-plugin'
import { useAppStore } from '../../store/app-store'
import { useTableStore } from './table-store'

import Notification from 'antd/es/notification'
import Button from '../Button'
import DataRow from './DataRow'
import Filter from './Filter'

import './dataTable.scss'
type Props = { title: ReactNode; uid: string; ssr?: boolean }

const ExportControl = (props: { onExport: () => Promise<void> }) => {
  const [isExporting, setIsExporting] = useState(false)

  const onExportHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsExporting(true)
    props.onExport().finally(() => setIsExporting(false))
  }

  return (
    <Button disabled={isExporting} color='info' onClick={onExportHandler}>
      Export
    </Button>
  )
}

const DataTable = (props: Props) => {
  const fetchClient = getFetchClient()
  const setLoading = useTableStore((store) => store.setLoading)
  const onSetDataSource = useTableStore((store) => store.onSetDataSource)
  const onRemoveRow = useTableStore((store) => store.onRemoveRow)
  const layouts = useAppStore((store) => (store.layouts?.has(props.uid) ? store.layouts?.get(props.uid) : null))
  const isMounted = useRef(false)
  const [api, contextHolder] = Notification.useNotification()
  const location = useLocation()

  if (!layouts || !layouts.list) {
    return <></>
  }

  useEffect(() => {
    const source = cancelToken()
    if (isMounted.current) return
    setLoading(true)
    fetchClient.get(`/${props.uid}/find` + location.search, { cancelToken: source.token }).then(({ data }) => {
      onSetDataSource?.(data)
    })
    isMounted.current = true
    return () => {
      source.cancel()
      isMounted.current = false
    }
  }, [props.uid, location.search])

  const handleDelete = (id: number) => {
    if (!id) return
    fetchClient
      .del(`${props.uid}/${id}`)
      .then(() => {
        api['success']({ message: 'Success', description: `Deleted item successful.` })
        onRemoveRow?.(id)
      })
      .catch(() => {
        api['error']({ message: 'Error', description: 'Error! An error occurred. Please try again later' })
      })
  }

  const handleExport = async () => {
    try {
      const res = await fetchClient.export(`${props.uid}/export`)
      // create file link in browser's memory
      const href = URL.createObjectURL(res.data)

      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', `export-${Math.floor(Date.now() / 1000)}.xlsx`)
      document.body.appendChild(link)
      link.click()

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    } catch {
      api['error']({ message: 'Error', description: 'Error! An error occurred. Please try again later' })
    }
  }

  return (
    <div className='dataTable-container'>
      {contextHolder}
      <div className='info'>
        <h1>{props.title}</h1>
        {layouts.exportable && <ExportControl onExport={handleExport} />}
        {layouts.creatable && (
          <Link to={`/${props.uid}/new`}>
            <Button color='success'>Add New</Button>
          </Link>
        )}
      </div>
      {layouts.filterable && <Filter filterable={layouts.filterable} />}
      <div className='dataTable'>
        <DataRow columns={layouts.list} uid={props.uid} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default DataTable
