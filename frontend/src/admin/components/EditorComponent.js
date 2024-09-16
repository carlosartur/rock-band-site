import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
  CAlert,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardImage,
  CCardTitle,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { PaginationFromData } from './PaginationComponent';
import api from '../api/api';
import { BrazilianFormatData } from './BrazilianFormatData';

export const EditorComponent = ({
  editorState,
  setEditorState,
  initialValue,
}) => {
  const [initialValueGiven, setInitialValueGiven] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [addPhotoModalData, setAddPhotoModalData] = useState({
    visible: false,
  });
  const [photoNameSearch, setPhotoNameSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedPhotos, setSearchedPhotos] = useState([]);

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

  if (!isInitialized && !initialValueGiven && initialValue) {
    setIsInitialized(true);
    setInitialValueGiven(initialValue || " ");
  }


  const openImageModal = (editor) => {
    loadGallery();
    setAddPhotoModalData({
      visible: true,
    });

    return;
  };

  const handleEditorInit = (editor) => {
    setEditorInstance(editor);

    editor.ui.registry.addButton('addGalleryImage', {
      text: 'Inserir Imagem',
      onAction: () => {
        openImageModal(editor);
      },
    });
  };

  return (<>
      <CModal
        size='xl'
        alignment='center'
        visible={addPhotoModalData.visible}
        onClose={() => setAddPhotoModalData({ visible: false })}
      >
        <CModalHeader>
          <CModalTitle>Selecionar foto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={12}>
              <CCard className='mb-4'>
               
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
                  </CCol>
                </CCardBody>
                <CCardFooter>
                  <CCol xs={12} align='right'>
                    <CButtonGroup role='group' aria-label='Ações de Hotel'>
                      <CButton 
                        type='button' 
                        disabled={loading}
                        onClick={() => {
                          loadGallery(
                            `${process.env.REACT_APP_API_URL}/admin/gallery?name=${photoNameSearch}`
                          );
                        }}
                      >
                        <CIcon icon={icon.cilZoom} />
                        &nbsp; Buscar
                      </CButton>
                    </CButtonGroup>
                  </CCol>
                </CCardFooter>

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
                      &nbsp;
                      <CButton
                        color='success'
                        onClick={() => {
                          editorInstance.insertContent(`<img src="${process.env.REACT_APP_API_URL}${item.path}" />`);
                          setAddPhotoModalData({ visible: false });
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

      <Editor
        initialValue={initialValueGiven}
        editorState={editorState}
        onEditorChange={(newEditorState) => {
          setEditorState(newEditorState);
        }}
        apiKey={process.env.REACT_TINYMCE_KEY || "cm8jn8j0gczuuyqv9pyozu28i3v7duujc82s0dxh90qqpajp"}
        init={{
          language: 'pt_BR',
          toolbar: 'addGalleryImage | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent',
          setup: handleEditorInit,
        }}
      />
    </>
  );
};
