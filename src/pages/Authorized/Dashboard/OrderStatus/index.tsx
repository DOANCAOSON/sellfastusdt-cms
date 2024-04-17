import Skeleton from 'antd/es/skeleton'
import type { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col } from 'reactstrap'
import { cancelToken, getFetchClient } from '../../../../helper-plugin'

const colorMapping: Record<string, string> = {
  CONFIRMED: '#2ecc71',
  CANCELLED: '#D61B36',
  DUPLICATED: '#FEB019',
  UPSELL: '#1abc9c',
  REDIAL: '#c668ff',
  NEW: '#3d6678'
}

interface ICancelReason {
  series: number[]
  labels: string[]
}

const pieChartOptions: ApexOptions = {
  chart: {
    type: 'pie'
  },
  labels: [''],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  legend: {
    show: true,
    fontSize: '9px',
    position: 'right',
    horizontalAlign: 'center',
    labels: {
      colors: '#919bae',
      useSeriesColors: false
    }
  }
}

const Empty = () => (
  <Col className='empty' style={{ height: 300 }}>
    <h3>No Data</h3>
  </Col>
)

const PieChart = (props: ICancelReason) => {
  if (props.labels.length === 0) return <Empty />
  const { labels, series } = props
  pieChartOptions.labels = labels
  pieChartOptions.colors = labels.map((label, i) => (label === labels[i] ? colorMapping[label] : null))
  return <ReactApexChart options={pieChartOptions as ApexOptions} series={series} type='pie' height={360} />
}

const OrderStatus = () => {
  const token = cancelToken()
  const fetchClient = getFetchClient()
  const { search } = useLocation()
  const [cancelReason, setCancelReason] = useState<ICancelReason | null>(null)

  useEffect(() => {
    if (search.includes('?date')) {
      setCancelReason(null)
      fetchClient.get('/dashboard/transaction-stats' + search, { cancelToken: token.token }).then(({ data }) => {
        setCancelReason({ ...data, loading: false })
      })
    }
    return () => token.cancel()
  }, [search])

  return (
    <Col xl={4}>
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <h5 className='card-title'>Transaction Status</h5>
            </div>
          </div>
          {cancelReason ? (
            <PieChart labels={cancelReason.labels} series={cancelReason.series} />
          ) : (
            <Skeleton.Button active block style={{ height: 360 }} />
          )}
        </CardBody>
      </Card>
    </Col>
  )
}

export default OrderStatus
