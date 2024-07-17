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
  CFormSelect,
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

const ContactInfoForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState({
    id,
    value: '',
    type: '',
  });

  const [invalidInputs, setInvalidInputs] = useState({
    value: false,
    type: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    value: '',
    type: '',
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
        `${process.env.REACT_APP_API_URL}/admin/contact_info`,
        formData
      );

      lauchToast({
        message: 'ContactInfo editada com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/contact-info'), 1000);
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
        message: 'Erro ao salvar informação de contato!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar informação de contato!', error);
    }
  };

  useEffect(() => {
    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/contact_info/${id}`)
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
                <small>ContactInfo {id ? `#${id}` : ''}</small>
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
                  <CFormLabel htmlFor='type'>Tipo</CFormLabel>

                  <CFormSelect
                    value={formData.type}
                    onChange={handleChange}
                    id='type'
                    name='type'
                    invalid={invalidInputs.type}
                  >
                    <option value=''>Selecione uma opção</option>
                    <option value='phone'>
                      <span>Telefone</span>
                    </option>
                    <option value='email'>
                      <span>Email</span>
                    </option>
                    <option value='whats'>
                      <span>Whatsapp</span>
                    </option>
                  </CFormSelect>
                  {invalidInputs.type && (
                    <CFormFeedback invalid={invalidInputs.type}>
                      {invalidInputsMessages.type}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor='value'>Valor</CFormLabel>
                  <CFormInputWithMask
                    invalid={invalidInputs.value}
                    value={formData.value}
                    onChange={handleChange}
                    id='value'
                    name='value'
                    mask={formData.type == 'phone' ? '(00) 00000-0000' : ''}
                    type={formData.type == 'email' ? 'email' : 'text'}
                  />
                  {invalidInputs.value && (
                    <CFormFeedback invalid={invalidInputs.value}>
                      {invalidInputsMessages.value}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de ContactInfo'>
                    <CButton href='#/admin/contact-info' color='warning'>
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

export default ContactInfoForm;
