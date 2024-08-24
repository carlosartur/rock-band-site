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
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
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
import Debug from '../../../Components/Debug/Debug';
import { showDescriptionResume } from '../../../Utils/Utils';

const ConfigurationsForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);
  const [photoNameSearch, setPhotoNameSearch] = useState('');
  const [toastContent, setToastContent] = useState(false);
  const [searchedPhotos, setSearchedPhotos] = useState([]);

  const [addPhotoModalData, setAddPhotoModalData] = useState({
    visible: false,
  });
  
  const [pageModalData, setPageModalData] = useState({
    visible: false,
    content: '<p>Selecione uma página para visualizar</p>',
  });

  const [searchedPages, setSearchedPages] = useState([]);

  const [addPagesModalData, setAddPagesModalData] = useState({
    visible: false,
  });

  const [pagesNameSearch, setPagesNameSearch] = useState([]);

  const [formData, setFormData] = useState({
    id,
    name: '',
    value: ' ',
    value_translated: '',
    type: '',
    default_value: '',
    default_value_translated: '',
    created_at: '',
    updated_at: '',
  });

  const [invalidInputs, setInvalidInputs] = useState({
    value: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    value: '',
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
        `${process.env.REACT_APP_API_URL}/admin/configurations`,
        formData
      );

      lauchToast({
        message: 'Configuração editada com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/configurations'), 1000);
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
        message: 'Erro ao salvar configuração!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar configuração!', error);
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

  const loadPages = (
    url = `${process.env.REACT_APP_API_URL}/admin/pages`
  ) => {
    api
      .get(url)
      .then((response) => {
        setSearchedPages(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar páginas', error);
      });
  };

  useEffect(() => {
    api
      .get(`${process.env.REACT_APP_API_URL}/admin/configurations/${id}`)
      .then((response) => {

        if ("multivalues" == response.data.type) {
          response.data.value = Object.entries(JSON.parse(response.data.value || '{}')).map(([key, value]) => {
            return {key, value}
          });

          response.data.default_value = Object.entries(JSON.parse(response.data.default_value || '{}')).map(([key, value]) => {
            return {key, value}
          });

          // response.data.value_translated = JSON.parse(response.data.value_translated || '{}');
          // response.data.default_value_translated = JSON.parse(response.data.default_value_translated || '{}');
        }

        setFormData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    loadGallery();
    loadPages();
  }, []);

  return (
    <>
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
                          setFormData({
                            ...formData,
                            value: item.id,
                            value_translated: item.path,
                          });
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

      <CModal
        size='xl'
        alignment='center'
        visible={pageModalData.visible}
        onClose={() => setPageModalData({ visible: false })}
      >
        <CModalHeader>
          <CModalTitle>Visualizar página</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
            <div dangerouslySetInnerHTML={{__html: pageModalData.content}}></div>
          </CRow>
        </CModalBody>
        <CModalFooter>
        </CModalFooter>
      </CModal>

      <CModal
        size='xl'
        alignment='center'
        visible={addPagesModalData.visible}
        onClose={() => setAddPagesModalData({ visible: false })}
      >
        <CModalHeader>
          <CModalTitle>Selecionar página</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={12}>
              <CCard className='mb-4'>
                <CForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    loadPages(
                      `${process.env.REACT_APP_API_URL}/admin/pages?title=${pagesNameSearch}`
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
                        value={pagesNameSearch}
                        onChange={(e) => setPagesNameSearch(e.target.value)}
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

          <CRow>
            <CCol xs={12}>
              {searchedPages?.data?.length ? (
                <CCard className='mb-4'>
                  <CCardHeader>
                    <strong>Buscar página</strong>
                  </CCardHeader>
                  <CCardBody className='row'>
                    <CTable striped hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope='col'>
                            Url
                          </CTableHeaderCell>
                          <CTableHeaderCell scope='col'>
                            Título
                          </CTableHeaderCell>
                          <CTableHeaderCell scope='col'>Texto</CTableHeaderCell>
                          <CTableHeaderCell scope='col'>&nbsp;</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {searchedPages.data.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{item.slug}</CTableDataCell>
                            <CTableDataCell>{item.title}</CTableDataCell>
                            <CTableDataCell>{showDescriptionResume(item.text)}</CTableDataCell>
                            <CTableDataCell>
                              <CButtonGroup role='group' aria-label='Ações de Pages'>
                                <CButton
                                  color='primary'
                                  onClick={() => {
                                    setFormData({...formData, value_translated: item, value: item.id});
                                    setAddPagesModalData({ visible: false });
                                  }}
                                >
                                  <CIcon icon={icon.cilCheckAlt} size='lg' />
                                </CButton>
                              </CButtonGroup>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              ) : (
                <CAlert color='info'>Nenhuma página encontrada.</CAlert>
              )}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CCol xs={12} align='center'>
            <PaginationFromData
              searchResults={searchedPages}
              clickFunction={(e) =>
                loadPages(e.target.getAttribute('linkpaginacao'))
              }
            ></PaginationFromData>
          </CCol>
        </CModalFooter>
      </CModal>

      <AuthComponent />

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
                <small>Configuração {id ? `#${id}` : ''}</small>
              </CCardHeader>

              <CCardBody>
                <CFormInput
                  type='hidden'
                  value={formData.id}
                  onChange={handleChange}
                  id='id'
                  name='id'
                ></CFormInput>
                <CCol xs={12}>
                  <CFormLabel htmlFor='name'>Nome</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.name}
                    value={formData.name}
                    onChange={handleChange}
                    id='name'
                    name='name'
                    disabled={true}
                  ></CFormInput>
                  {invalidInputs.name && (
                    <CFormFeedback invalid={invalidInputs.name}>
                      {invalidInputsMessages.name}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor='value'>Valor{"multivalues" == formData.type ? "es" : ""}</CFormLabel>

                  {(() => {
                    switch (formData.type) {
                      case 'gallery':
                        return (
                          <>
                            {formData.value ? (
                              <CCard>
                                <CCardImage
                                  orientation='top'
                                  src={`${process.env.REACT_APP_API_URL}/${formData.value_translated}`}
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
                                    Nenhuma foto adicionada
                                  </CCol>
                                  <CCol xs={6} align='right'>
                                    <CButton
                                      onClick={() =>
                                        setAddPhotoModalData({ visible: true })
                                      }
                                    >
                                      <CIcon icon={icon.cilCamera} />
                                      &nbsp; Escolher outra foto
                                    </CButton>
                                  </CCol>
                                </CRow>
                              </CAlert>
                            )}

                            <CFormInput
                              invalid={invalidInputs.value}
                              value={formData.value}
                              onChange={handleChange}
                              id='value'
                              name='value'
                              type='hidden'
                            ></CFormInput>
                          </>
                        );

                      case 'string':
                        return (
                          <CFormInput
                            invalid={invalidInputs.value}
                            value={formData.value}
                            onChange={handleChange}
                            id='value'
                            name='value'
                          ></CFormInput>
                        );

                      case 'page':
                        return (
                          <>
                            <CInputGroup style={{ marginTop: "15px"}}>
                              <span class="input-group-text">Título</span>
                              <CFormInput
                                invalid={invalidInputs.value}
                                value={formData.value_translated.title}
                                id='pageTitle'
                                name='pageTitle'
                                readOnly={true}
                              ></CFormInput>
                              <span class="input-group-text">Slug</span>
                              <CFormInput
                                invalid={invalidInputs.value}
                                value={formData.value_translated.slug}
                                id='pageTitle'
                                name='pageTitle'
                                readOnly={true}
                              ></CFormInput>
                              <button class="btn btn-dark" type="button"
                                onClick={() => {
                                  setPageModalData({
                                    visible: true,
                                    content: formData.value_translated.text
                                  });
                                }}
                              >
                                Visualizar
                              </button>
                              <button class="btn btn-warning" type="button"
                                onClick={() => {
                                  setAddPagesModalData({
                                    visible: true,
                                  });
                                }}
                              >
                                Mudar
                              </button>
                            </CInputGroup>

                            <CFormInput
                              invalid={invalidInputs.value}
                              value={formData.value}
                              onChange={handleChange}
                              id='value'
                              name='value'
                              type='hidden'
                            ></CFormInput>
                          </>
                        );

                      case 'multivalues':
                        return (
                          <>
                            {formData.value.map((value, index) => {
                              return <>
                                  <CInputGroup key={index} style={{ marginTop: "15px"}}>
                                    <CFormInput
                                      value={value["key"]}
                                      onChange={((e) => {
                                        let { name, value } = e.target;
                                        let currentValue = formData.value;
                                        
                                        name = name.replace("key[", "").replace("]", "")

                                        currentValue[name]["key"] = value;
                                        setFormData({...formData, value: currentValue});
                                      })}
                                      id={'key[' + index + ']'}
                                      name={'key[' + index + ']'}
                                    ></CFormInput>
                                    <CFormInput
                                      value={value["value"]}
                                      onChange={((e) => {
                                        let { name, value } = e.target;
                                        let currentValue = formData.value;
                                        
                                        name = name.replace("value[", "").replace("]", "")

                                        currentValue[name]["value"] = value;
                                        setFormData({...formData, value: currentValue});
                                      })}
                                      id={'value[' + index + ']'}
                                      name={'value[' + index + ']'}
                                    ></CFormInput>
                                    <CButton
                                      id={'remove[' + index + ']'}
                                      color='danger'
                                      onClick={((e) => {
                                        let currentValue = formData.value;
                                                                                
                                        delete currentValue[index];
                                        setFormData({...formData, value: currentValue});
                                      })}
                                    >
                                      <CIcon icon={icon.cilTrash} />
                                    </CButton>
                                  </CInputGroup>
                                </>
                              } )}

                            <CButton
                              style={{ marginTop: "15px"}}
                              title='Adicionar valor'
                              color='success'
                              onClick={() => {
                                let currentValue = formData.value;
                                currentValue.push({ key: "", value: "", });
                                setFormData({...formData, value: currentValue});
                              }}
                            >
                              <CIcon icon={icon.cilPlus} size='lg' />
                              &nbsp; Adicionar valor
                            </CButton>
                          </>
                        );


                      case 'text':
                        return (
                          <>
                            <EditorComponent
                              id='description'
                              initialValue={formData.value}
                              editorState={formData.value}
                              setEditorState={(newEditorState) => {
                                setFormData({
                                  ...formData,
                                  value: newEditorState,
                                });
                              }}
                            />

                            <CFormInput
                              invalid={invalidInputs.value}
                              value={formData.value}
                              onChange={handleChange}
                              id='value'
                              name='value'
                              type='hidden'
                            ></CFormInput>
                          </>
                        );
                    }
                  })()}

                  {invalidInputs.value && (
                    <CFormFeedback invalid={invalidInputs.value}>
                      {invalidInputsMessages.value}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup
                    role='group'
                    aria-label='Ações de configuração'
                  >
                    <CButton href='#/admin/configurations' color='warning'>
                      <CIcon icon={icon.cilX} />
                      &nbsp; Cancelar
                    </CButton>
                    <CButton
                      title='Carregar valor padrão'
                      color='dark'
                      onClick={() =>
                        setFormData({
                          ...formData,
                          value: formData.default_value,
                          value_translated: formData.default_value_translated,
                        })
                      }
                    >
                      <CIcon icon={icon.cilReload} size='lg' />
                      &nbsp; Carregar valor padrão
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

export default ConfigurationsForm;
