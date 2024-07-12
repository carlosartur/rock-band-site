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
  CFormSwitch,
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

const NewsletterForm = () => {
  const { search } = useLocation();
  const [states, setStates] = useState([]);
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState({
    id,
    name: '',
    email: '',
    enabled: '',
    state_id: '',
  });

  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    email: false,
    enabled: false,
    state_id: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    name: '',
    email: '',
    enabled: '',
    state_id: '',
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
        `${process.env.REACT_APP_API_URL}/admin/newsletter`,
        formData
      );

      lauchToast({
        message: 'Newsletter editada com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/newsletters'), 1000);
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
        message: 'Erro ao salvar Newsletter!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar Newsletter!', error);
    }
  };

  useEffect(() => {
    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/newsletter/${id}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    api
      .get(`${process.env.REACT_APP_API_URL}/admin/states/all`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar estados:', error);
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

      <CRow>
        <CCol xs={12}>
          <CForm onSubmit={handleSubmit} className='g-3'>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>{id ? 'Editar' : 'Nova'}</strong>{' '}
                <small>Newsletter {id ? `#${id}` : ''}</small>
              </CCardHeader>

              <CCardBody className='row'>
                <CFormInput
                  type='hidden'
                  value={formData.id}
                  onChange={handleChange}
                  id='id'
                  name='id'
                ></CFormInput>

                <CCol xs={6}>
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
                <CCol xs={6}>
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
                <CCol xs={6}>
                  <CFormLabel htmlFor='enabledCheckbox'>
                    Recebe newsletter
                  </CFormLabel>
                  <input
                    type='hidden'
                    value={formData.enabled}
                    id='enabled'
                    name='enabled'
                  />

                  <CFormSwitch
                    id='enabledCheckbox'
                    invalid={invalidInputs.enabled}
                    onChange={(e) => {
                      formData.enabled = e.target.checked;
                      handleChange(e);
                    }}
                    type='checkbox'
                    checked={!!formData.enabled}
                    label='Habilitado'
                  />
                  {invalidInputs.enabled && (
                    <CFormFeedback invalid={invalidInputs.enabled}>
                      {invalidInputsMessages.enabled}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={6}>
                  <CFormLabel htmlFor='state_id'>Estado</CFormLabel>
                  <CFormSelect
                    aria-label='Estado'
                    id='state_id'
                    name='state_id'
                    value={formData.state_id}
                    onChange={handleChange}
                  >
                    <option value=''>Selecione um estado</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name} ({state.acronym})
                      </option>
                    ))}
                  </CFormSelect>
                  {invalidInputs.state_id && (
                    <CFormFeedback invalid={invalidInputs.state_id}>
                      {invalidInputsMessages.state_id}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Newsletter'>
                    <CButton href='#/admin/newsletters' color='warning'>
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

export default NewsletterForm;
