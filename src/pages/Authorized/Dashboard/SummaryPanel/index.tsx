import { mdiAccountSupervisor, mdiCart, mdiCash } from '@mdi/js'
import Icon from '@mdi/react'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { cancelToken, getFetchClient } from '../../../../helper-plugin'

interface ISummaryPanel {
  label: string
  value: number
}

const SummaryPanel = () => {
  const { search } = useLocation()
  const fetchClient = getFetchClient()
  const [summary, setSummary] = useState<ISummaryPanel[] | null>(null)

  useEffect(() => {
    if (search.includes('?date')) {
      setSummary(null)
      const source = cancelToken()
      const fetchData = [fetchClient.get('/dashboard/summary' + search, { cancelToken: source.token })]

      Promise.all(fetchData).then(([summaryData]) => {
        const { amount, transaction, user } = summaryData.data
        setSummary([transaction, amount, user])
      })

      return () => source.cancel()
    }
  }, [search])

  if (!summary) return <SummarySkeleton />

  return (
    <Row>
      {summary.map(({ label, value }, index) => (
        <Col key={index} xl={4} sm={6}>
          <Card>
            <CardBody>
              <div className='d-flex'>
                <div className='flex-shrink-0 me-3 align-self-center'>
                  <div className='avatar-sm'>{getIconByLabel(label)}</div>
                </div>
                <div className='flex-grow-1 overflow-hidden'>
                  <p className='mb-1'>{label}</p>
                  <h5 className='mb-2'>{value}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

const getIconByLabel = (label: string) => {
  switch (label) {
    case 'Total Transactions':
      return <Icon className='mdi' path={mdiCart} size={2} />
    case 'Total Amount':
      return <Icon className='mdi' path={mdiCash} size={2} />
    case 'Total Customers':
      return <Icon className='mdi' path={mdiAccountSupervisor} size={2} />
    default:
      return null
  }
}

const SummarySkeleton = () => (
  <Row>
    {[1, 2, 3].map((i) => (
      <Col key={i} xl={3} sm={6}>
        <Card>
          <CardBody>
            <Skeleton.Button active block style={{ height: 50 }} />
          </CardBody>
        </Card>
      </Col>
    ))}
  </Row>
)

export default SummaryPanel
