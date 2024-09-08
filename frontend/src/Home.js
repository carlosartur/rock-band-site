import { Col, Row } from 'react-bootstrap';
import CountdownTimer from './CountdownTimer';
import BandMember from './Components/Cards/BandMember';
import { useEffect, useState } from 'react';
import { chunk, getAllConfigurations, getOneConfiguration } from './Utils/Utils';
import Debug from './Components/Debug/Debug';
import axios from 'axios';
import { NextShows } from './Components/Timeline/NextShows';
import ContactForm from './Components/ContactForm/ContactForm';
import Footer from './Components/Footer/Footer';

const Home = (props) => {
  const [configurations, setConfigurations] = useState([]);
  const [bandMembers, setBandMembers] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  const bandMemberPerLineMdScreen = 4;

  useEffect(() => {
    getAllConfigurations()
      .then(data => {
        setConfigurations(data);
      })
      .catch(err => console.error(err))

    axios.get(`${process.env.REACT_APP_API_URL}/api/band-member/get-all`)
      .then(data => {
        setBandMembers(data.data.data);
      })
      .catch(err => console.error(err))

    axios.get(`${process.env.REACT_APP_API_URL}/api/events/future`)
      .then(data => {
        setFutureEvents(data.data.data);
      })
      .catch(err => console.error(err))

  }, []);



  return (
    <>
      <Row className='text-center overflow-hidden'>
        <Col xs={1} md={4}></Col>

        <Col xs={10} md={4}>
          <div className="inline-block">
            <img src="./logo-banda.png" className="max-h-[50vh] h-auto" />
          </div>
        </Col>
        
        <Col xs={1} md={4}></Col>
      </Row>

      <Row className='mx-md-3 mx-0' id="who-we-are">
        <Col xs={12} className='my-md-3 my-10 text-white text-center'>
          <h2>Quem Somos</h2>
        </Col>

        { configurations["pagina-da-secao-quem-somos-da-home"] 
          ? <Col xs={12} className='my-md-3 my-10 text-white text-center' dangerouslySetInnerHTML={{__html: configurations["pagina-da-secao-quem-somos-da-home"].value_translated.text }}></Col>
          : null
        }


        { bandMembers.length <= bandMemberPerLineMdScreen
          ? bandMembers.map((bandMember, key) => {

            let mdCol = Math.floor(12 / bandMembers.length)

            return (<Col xs={12} md={mdCol} className='my-md-3 my-10' key={key}>
              <BandMember 
                photoSrc={`${process.env.REACT_APP_API_URL}/storage/${bandMember.photo.path}`}
                name={bandMember.name}
                position={bandMember.position}
                description={bandMember.description}
              />
            </Col>)
          })
          : chunk(bandMembers, bandMemberPerLineMdScreen).map(bandMembersLine => {
            return bandMembersLine.map((bandMember, key) => {
              let mdCol = Math.floor(12 / bandMembersLine.length)

              return (<Col xs={12} md={mdCol} className='my-md-3 my-10' key={key}>
                <BandMember 
                  photoSrc={`${process.env.REACT_APP_API_URL}/storage/${bandMember.photo.path}`}
                  name={bandMember.name}
                  position={bandMember.position}
                  description={bandMember.description}
                />
              </Col>)
            })
          })
        }
      </Row>

      <Row className='mx-md-3 mx-0' id="next-shows">
        <Col xs={12} className='my-md-3 my-10 text-white text-center'>
          <h2>Próximas apresentações</h2>
        </Col>
        <NextShows events={futureEvents}/>
      </Row>

      <Row className='mx-md-3 mx-0' id="contact-form">
        <Col xs={12} className='my-md-3 my-10 text-white text-center'>
          <h2>Contato</h2>
        </Col>
        <Col xs={12} className='my-md-3 my-10 text-white text-center'>
          <ContactForm />
        </Col>
      </Row>

      <Footer />
      
    </>
  )
}

export default Home;