import CIcon from '@coreui/icons-react';
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
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

const GalleryForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState([]);

  const [invalidInputs, setInvalidInputs] = useState({
    files: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    files: '',
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
    const files = e.target.files;
    const maxSize = 1024 * 1024 * 5;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxSize) {
        lauchToast({
          message: `O arquivo ${file.name} excede o tamanho máximo permitido de 5 MB.`,
          color: 'danger',
          visible: true,
        });
        
        e.target.value = null;
        return;
      }
    }

    setFormData([...e.target.files]);
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
      const formDataToSend = new FormData();

      formData.forEach((file, index) => {
        formDataToSend.append(`file[${index}]`, file);
      });

      const response = await api.post(
        `${process.env.REACT_APP_API_URL}/admin/gallery`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      lauchToast({
        message:
          formData.length > 1
            ? `${formData.length} Imagens adicionadas com sucesso!`
            : `1 Imagem adicionada com sucesso!`,
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/gallery'), 1000);
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
        message: 'Erro ao adicionar imagens!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao adicionar imagens!', error);
    }
  };

  useEffect(() => {
    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/gallery/${id}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <>
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
                <strong>Adicionar</strong> <small>Imagens</small>
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
                  <CFormLabel htmlFor='files'>Arquivos</CFormLabel>
                  <CFormInput
                    type='file'
                    id='files'
                    multiple
                    onChange={handleChange}
                    accept='image/*'
                  />
                  {invalidInputs.files && (
                    <CFormFeedback invalid={invalidInputs.files}>
                      {invalidInputsMessages.files}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Gallery'>
                    <CButton href='#/admin/gallery' color='warning'>
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

export default GalleryForm;
