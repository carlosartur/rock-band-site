import { Col, Row } from 'react-bootstrap';
import CountdownTimer from './CountdownTimer';

const Home = (props) => {
  return (
    <>
      <Row className='text-center overflow-hidden'>
        <Col xs={1} md={4}></Col>

        <Col xs={10} md={4}>
          <div className="inline-block">
            {/* <img src="./kali.svg" className="bg-white max-h-1/2 h-auto w-full" /> */}
            <img src="./logo-banda.png" className="max-h-[50vh] h-auto" />
          </div>
        </Col>
        
        <Col xs={1} md={4}></Col>
      </Row>
      {/* <Row>
        <Col xs={1} md={4}></Col>
        <Col xs={10} md={4}>
          <p className='text-white w-full text-4xl '>Cartel de Khali</p>
        </Col>
        <Col xs={1} md={4}></Col>
      </Row> */}
      <Row>
        <Col xs={1} md={4}></Col>
        <Col xs={10} md={4}>
          <p className='text-white w-full text-4xl text-center'>
            <CountdownTimer targetDate="2024-08-01T00:00:00Z" />
          </p>
        </Col>
        <Col xs={1} md={4}></Col>
      </Row>
    </>
  )
}

export default Home;