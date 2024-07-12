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
  CInputGroup,
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

const UsersForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef(null);
  const passwordConfirmInputRef = useRef(null);

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState({
    id,
    name: '',
    email: '',
    email_verified_at: '',
    password: '',
    remember_token: '',
    created_at: '',
    updated_at: '',
  });

  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    name: '',
    email: '',
    password: '',
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

  const toogleSeePassword = (isConfirm = false) => {
    const passwordInput = (
      isConfirm ? passwordConfirmInputRef : passwordInputRef
    ).current;
    if (!passwordInput) {
      return;
    }

    if ('password' == passwordInput.type) {
      passwordInput.type = 'text';
      return;
    }

    passwordInput.type = 'password';
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
        `${process.env.REACT_APP_API_URL}/admin/users`,
        formData
      );

      lauchToast({
        message: 'Users editada com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/users'), 1000);
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
        message: 'Erro ao salvar usuário!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar usuário!', error);
    }
  };

  useEffect(() => {
    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/users/${id}`)
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
                <strong>{id ? 'Editar' : 'Novo'}</strong>{' '}
                <small>Usuário {id ? `#${id}` : ''}</small>
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
                  ></CFormInput>
                  {invalidInputs.name && (
                    <CFormFeedback invalid={invalidInputs.name}>
                      {invalidInputsMessages.name}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={12}>
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

                <CCol xs={12}>
                  <CFormLabel htmlFor='password'>Senha</CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      ref={passwordInputRef}
                      invalid={invalidInputs.password}
                      value={formData.password}
                      onChange={handleChange}
                      id='password'
                      name='password'
                      type='password'
                    ></CFormInput>
                    <CButton
                      onClick={() => toogleSeePassword(false)}
                      type='button'
                      color='dark'
                      variant='outline'
                      id='see-password'
                    >
                      <CIcon icon={icon.cilLowVision}></CIcon>
                    </CButton>
                    {invalidInputs.password && (
                      <CFormFeedback invalid={invalidInputs.password}>
                        {invalidInputsMessages.password}
                      </CFormFeedback>
                    )}
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor='password_confirmation'>
                    Confirmação de senha
                  </CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      ref={passwordConfirmInputRef}
                      invalid={invalidInputs.password_confirmation}
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      id='password_confirmation'
                      name='password_confirmation'
                      type='password'
                    ></CFormInput>
                    <CButton
                      onClick={() => toogleSeePassword(true)}
                      type='button'
                      color='dark'
                      variant='outline'
                      id='see-confirm-password'
                    >
                      <CIcon icon={icon.cilLowVision}></CIcon>
                    </CButton>
                  </CInputGroup>
                  {invalidInputs.password_confirmation && (
                    <CFormFeedback
                      invalid={invalidInputs.password_confirmation}
                    >
                      {invalidInputsMessages.password_confirmation}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Users'>
                    <CButton href='#/admin/users' color='warning'>
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

export default UsersForm;
