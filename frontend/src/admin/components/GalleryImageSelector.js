import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { CAlert, CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCardHeader, CCardImage, CCardTitle, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { PaginationFromData } from './PaginationComponent';
import { BrazilianFormatData } from './BrazilianFormatData';
import * as icon from '@coreui/icons';

const GalleryImageSelector = ({ visible, onSelectPhoto, onCloseCallback }) => {
    const [isVisible, setIsVisible] = useState(visible)
    const [searchedPhotos, setSearchedPhotos] = useState([])
    const [photoNameSearch, setPhotoNameSearch] = useState('');
    const [invalidInputs, setInvalidInputs] = useState([]);
    const [invalidInputsMessages, setInvalidInputsMessages] = useState([]);
    const [loading, setLoading] = useState([]);


    const loadGallery = (
        url = `${process.env.REACT_APP_API_URL}/admin/gallery`
      ) => {
        api
          .get(url)
          .then((response) => {
            setSearchedPhotos(response.data);
          })
          .catch((error) => {
            console.error('Erro ao buscar galeria', error);
          });
    };

    useEffect(() => {    
        loadGallery();
    }, []);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    return (
      <CModal
        size='xl'
        alignment='center'
        visible={isVisible}
        onClose={() => {
            setIsVisible(false)
            onCloseCallback()
        }}
      >
        <CModalHeader>
          <CModalTitle>Selecionar foto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={12}>
              <CCard className='mb-4'>
                <CForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    loadGallery(
                      `${process.env.REACT_APP_API_URL}/admin/gallery?name=${photoNameSearch}`
                    );
                  }}
                >
                  <CCardHeader>
                    <strong>Buscar foto</strong>
                  </CCardHeader>

                  <CCardBody className='row'>
                    <CCol xs={4}>
                      <CFormLabel htmlFor='name'>Nome</CFormLabel>
                      <CFormInput
                        value={photoNameSearch}
                        onChange={(e) => setPhotoNameSearch(e.target.value)}
                        id='name'
                        name='name'
                      ></CFormInput>
                      {invalidInputs.name && (
                        <CFormFeedback invalid={invalidInputs.name}>
                          {invalidInputsMessages.name}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CCardBody>
                  <CCardFooter>
                    <CCol xs={12} align='right'>
                      <CButtonGroup role='group' aria-label='Ações de Hotel'>
                        <CButton type='submit' disabled={loading} color='primary'>
                          <CIcon icon={icon.cilZoom} />
                          &nbsp; Buscar
                        </CButton>
                      </CButtonGroup>
                    </CCol>
                  </CCardFooter>
                </CForm>
              </CCard>
            </CCol>
          </CRow>

          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
            {searchedPhotos?.data?.length ? (
              searchedPhotos.data.map((item, index) => (
                <CCol xs key={item.id}>
                  <CCard>
                    <CCardImage
                      orientation='top'
                      src={`${process.env.REACT_APP_API_URL}${item.path}`}
                    />
                    <CCardBody>
                      <CCardTitle>{item.name}</CCardTitle>
                    </CCardBody>
                    <CCardFooter>
                      <small className='text-medium-emphasis'>
                        Imagem enviada em{' '}
                        <BrazilianFormatData date={item.created_at} />
                      </small>
                      <CButton
                        color='success'
                        onClick={() => {
                          onSelectPhoto(item)  
                        //   setFormData({ ...formData, gallery_id: item.id });
                        //   setBannerSrc(item.path);
                            setIsVisible(false)
                        }}
                      >
                        <CIcon icon={icon.cilCheckAlt} size='lg' />
                      </CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
              ))
            ) : (
              <CAlert color='info'>Nenhuma foto encontrada.</CAlert>
            )}
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CCol xs={12} align='center'>
            <PaginationFromData
              searchResults={searchedPhotos}
              clickFunction={(e) =>
                loadGallery(e.target.getAttribute('linkpaginacao'))
              }
            ></PaginationFromData>
          </CCol>
        </CModalFooter>
      </CModal>
    )
}

export default GalleryImageSelector;