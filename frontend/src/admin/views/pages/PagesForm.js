import CIcon from '@coreui/icons-react';
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
  CFormRange,
  CFormSwitch,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react';
import api from '../../api/api';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as icon from '@coreui/icons';
import { AuthComponent } from '../../components/AuthComponent';
import { EditorComponent } from '../../components/EditorComponent';
import { PaginationFromData } from '../../components/PaginationComponent';
import { BrazilianFormatData } from '../../components/BrazilianFormatData';

const PagesForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);
  const [addPhotoModalData, setAddPhotoModalData] = useState({
    visible: false,
  });
  const [searchedPhotos, setSearchedPhotos] = useState([]);
  const [bannerSrc, setBannerSrc] = useState('');

  const [photoNameSearch, setPhotoNameSearch] = useState('');

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState({
    id,
    slug: '',
    title: '',
    text: '',
    home: '',
    order: '',
    gallery_id: '',
    created_at: '',
    updated_at: '',
  });

  const [invalidInputs, setInvalidInputs] = useState({
    slug: false,
    title: false,
    text: false,
    home: false,
    order: false,
    gallery_id: false,
    created_at: false,
    updated_at: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    slug: '',
    title: '',
    text: '',
    home: '',
    order: '',
    gallery_id: '',
    created_at: '',
    updated_at: '',
  });

  const toaster = useRef();

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

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    let validationFailedFields = {};

    Object.keys(invalidInputs).forEach(
      (invalidInput) => (validationFailedFields[invalidInput] = false)
    );
    setInvalidInputs(validationFailedFields);

    try {
      const response = await api.put(
        `${process.env.REACT_APP_API_URL}/admin/pages`,
        formData
      );

      lauchToast({
        message: 'Pages editada com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/pages'), 1000);
    } catch (error) {
      if (error?.response?.data?.inputs) {
        validationFailedFields = {};

        Object.keys(invalidInputs).forEach((invalidInput) => {
          validationFailedFields[invalidInput] = false;
          invalidInputsMessages[invalidInput] = '';
        });

        setInvalidInputsMessages(
          Object.assign(invalidInputsMessages, error.response.data.inputs)
        );

        Object.keys(error.response.data.inputs).forEach(
          (invalidInput) => (validationFailedFields[invalidInput] = true)
        );

        setInvalidInputs(validationFailedFields);
      }

      lauchToast({
        message: 'Erro ao salvar Pages!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar Pages!', error);
    }
  };

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
    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/pages/${id}`)
        .then((response) => {
          setFormData(response.data);
          setBannerSrc(response.data.banner.path);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    loadGallery();
  }, []);

  return (
    <>
      <AuthComponent />

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
                      src={`${process.env.REACT_APP_API_URL}/${item.path}`}
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
                          setFormData({ ...formData, gallery_id: item.id });
                          setBannerSrc(item.path);
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

      <CToaster
        ref={toaster}
        placement='top-end'
        push={toastContent}
      ></CToaster>

      <CRow>
        <CCol xs={12}>
          <CForm onSubmit={handleSubmit} className='g-3'>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>{id ? 'Editar' : 'Nova'}</strong>{' '}
                <small>Pages {id ? `#${id}` : ''}</small>
              </CCardHeader>

              <CCardBody className='row'>
                <CFormInput
                  type='hidden'
                  value={formData.id}
                  onChange={handleChange}
                  id='id'
                  name='id'
                ></CFormInput>

                <CCol xs={8}>
                  <CFormLabel htmlFor='title'>Título da página</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.title}
                    value={formData.title}
                    onChange={(e) => {
                      handleChange(e);
                      const title = e.target.value;
                      const slug = title
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .trim()
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');

                      setFormData({ ...formData, title, slug });
                    }}
                    id='title'
                    name='title'
                  ></CFormInput>
                  {invalidInputs.title && (
                    <CFormFeedback invalid={invalidInputs.title}>
                      {invalidInputsMessages.title}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={4}>
                  <CFormLabel htmlFor='slug'>URL</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.slug}
                    value={formData.slug}
                    onChange={handleChange}
                    id='slug'
                    name='slug'
                    disabled={true}
                  ></CFormInput>
                  {invalidInputs.slug && (
                    <CFormFeedback invalid={invalidInputs.slug}>
                      {invalidInputsMessages.slug}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor='text'>Texto da página</CFormLabel>

                  <EditorComponent
                    id='description'
                    initialValue={formData.text}
                    editorState={formData.text}
                    setEditorState={(newEditorState) => {
                      setFormData({ ...formData, text: newEditorState });
                    }}
                  />

                  <CFormInput
                    invalid={invalidInputs.text}
                    value={formData.text}
                    onChange={handleChange}
                    id='text'
                    name='text'
                    type='hidden'
                  ></CFormInput>
                  {invalidInputs.text && (
                    <CFormFeedback invalid={invalidInputs.text}>
                      {invalidInputsMessages.text}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={3}>
                  <CFormLabel htmlFor='home'>
                    Exibe página na página inicial?
                  </CFormLabel>

                  <input
                    type='hidden'
                    value={formData.home}
                    id='package'
                    name='package'
                  />

                  <CFormSwitch
                    id='packageCheckbox'
                    invalid={invalidInputs.home}
                    onChange={(e) => {
                      formData.home = e.target.checked;
                      handleChange(e);
                    }}
                    type='checkbox'
                    defaultChecked={!!formData.home}
                    label={formData.home ? 'Exibe' : 'Não exibe'}
                  />

                  {invalidInputs.home && (
                    <CFormFeedback invalid={invalidInputs.home}>
                      {invalidInputsMessages.home}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={9}>
                  <CFormRange
                    min={0}
                    max={128}
                    step={0}
                    value={formData.order}
                    invalid={invalidInputs.order}
                    label={(() =>
                      'Ordenação na página inicial: ' + formData.order)()}
                    defaultValue='3'
                    id='customRange2'
                    name='order'
                    onChange={handleChange}
                  />

                  {invalidInputs.order && (
                    <CFormFeedback invalid={invalidInputs.order}>
                      {invalidInputsMessages.order}
                    </CFormFeedback>
                  )}
                </CCol>
                
                <CCol xs={12}>
                  <CFormLabel htmlFor='gallery_id'>Banner</CFormLabel>

                  {formData.gallery_id ? (
                    <CCard>
                      <CCardImage
                        orientation='top'
                        src={`${process.env.REACT_APP_API_URL}${bannerSrc}`}
                      />
                      <CCardFooter>
                        <CCol xs={12} align='right'>
                          <CButton
                            onClick={() =>
                              setAddPhotoModalData({ visible: true })
                            }
                          >
                            <CIcon icon={icon.cilCamera} />
                            &nbsp; Escolher outra foto
                          </CButton>
                        </CCol>
                      </CCardFooter>
                    </CCard>
                  ) : (
                    <CAlert color='warning'>
                      <CRow>
                        <CCol xs={6} align='left'>
                          Nenhum banner selecionado
                        </CCol>
                        <CCol xs={6} align='right'>
                          <CButton
                            onClick={() =>
                              setAddPhotoModalData({ visible: true })
                            }
                            color='primary'
                          >
                            <CIcon icon={icon.cilCamera} />
                            &nbsp; Escolher foto da galeria
                          </CButton>
                        </CCol>
                      </CRow>
                    </CAlert>
                  )}

                  <CFormInput
                    invalid={invalidInputs.gallery_id}
                    value={formData.gallery_id}
                    onChange={handleChange}
                    id='gallery_id'
                    name='gallery_id'
                    type='hidden'
                  ></CFormInput>
                  {invalidInputs.gallery_id && (
                    <CFormFeedback invalid={invalidInputs.gallery_id}>
                      {invalidInputsMessages.gallery_id}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Pages'>
                    <CButton href='#/admin/pages' color='warning'>
                      <CIcon icon={icon.cilX} />
                      &nbsp; Cancelar
                    </CButton>
                    <CButton type='submit' color='success' disabled={loading}>
                      {loading ? (
                        <CSpinner
                          component='span'
                          size='sm'
                          aria-hidden='true'
                        />
                      ) : (
                        <CIcon icon={icon.cilCheckAlt} />
                      )}
                      &nbsp; Salvar
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CCardFooter>
            </CCard>
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};

export default PagesForm;
