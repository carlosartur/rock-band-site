@php
$primaryKeyField = array_filter($tablePropertyData, fn($item) => $item->Key == "PRI");
$primaryKeyField = reset($primaryKeyField);
@endphp

import CIcon from "@coreui/icons-react";
import { CButton, CButtonGroup, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CRow, CSpinner, CToast, CToastBody, CToastClose, CToaster } from "@coreui/react";
import api from "../../../api/api";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as icon from '@coreui/icons';
import { AuthComponent } from '../../../components/AuthComponent';

const {{ $tableCamel }}Form = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const id = params.get("id");
    const [loading, setLoading] = useState(false);

    const [toastContent, setToastContent] = useState(false);

    const [formData, setFormData] = useState({
      id,
      @foreach ($tablePropertyData as $tableProperty) @if ($tableProperty->Field == $primaryKeyField->Field) @continue @endif
      {{ $tableProperty->Field }}: '',
      @endforeach
    });

    const [invalidInputs, setInvalidInputs] = useState({
      @foreach ($tablePropertyData as $tableProperty) @if ($tableProperty->Field == $primaryKeyField->Field) @continue @endif
      {{ $tableProperty->Field }}: false,
      @endforeach
    });
    
    const [invalidInputsMessages, setInvalidInputsMessages] = useState({
      @foreach ($tablePropertyData as $tableProperty) @if ($tableProperty->Field == $primaryKeyField->Field) @continue @endif
      {{ $tableProperty->Field }}: '',
      @endforeach
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
        const response = await api.put(`${process.env.REACT_APP_API_URL}/admin/{{ $tableName }}`, formData);

        lauchToast({
          message: '{{ $tableCamel }} editada com sucesso!',
          color: 'success',
          visible: true,
        });

        setLoading(false);

        setTimeout(() => window.location.href = "#/admin/{{ $tableName }}", 1000);
        
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
          message: 'Erro ao salvar {{ $tableCamel }}!',
          color: 'danger',
          visible: true,
        });

        setLoading(false);
        console.error('Erro ao salvar {{ $tableCamel }}!', error);
      }
    };

    useEffect(() => {
      api.get(`${process.env.REACT_APP_API_URL}/admin/{{ $tableName }}/${id}`)
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
                  <strong>{ id ? "Editar" : "Nova" }</strong> <small>{{ $tableCamel }} { id ? `#${id}` : "" }</small>
                </CCardHeader>
                
                <CCardBody>
                  <CFormInput
                    type="hidden"
                    value={formData.id} 
                    onChange={handleChange} 
                    id="id"
                    name="id">
                  </CFormInput>
                  
                @foreach ($tablePropertyData as $tableProperty) @if ($tableProperty->Field == $primaryKeyField->Field) @continue @endif
                  <CCol xs={12}>
                    <CFormLabel htmlFor="{{$tableProperty->Field}}">{{$tableProperty->Field}}</CFormLabel>
                    <CFormInput 
                      invalid={{ "{invalidInputs." . $tableProperty->Field . "}" }}
                      value={{ "{formData." . $tableProperty->Field . "}" }}
                      onChange={handleChange} 
                      id="{{$tableProperty->Field}}"
                      name="{{$tableProperty->Field}}">
                    </CFormInput>
                    {{ "{ invalidInputs." . $tableProperty->Field }} && <CFormFeedback invalid={{ "{invalidInputs." . $tableProperty->Field . "}" }}>{{ "{invalidInputsMessages." . $tableProperty->Field . "}" }}</CFormFeedback> } 
                  </CCol>
                @endforeach

                </CCardBody>

                <CCardFooter>
                  <CCol xs={12} align="right">
                    <CButtonGroup role="group" aria-label="Ações de {{ $tableCamel }}">
                      <CButton href="#/admin/{{ $tableName }}" color="warning">
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

export default {{ $tableCamel }}Form;