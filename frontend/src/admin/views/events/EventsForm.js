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
import { EditorComponent } from '../../components/EditorComponent';

const EventsForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [toastContent, setToastContent] = useState(false);

  const [formData, setFormData] = useState({
    id,
    name: '',
    conditions: '',
    organizer: '',
    date_start: '',
    date_end: '',
    enabled: '',
    city_id: '',
    state_id: '',
    photos: [],
  });

  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    organizer: false,
    date_start: false,
    date_end: false,
    enabled: false,
    city_id: false,
    created_at: false,
    updated_at: false,
  });

  const [invalidInputsMessages, setInvalidInputsMessages] = useState({
    name: '',
    organizer: '',
    date_start: '',
    date_end: '',
    enabled: '',
    city_id: '',
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
        `${process.env.REACT_APP_API_URL}/admin/events`,
        formData
      );

      lauchToast({
        message: 'Evento editado com sucesso!',
        color: 'success',
        visible: true,
      });

      setLoading(false);

      setTimeout(() => (window.location.href = '#/admin/events'), 1000);
    } catch (error) {
      if (error?.response?.data?.inputs) {
        validationFailedFields = {};

        Object.keys(invalidInputs).forEach((invalidInput) => {
          validationFailedFields[invalidInput] = false;
          invalidInputsMessages[invalidInput] = '';
        });

        const newFormData = {
          ...invalidInputsMessages,
          ...error.response.data.inputs,
        };

        setInvalidInputsMessages(newFormData);

        Object.keys(error.response.data.inputs).forEach(
          (invalidInput) => (validationFailedFields[invalidInput] = true)
        );

        setInvalidInputs(validationFailedFields);
      }

      lauchToast({
        message: 'Erro ao salvar evento!',
        color: 'danger',
        visible: true,
      });

      setLoading(false);
      console.error('Erro ao salvar evento!', error);
    }
  };

  const getCitiesByState = (e) => {
    const stateId = e.target.value;

    setLoadingCities(true);

    api
      .get(`${process.env.REACT_APP_API_URL}/admin/states/cities/${stateId}`)
      .then((response) => {
        setCities(response.data);
        setLoadingCities(false);
      })
      .catch((error) => {
        setLoadingCities(false);

        const newFormData = { ...formData, city_id: '' };
        setFormData(newFormData);

        console.error('Erro ao buscar estados:', error);
      });
  };

  useEffect(() => {
    api
      .get(`${process.env.REACT_APP_API_URL}/admin/states/all`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar estados:', error);
      });

    if (id) {
      api
        .get(`${process.env.REACT_APP_API_URL}/admin/events/${id}`)
        .then((response) => {
          setCities(response.data.city.state.cities);

          const newFormData = {
            ...response.data,
            state_id: response.data.city.state.id,
          };

          setFormData(newFormData);
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
                <small>Evento {id ? `#${id}` : ''}</small>
              </CCardHeader>

              <CCardBody className='row'>
                <CFormInput
                  type='hidden'
                  value={formData.id}
                  onChange={handleChange}
                  id='id'
                  name='id'
                ></CFormInput>

                <CCol xs={3}>
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
                <CCol xs={3}>
                  <CFormLabel htmlFor='organizer'>Organizador</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.organizer}
                    value={formData.organizer}
                    onChange={handleChange}
                    id='organizer'
                    name='organizer'
                  ></CFormInput>
                  {invalidInputs.organizer && (
                    <CFormFeedback invalid={invalidInputs.organizer}>
                      {invalidInputsMessages.organizer}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={3}>
                  <CFormLabel htmlFor='date_start'>Data</CFormLabel>
                  <CFormInput
                    invalid={invalidInputs.date_start}
                    value={formData.date_start}
                    onChange={handleChange}
                    id='date_start'
                    name='date_start'
                    type='datetime-local'
                  ></CFormInput>
                  {invalidInputs.date_start && (
                    <CFormFeedback invalid={invalidInputs.date_start}>
                      {invalidInputsMessages.date_start}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={3}>
                  <CFormLabel htmlFor='enabled'>Habilitado</CFormLabel>

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
                    defaultChecked={!!formData.enabled}
                    checked={!!formData.enabled}
                    label='Habilitado'
                  />

                  {invalidInputs.enabled && (
                    <CFormFeedback invalid={invalidInputs.enabled}>
                      {invalidInputsMessages.enabled}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor='state_id'>Estado</CFormLabel>
                  <CFormSelect
                    aria-label='Estado da cidade'
                    id='state_id'
                    name='state_id'
                    value={formData.state_id}
                    onChange={(e) => {
                      handleChange(e);
                      getCitiesByState(e);
                    }}
                  >
                    <option value=''>Selecione um estado</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name} ({state.acronym})
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor='city_id'>Cidade</CFormLabel>
                  {loadingCities ? (
                    <>
                      <br />
                      <CSpinner component='span' size='sm' aria-hidden='true' />
                    </>
                  ) : (
                    <CFormSelect
                      aria-label='Cidade'
                      id='city_id'
                      name='city_id'
                      value={formData.city_id}
                      onChange={handleChange}
                      invalid={invalidInputs.city_id}
                    >
                      <option value=''>Selecione uma Cidade</option>
                      {cities.map((city) => (
                        <option
                          key={city.id}
                          value={city.id}
                          selected={city.selected}
                        >
                          {city.name}
                        </option>
                      ))}
                    </CFormSelect>
                  )}

                  {invalidInputs.city_id && (
                    <CFormFeedback invalid={invalidInputs.city_id}>
                      {invalidInputsMessages.city_id}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor='conditions'>Descrição</CFormLabel>

                  <EditorComponent
                    id='conditions'
                    initialValue={formData.conditions}
                    editorState={formData.conditions}
                    setEditorState={(newEditorState) => {
                      setFormData({ ...formData, conditions: newEditorState });
                    }}
                  />

                  <CFormInput
                    invalid={invalidInputs.conditions}
                    value={formData.conditions}
                    onChange={handleChange}
                    name='conditions'
                    type='hidden'
                  ></CFormInput>
                  {invalidInputs.conditions && (
                    <CFormFeedback invalid={invalidInputs.conditions}>
                      {invalidInputsMessages.conditions}
                    </CFormFeedback>
                  )}
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de eventos'>
                    <CButton href='#/admin/events' color='warning'>
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

export default EventsForm;
