import CIcon from "@coreui/icons-react";
import { CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CRow, CSpinner, CToast, CToastBody, CToastClose, CToaster } from "@coreui/react";
import api from "../../../api/api";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as icon from '@coreui/icons';
import { AuthComponent } from '../../../components/AuthComponent';

const BandMemberForm = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const id = params.get("id");
    const [loading, setLoading] = useState(false);

    const [toastContent, setToastContent] = useState(false);

    const [formData, setFormData] = useState({
      id,
               name: '',
             position: '',
             description: '',
             gallery_id: '',
             created_at: '',
             updated_at: '',
          });

    const [invalidInputs, setInvalidInputs] = useState({
               name: false,
             position: false,
             description: false,
             gallery_id: false,
             created_at: false,
             updated_at: false,
          });
    
    const [invalidInputsMessages, setInvalidInputsMessages] = useState({
               name: '',
             position: '',
             description: '',
             gallery_id: '',
             created_at: '',
             updated_at: '',
          });

    const toaster = useRef();

    const lauchToast = toastData => {
      const toastInternal = (<CToast autohide={false} visible={toastData.visible} color={toastData.color} className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody>{toastData.message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>)
      
      setToastContent(toastInternal);
    };

    const handleChange = (e) => {
      let { name, value } = e.target;
  
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      if(e) {
        e.preventDefault();
      }
  
      setLoading(true);

      let validationFailedFields = {};

      Object.keys(invalidInputs).forEach(invalidInput => validationFailedFields[invalidInput] = false);
      setInvalidInputs(validationFailedFields);

      try {
        const response = await api.put(`${process.env.REACT_APP_API_URL}/admin/band_member`, formData);

        lauchToast({
          message: 'BandMember editada com sucesso!',
          color: 'success',
          visible: true,
        });

        setLoading(false);

        setTimeout(() => window.location.href = "#/admin/band_member", 1000);
        
      } catch (error) {

        if (error?.response?.data?.inputs) {
          validationFailedFields = {};

          Object.keys(invalidInputs).forEach(invalidInput => {
            validationFailedFields[invalidInput] = false;
            invalidInputsMessages[invalidInput] = "";
          });

          setInvalidInputsMessages(Object.assign(invalidInputsMessages, error.response.data.inputs));

          Object.keys(error.response.data.inputs).forEach(invalidInput => validationFailedFields[invalidInput] = true);

          setInvalidInputs(validationFailedFields);
        }

        lauchToast({
          message: 'Erro ao salvar BandMember!',
          color: 'danger',
          visible: true,
        });

        setLoading(false);
        console.error('Erro ao salvar BandMember!', error);
      }
    };

    useEffect(() => {
      api.get(`${process.env.REACT_APP_API_URL}/admin/band_member/${id}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    return (
      <>
        <AuthComponent/>

        <CToaster ref={toaster} placement="top-end" push={toastContent}></CToaster>
        
        <CRow>
          <CCol xs={12}>
            <CForm onSubmit={handleSubmit} className="g-3">
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{ id ? "Editar" : "Nova" }</strong> <small>BandMember { id ? `#${id}` : "" }</small>
                </CCardHeader>
                
                <CCardBody>
                  <CFormInput
                    type="hidden"
                    value={formData.id} 
                    onChange={handleChange} 
                    id="id"
                    name="id">
                  </CFormInput>
                  
                                     <CCol xs={12}>
                    <CFormLabel htmlFor="name">name</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.name}
                      value={formData.name}
                      onChange={handleChange} 
                      id="name"
                      name="name">
                    </CFormInput>
                    { invalidInputs.name && <CFormFeedback invalid={invalidInputs.name}>{invalidInputsMessages.name}</CFormFeedback> } 
                  </CCol>
                                   <CCol xs={12}>
                    <CFormLabel htmlFor="position">position</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.position}
                      value={formData.position}
                      onChange={handleChange} 
                      id="position"
                      name="position">
                    </CFormInput>
                    { invalidInputs.position && <CFormFeedback invalid={invalidInputs.position}>{invalidInputsMessages.position}</CFormFeedback> } 
                  </CCol>
                                   <CCol xs={12}>
                    <CFormLabel htmlFor="description">description</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.description}
                      value={formData.description}
                      onChange={handleChange} 
                      id="description"
                      name="description">
                    </CFormInput>
                    { invalidInputs.description && <CFormFeedback invalid={invalidInputs.description}>{invalidInputsMessages.description}</CFormFeedback> } 
                  </CCol>
                                   <CCol xs={12}>
                    <CFormLabel htmlFor="gallery_id">gallery_id</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.gallery_id}
                      value={formData.gallery_id}
                      onChange={handleChange} 
                      id="gallery_id"
                      name="gallery_id">
                    </CFormInput>
                    { invalidInputs.gallery_id && <CFormFeedback invalid={invalidInputs.gallery_id}>{invalidInputsMessages.gallery_id}</CFormFeedback> } 
                  </CCol>
                                   <CCol xs={12}>
                    <CFormLabel htmlFor="created_at">created_at</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.created_at}
                      value={formData.created_at}
                      onChange={handleChange} 
                      id="created_at"
                      name="created_at">
                    </CFormInput>
                    { invalidInputs.created_at && <CFormFeedback invalid={invalidInputs.created_at}>{invalidInputsMessages.created_at}</CFormFeedback> } 
                  </CCol>
                                   <CCol xs={12}>
                    <CFormLabel htmlFor="updated_at">updated_at</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.updated_at}
                      value={formData.updated_at}
                      onChange={handleChange} 
                      id="updated_at"
                      name="updated_at">
                    </CFormInput>
                    { invalidInputs.updated_at && <CFormFeedback invalid={invalidInputs.updated_at}>{invalidInputsMessages.updated_at}</CFormFeedback> } 
                  </CCol>
                
                </CCardBody>

                <CCardFooter>
                  <CCol xs={12} align="right">
                    <CButtonGroup role="group" aria-label="Ações de BandMember">
                      <CButton href="#/admin/band_member" color="warning">
                        <CIcon icon={icon.cilX} />
                        &nbsp;
                        Cancelar
                      </CButton>
                      <CButton type="submit" color="success" disabled={loading}>
                        {loading ? (
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                        ): (
                          <CIcon icon={icon.cilCheckAlt}/>
                        )}
                        &nbsp;
                        Salvar
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

export default BandMemberForm;