import CIcon from "@coreui/icons-react";
import { CAlert, CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCardHeader, CCardImage, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CRow, CSpinner, CToast, CToastBody, CToastClose, CToaster } from "@coreui/react";
import api from "../../api/api";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as icon from '@coreui/icons';
import { AuthComponent } from '../../components/AuthComponent';
import { EditorComponent } from "../../components/EditorComponent";
import GalleryImageSelector from "../../components/GalleryImageSelector";

const BandMemberForm = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const id = params.get("id");
    const [loading, setLoading] = useState(false);

    const [toastContent, setToastContent] = useState(false);
    const [memberPhoto, setMemberPhoto] = useState('');
    const [addPhotoModalData, setAddPhotoModalData] = useState({
      visible: false,
    });

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
          message: 'Membro da banda editada com sucesso!',
          color: 'success',
          visible: true,
        });

        setLoading(false);

        setTimeout(() => window.location.href = "#/admin/bandmember", 1000);
        
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
          message: 'Erro ao salvar Membro da banda!',
          color: 'danger',
          visible: true,
        });

        setLoading(false);
        console.error('Erro ao salvar Membro da banda!', error);
      }
    };

    useEffect(() => {
      if(id) {
        api.get(`${process.env.REACT_APP_API_URL}/admin/band_member/${id}`)
          .then((response) => {
            setFormData(response.data);

            setMemberPhoto(`/storage/${response.data.photo.path}`)
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, []);

    return (
      <>
        <AuthComponent/>

        <CToaster ref={toaster} placement="top-end" push={toastContent}></CToaster>

        <GalleryImageSelector 
          visible={addPhotoModalData.visible} 
          onSelectPhoto={ item => {
            setMemberPhoto(item.path);
            setFormData({ ...formData, gallery_id: item.id })
          } } 
          onCloseCallback={() => setAddPhotoModalData({visible: false}) }
        />
        
        <CRow>
          <CCol xs={12}>
            <CForm onSubmit={handleSubmit} className="g-3">
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{ id ? "Editar" : "Novo" }</strong> <small>Membro da banda { id ? `#${id}` : "" }</small>
                </CCardHeader>
                
                <CCardBody className="row">
                  <CFormInput
                    type="hidden"
                    value={formData.id} 
                    onChange={handleChange} 
                    id="id"
                    name="id">
                  </CFormInput>
                  
                  <CCol xs={4}>
                    <CFormLabel htmlFor="name">Nome</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.name}
                      value={formData.name}
                      onChange={handleChange} 
                      id="name"
                      name="name">
                    </CFormInput>
                    { invalidInputs.name && <CFormFeedback invalid={invalidInputs.name}>{invalidInputsMessages.name}</CFormFeedback> } 
                  </CCol>
                  <CCol xs={4}>
                    <CFormLabel htmlFor="position">Posição</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.position}
                      value={formData.position}
                      onChange={handleChange} 
                      id="position"
                      name="position">
                    </CFormInput>
                    { invalidInputs.position && <CFormFeedback invalid={invalidInputs.position}>{invalidInputsMessages.position}</CFormFeedback> } 
                  </CCol>
                  <CCol xs={4}>
                    <CFormLabel htmlFor="position">Ordenação</CFormLabel>
                    <CFormInput 
                      invalid={invalidInputs.order}
                      value={formData.order}
                      onChange={handleChange} 
                      id="order"
                      name="order"
                      type="number"
                      min={0}
                      step={1}>
                    </CFormInput>
                    { invalidInputs.order && <CFormFeedback invalid={invalidInputs.order}>{invalidInputsMessages.order}</CFormFeedback> } 
                  </CCol>

                  <CCol xs={12}>
                    <CFormLabel htmlFor="description">Descrição</CFormLabel>

                    <EditorComponent
                      id='description'
                      initialValue={formData.description}
                      editorState={formData.description}
                      setEditorState={(newEditorState) => {
                        setFormData({ ...formData, description: newEditorState });
                      }}
                    />
                    { invalidInputs.description && <CFormFeedback invalid={invalidInputs.description}>{invalidInputsMessages.description}</CFormFeedback> } 
                  </CCol>
                
                  <CCol xs={12}>
                  <CFormLabel htmlFor='gallery_id'>Foto</CFormLabel>

                  {formData.gallery_id ? (
                    <CCard>
                      <CCardImage
                        orientation='top'
                        src={`${process.env.REACT_APP_API_URL}${memberPhoto}`}
                      />
                      <CCardFooter>
                        <CCol xs={12} align='right'>
                          <CButton
                            onClick={() =>
                              setAddPhotoModalData({ visible: true })
                            }
                            color="primary"
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
                          Nenhuma foto selecionada
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
                  <CCol xs={12} align="right">
                    <CButtonGroup role="group" aria-label="Ações de Membro da banda">
                      <CButton href="#/admin/bandmember" color="warning">
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