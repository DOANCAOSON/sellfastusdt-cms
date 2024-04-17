import Avatar from 'antd/es/avatar'
import Skeleton from 'antd/es/skeleton'
import Tooltip from 'antd/es/tooltip'
import dayjs from 'dayjs'
import Image from '../Image'

import { Link } from 'react-router-dom'

import type { ColumnType, ColumnsType } from 'rc-table/lib/interface'

interface IColProps extends ColumnType<any> {
  note?: string
  filter?: { value: unknown; text: string }[]
  searchable?: boolean
}

const renderBoolean = (value: any) => {
  return value ? (
    <span className='badge bg-primary me-1'>Active</span>
  ) : (
    <span className='badge bg-light me-1'>Inactive</span>
  )
}

const renderStatus = (value: any) => {
  switch (value) {
    case 'NEW':
      return <span className='badge bg-orange-400 me-1'>NEW</span>
    case 'PAID':
      return <span className='badge bg-primary me-1'>PAID</span>
    case 'CANCELLED':
      return <span className='badge bg-red-600 me-1'>CANCELLED</span>
    case 'CONFIRMED':
      return <span className='badge bg-blue-300 me-1'>CONFIRMED</span>
    default:
      return <span className='badge bg-primary me-1'>{value}</span>
  }
}

const renderDate = (value: any) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

const renderImage = (_: unknown, col: Record<string, string>) => {
  if (!col.images) return <Avatar src={'/noavatar.png'} key={'no_image_' + col.id} />
  return (
    <Avatar.Group maxCount={3} className='col-images' maxStyle={{ backgroundColor: '#0bb197' }}>
      {col.images.split(',').map((img, idx) => (
        <Image src={img} key={'image_' + col.id + idx} alt='' />
      ))}
    </Avatar.Group>
  )
}

const renderColor = (value: string) => {
  return value ? <div style={{ height: 24, backgroundColor: value, borderRadius: 50 }}></div> : '-'
}

const renderLink = (value: unknown) => {
  if (value) {
    const { id, label, path } = value as { id: number; label: string; path: string }
    return (
      <Link to={path + '/' + id}>
        <span>{label}</span>
      </Link>
    )
  }
  return '-'
}

const renderSkeleton = () => {
  return <Skeleton.Input active block />
}

export const currencyFormat = (number: number) => {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })
}

const renderPrice = (value: string) => {
  return currencyFormat(+value)
}
const renderValue = (value: any) => {
  if (!value) {
    return '-'
  }

  return <Tooltip title={value}>{`${value}`.length > 50 ? `${value}`.substring(0, 50) + '...' : value}</Tooltip>
}

export const addCustomRender = (columns: ColumnsType<any>, loading = false) => {
  columns.forEach((x: IColProps) => {
    if (x.render) return
    if (loading) {
      x.render = renderSkeleton
      return
    }

    if (x.note === 'render-bool') {
      x.render = renderBoolean
    } else if (x.note === 'render-date') {
      x.render = renderDate
    } else if (x.note === 'render-price') {
      x.render = renderPrice
    } else if (x.note === 'render-img') {
      x.render = renderImage
    } else if (x.note === 'render-color') {
      x.render = renderColor
    } else if (x.note === 'render-status') {
      x.render = renderStatus
    } else if (x.note === 'render-link') {
      x.render = renderLink
    } else {
      x.render = renderValue
    }
  })
}
