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
import { CFormInputWithMask } from '../../components/CFormInputWithMask';
import { EditorComponent } from '../../components/EditorComponent';

const ContactForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState({
    id,
    name: '',
    email: '',
    phone: '',
    enterprise: '',
    subject: '',
    message: '',
    ip: '',
    created_at: '',
    updated_at: '',
  });

  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    email: false,
    phone: false,
    enterprise: false,
    subject: false,
    message: false,
    ip: false,
    created_at: false,
    updated_at: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    name: '',
    email: '',
    phone: '',
    enterprise: '',
    subject: '',
    message: '',
    ip: '',
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
        `${process.env.REACT_APP_API_URL}/admin/contact`,
        formData
      );

      lauchToast({
        message: 'Contact editada com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/contact'), 1000);
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
        message: 'Erro ao salvar Contact!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar Contact!', error);
    }
  };

  useEffect(() => {
    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/contact/${id}`)
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
                <strong>{id ? 'Editar' : 'Nova'}</strong>{' '}
                <small>Contact {id ? `#${id}` : ''}</small>
              </CCardHeader>

              <CCardBody className='row'>
                <CFormInput
                  type='hidden'
                  value={formData.id}
                  onChange={handleChange}
                  id='id'
                  name='id'
                ></CFormInput>

                <CCol xs={4}>
                  <CFormLabel htmlFor='name'>Nome</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.name}
                    value={formData.name}
                    onChange={handleChange}
                    id='name'
                    name='name'
                  ></CFormInput>
                  {invalidInputs.name && (
                    <CFormFeedback invalid={invalidInputs.name}>
                      {invalidInputsMessages.name}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='email'>Email</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.email}
                    value={formData.email}
                    onChange={handleChange}
                    id='email'
                    name='email'
                    type='email'
                  ></CFormInput>
                  {invalidInputs.email && (
                    <CFormFeedback invalid={invalidInputs.email}>
                      {invalidInputsMessages.email}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='phone'>Telefone</CFormLabel>
                  <CFormInputWithMask
                    mask={[
                      { mask: '(00) 0000-0000' },
                      { mask: '(00) 0 0000-0000' },
                    ]}
                    invalid={invalidInputs.phone}
                    value={formData.phone}
                    onChange={handleChange}
                    id='phone'
                    name='phone'
                  />
                  {invalidInputs.phone && (
                    <CFormFeedback invalid={invalidInputs.phone}>
                      {invalidInputsMessages.phone}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor='enterprise'>Empresa</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.enterprise}
                    value={formData.enterprise}
                    onChange={handleChange}
                    id='enterprise'
                    name='enterprise'
                  ></CFormInput>
                  {invalidInputs.enterprise && (
                    <CFormFeedback invalid={invalidInputs.enterprise}>
                      {invalidInputsMessages.enterprise}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor='ip'>IP</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.ip}
                    value={formData.ip}
                    onChange={handleChange}
                    id='ip'
                    name='ip'
                  ></CFormInput>
                  {invalidInputs.ip && (
                    <CFormFeedback invalid={invalidInputs.ip}>
                      {invalidInputsMessages.ip}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor='subject'>Assunto</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.subject}
                    value={formData.subject}
                    onChange={handleChange}
                    id='subject'
                    name='subject'
                  ></CFormInput>
                  {invalidInputs.subject && (
                    <CFormFeedback invalid={invalidInputs.subject}>
                      {invalidInputsMessages.subject}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor='message'>Mensagem</CFormLabel>

                  <EditorComponent
                    id='description'
                    initialValue={formData.message}
                    editorState={formData.message}
                    setEditorState={(newEditorState) => {
                      setFormData({ ...formData, message: newEditorState });
                    }}
                  />

                  <CFormInput
                    invalid={invalidInputs.message}
                    value={formData.message}
                    onChange={handleChange}
                    id='message'
                    name='message'
                    type='hidden'
                  />

                  {invalidInputs.message && (
                    <CFormFeedback invalid={invalidInputs.message}>
                      {invalidInputsMessages.message}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Contact'>
                    <CButton href='#/admin/contact' color='warning'>
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

export default ContactForm;
