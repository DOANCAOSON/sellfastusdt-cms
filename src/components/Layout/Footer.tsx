import { Col, Container, Row } from 'reactstrap'

const Footer = () => {
  return (
    <footer className='footer'>
      <Container fluid={true}>
        <Row>
          <Col sm={6}>{new Date().getFullYear()} © sellfastusdt.</Col>
          <Col sm={6}>
            <div className='text-sm-end d-none d-sm-block'>
              Crafted with <i className='mdi mdi-heart text-danger'></i> by Themesdesign
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
