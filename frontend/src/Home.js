import { Col, Row } from 'react-bootstrap';
import CountdownTimer from './CountdownTimer';
import BandMember from './Components/Cards/BandMember';

const Home = (props) => {
  return (
    <>
      
      {/* <Button className="!px-8 uppercase">Button</Button> */}
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

      <Row className='mx-md-3 mx-0'>

        {/* <Col xs={1} md={4}></Col> */}
        <Col xs={12} md={4} className='my-md-3 my-10'>
          <BandMember 
            photoSrc="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            name="Carlos Artur Gonçalves"
            position="Baixo/Vocais"
            description="Baixista, vocalista e desenvolvedor deste site"
          />
        </Col>
        <Col xs={12} md={4} className='my-md-3 my-10'>
          <BandMember 
            photoSrc="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            name="Yuri Lopes"
            position="Guitarra/Vocais"
            description="Guitarrista, vocalista"
          />
        </Col>
        <Col xs={12} md={4} className='my-md-3 my-10'>
          <BandMember 
            photoSrc="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            name="David Gardel"
            position="Bateria/Percussão"
            description="Baterista"
          />
        </Col>
        {/* <Col xs={1} md={4}></Col> */}
      </Row>

      
    </>
  )
}

export default Home;