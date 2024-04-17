import Notification from 'antd/es/notification'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Container, Form, Input, Row } from 'reactstrap'
import Button from '../Button'

import { cancelToken, getFetchClient } from '../../helper-plugin'
import RichTextEditor from './RichTextEditor'

const InputEditor = (props: { value: string; onChange: (value: string) => void }) => {
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value)
    }
  }, [props.value])

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    props.onChange(evt.target.value)
    setValue(evt.target.value)
  }

  return <Input type='textarea' multiple style={{ minHeight: 200 }} value={value} onChange={onInputChange} />
}

const FormEditor = (props: { path: string; label: string; textarea?: boolean }) => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)
  const [api, contextHolder] = Notification.useNotification()
  const valueRef = useRef<string | null>(null)
  const fetchClient = getFetchClient()
  const token = cancelToken()

  useEffect(() => {
    setIsSubmit(true)
    fetchClient
      .get(props.path, { cancelToken: token.token })
      .then(({ data }) => {
        valueRef.current = props.textarea ? data : data?.html
      })
      .finally(() => setIsSubmit(false))

    return () => token.cancel()
  }, [props.path])

  const onSubmit = () => {
    setIsSubmit(true)
    const html = valueRef.current
    fetchClient
      .post(props.path, { html }, { cancelToken: token.token })
      .then(() => api['success']({ message: 'Success', description: `Edit content successful.` }))
      .catch(() => api['error']({ message: 'Error', description: `Edit content unsuccessful.` }))
      .finally(() => setIsSubmit(false))
  }

  return (
    <Container className='form-basic-container' fluid={true}>
      {contextHolder}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row className='mb-5'>
                <Col sm={6}>
                  <Button color='secondary' children='Back' style={{ width: 100 }} onClick={() => navigate(-1)} />
                </Col>
                <Col sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
                  <h4 className='card-title mb-4'>{props.label} Editor</h4>
                </Col>
              </Row>
              <div id='static-page-form' className='twitter-bs-wizard'>
                <Form>
                  {props.textarea ? (
                    <InputEditor value={valueRef.current || ''} onChange={(value) => (valueRef.current = value)} />
                  ) : (
                    <RichTextEditor data={valueRef.current} onChange={(value) => (valueRef.current = value)} />
                  )}
                  <ul className='pager wizard twitter-bs-wizard-pager-link'>
                    <li className='next'>
                      <Button type='button' onClick={onSubmit} children='Submit' disabled={isSubmit} />
                    </li>
                  </ul>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default FormEditor
