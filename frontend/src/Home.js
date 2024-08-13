import { Col, Row } from 'react-bootstrap';
import CountdownTimer from './CountdownTimer';
import BandMember from './Components/Cards/BandMember';
import { useEffect, useState } from 'react';
import { chunk, getAllConfigurations } from './Utils/Utils';
import Debug from './Components/Debug/Debug';
import axios from 'axios';

const Home = (props) => {
  const [configurations, setConfigurations] = useState({});
  const [bandMembers, setBandMembers] = useState([]);

  const bandMemberPerLineMdScreen = 2;

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

      
    </>
  )
}

export default Home;