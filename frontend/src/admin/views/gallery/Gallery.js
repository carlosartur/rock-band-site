import {
  CAlert,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToaster,
  CToastClose,
  CToastBody,
  CToast,
  CCardImage,
  CCardTitle,
  CFormSelect,
} from '@coreui/react';
import api from '../../api/api';
import React, { useEffect, useRef, useState } from 'react';
import { PaginationFromData } from '../../components/PaginationComponent';
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AuthComponent } from '../../components/AuthComponent';
import { BrazilianFormatData } from '../../components/BrazilianFormatData';
import '../../scss/show_input_controls.scss';

const SearchResultsTable = (searchResponse) => {
  const { searchResults, onClickPagination, onClickDelete } = searchResponse;

  if (!searchResults.total) {
    return <CAlert color='warning'>Nenhuma foto econtrada</CAlert>;
  }

  return (
    <>
      <div className="row row-cols-md-3 row-cols-1 g-4"
        style={{
          marginBottom: "35px"
        }}
      >
        {searchResults.data.map((item) => (
          <CCol xs key={item.id}>
            <CCard>
              <CCardImage
                orientation='top'
                src={`${process.env.REACT_APP_API_URL}${item.path}`}
              />
              <CCardBody>
                <CCardTitle>
                  {item.name}
                </CCardTitle>
                <small>
                  Proporção:&nbsp;
                    <span style={{color: "#F00"}}>
                      {item.proportion}
                    </span>
                  <br />
                  Largura:&nbsp;
                    <span style={{color: "#F00"}}>
                      {item.width}
                    </span>
                  &nbsp;
                  Altura:&nbsp;
                    <span style={{color: "#F00"}}>
                      {item.height}
                    </span>
                </small>
              </CCardBody>
              <CCardFooter>
                <small className='text-medium-emphasis'>
                  Imagem enviada em&nbsp;
                  <BrazilianFormatData date={item.created_at} />
                  &nbsp;
                </small>
                <CButton
                  color='danger'
                  onClick={() =>
                    onClickDelete({
                      id: item.id,
                      visible: true,
                      name: item.name,
                    })
                  }
                >
                  <CIcon icon={icon.cilTrash} size='lg' />
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </div>
      <PaginationFromData
        searchResults={searchResults}
        clickFunction={onClickPagination}
      ></PaginationFromData>
    </>
  );
};

const Gallery = () => {
  const [loading, setLoading] = useState(false);

  const [toastContent, setToastContent] = useState(false);
  const toaster = useRef();
  const [proportions, setProportions] = useState({});

  const [deleteModalData, setDeleteModalData] = useState({
    visible: false,
    name: '',
    id: 0,
  });

  const [searchResults, setSearchResults] = useState([]);

  const lauchToast = (toastData) => {
    const toastInternal = (
      <CToast
        autohide={false}
        visible={toastData.visible}
        color={toastData.color}
        className='text-white align-items-center'
      >
        <div className='d-flex'>
          <CToastBody>{toastData.message}</CToastBody>
          <CToastClose className='me-2 m-auto' white />
        </div>
      </CToast>
    );

    setToastContent(toastInternal);
  };

  const [formData, setFormData] = useState({
    name: '',
    proportion: '',
    width: '',
    height: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/admin/gallery`,
        {
          params: formData,
        }
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const makePageRequest = async (e) => {
    const linkpaginacao = e.target.getAttribute('linkpaginacao');

    try {
      const response = await api.get(linkpaginacao);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const deleteGallery = async (galleryId) => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/gallery`,
        {
          params: { id: galleryId },
        }
      );

      lauchToast({
        message: 'Excluído com sucesso!',
        color: 'success',
        visible: true,
      });

      handleSubmit();
    } catch (error) {
      console.error(error);

      lauchToast({
        message: 'Falha na exclusão de foto.',
        color: 'danger',
        visible: true,
      });

      handleSubmit();
    }
  };

  useEffect(() => {
    handleSubmit();

    api.get(`${process.env.REACT_APP_API_URL}/admin/gallery/proportions`)
      .then((response) => {
        setProportions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <AuthComponent />

      <CToaster
        ref={toaster}
        placement='top-end'
        push={toastContent}
      ></CToaster>

      <CModal
        alignment='center'
        visible={deleteModalData.visible}
        onClose={() => setDeleteModalData({ visible: false })}
      >
        <CModalHeader>
          <CModalTitle>Excluir foto {deleteModalData.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir a foto {deleteModalData.name}? Essa
          ação não pode ser desfeita!
        </CModalBody>
        <CModalFooter>
          <CButton
            color='secondary'
            onClick={() => setDeleteModalData({ visible: false })}
          >
            Cancelar
          </CButton>
          <CButton
            color='danger'
            onClick={() => {
              deleteGallery(deleteModalData.id);
              setDeleteModalData({ visible: false });
            }}
          >
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CCard className='mb-4'>
            <CForm onSubmit={handleSubmit} className='g-3'>
              <CCardHeader>
                <strong>Galeria</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row'>
                <CCol xs={6}>
                  <CFormLabel htmlFor='name'>Nome</CFormLabel>
                  <CFormInput
                    value={formData.name}
                    onChange={handleChange}
                    id='name'
                    name='name'
                  ></CFormInput>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor="proportion">Proporção</CFormLabel>
                  <CFormSelect
                    value={formData.proportion || ""}
                    onChange={handleChange}
                    id='proportion'
                    name='proportion'
                  >
                    <option value="">
                      Selecione uma proporção
                    </option>

                    {proportions && Array.isArray(proportions) && proportions.map((proportion, key) => <option key={key} value={proportion}>
                      {proportion}
                    </option>)}
                      
                  </CFormSelect>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor='width'>Largura</CFormLabel>
                  <CFormInput
                    value={formData.width}
                    onChange={handleChange}
                    id='width'
                    name='width'
                    type='number'
                    min={0}
                  ></CFormInput>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor='height'>Altura</CFormLabel>
                  <CFormInput
                    value={formData.height}
                    onChange={handleChange}
                    id='height'
                    name='height'
                    type='number'
                    min={0}
                  ></CFormInput>
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de foto'>
                    <CButton type='submit' disabled={loading} color='primary'>
                      {loading ? (
                        <CSpinner
                          component='span'
                          size='sm'
                          aria-hidden='true'
                        />
                      ) : (
                        <CIcon icon={icon.cilZoom} size='lg' />
                      )}
                      &nbsp; Buscar
                    </CButton>
                    <CButton href='#/admin/gallery-form' color='success'>
                      <CIcon icon={icon.cilPlus} size='lg' />
                      &nbsp; Adicionar
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CCardFooter>
            </CForm>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className='mb-4'>
            <CCardHeader>
              <strong>Resultados</strong> <small>Busca</small>
            </CCardHeader>
            <CCardBody>
              <SearchResultsTable
                searchResults={searchResults}
                onClickPagination={makePageRequest}
                onClickDelete={setDeleteModalData}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Gallery;
