import { Container, Row } from 'reactstrap'
import Filter from './Filter'
import OrderPanel from './OrderPanel'
import OrderStatus from './OrderStatus'
import SummaryPanel from './SummaryPanel'
import './dashboard.scss'

const Dashboard = () => {
  document.title = 'Sellfastusdt Dashboard'
  return (
    <>
      <div className='page-content dashboard'>
        <Container fluid={true}>
          <Filter />
          <SummaryPanel />
          <Row>
            <OrderPanel />
            <OrderStatus />
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Dashboard
