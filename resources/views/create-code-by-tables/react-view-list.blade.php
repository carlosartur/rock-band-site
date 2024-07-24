@php
$editUrl = '{`#/admin/' . $tableName . '-form?id=${item.id}`}';
@endphp

import { CAlert, CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardFooter, CCol, CForm, CFormInput, CFormLabel, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CToaster, CToastClose, CToastBody, CToast } from '{{ '@coreui' }}/react';
import api from "../../../api/api";
import React, { useEffect, useRef, useState } from 'react';
import { CFormInputWithMask } from '../../../components/CFormInputWithMask';
import { PaginationFromData } from '../../../components/PaginationComponent';
import * as icon from '{{ '@coreui' }}/icons';
import CIcon from '{{ '@coreui' }}/icons-react';
import { AuthComponent } from '../../../components/AuthComponent';
import { Caret } from '../../../components/Caret';
import { handleCsvExport } from '../../../utils/exportcsv';

const SearchResultsTable = searchResponse => {
  const { searchResults, onClickPagination, onClickDelete } = searchResponse;

  if (!searchResults.total) {
    return (
      <CAlert color="warning">Nenhuma {{ $tableCamel }} econtrada</CAlert>
    );
  }

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>

            @foreach ($tablePropertyData as $tableProperty) @if(in_array($tableProperty->Field, ['id', 'created_at', 'updated_at'])) @continue  @endif
            <CTableHeaderCell scope="col">{{ $tableProperty->Field }}</CTableHeaderCell>
            @endforeach
            <CTableHeaderCell 
              scope="col"
              style={!! "{" . "{ width: '150px'}" . "}" !!}
              onClick={ () => onClickSort("created_at") }
            >
              Criado em
              <Caret sortData={sortData} columnName="created_at"></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell 
              scope="col"
              style={!! "{" . "{ width: '150px'}" . "}" !!}
              onClick={ () => onClickSort("updated_at") }
            >
              Atualizado em
              <Caret sortData={sortData} columnName="updated_at"></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">Ações</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>

          {searchResults.data.map((item, index) => <CTableRow key={index}>
            <CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
            
            @foreach ($tablePropertyData as $tableProperty) @if(in_array($tableProperty->Field, ['id', 'created_at', 'updated_at'])) @continue  @endif
            <CTableDataCell>{{ '{item.' . $tableProperty->Field . '}' }}</CTableDataCell>
            @endforeach
            <CTableDataCell><BrazilianFormatData date={item.created_at}/></CTableDataCell>
            <CTableDataCell><BrazilianFormatData date={item.updated_at}/></CTableDataCell>
            <CTableDataCell>              
              <CButtonGroup role="group" aria-label="Ações de {{ $tableCamel }}">
                <CButton color="primary" href={{ $editUrl }}><CIcon icon={icon.cilPencil} size="lg"/></CButton>
                
                <CButton 
                  color="danger" 
                  onClick={!! '{() => onClickDelete({
                    id: item.id,
                    visible: true,
                    name: item.name,
                  })}'
                  !!}
                  
                >
                  <CIcon icon={icon.cilTrash} size="lg"/>
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
            
          </CTableRow>)}

        </CTableBody>
      </CTable>
      <PaginationFromData searchResults={searchResults} clickFunction={onClickPagination}></PaginationFromData>
    </>
  );
}

const {{ $tableCamel }} = () => {
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [toastContent, setToastContent] = useState(false);
  const toaster = useRef();

  const [deleteModalData, setDeleteModalData] = useState({
    visible: false,
    name: '',
    id: 0
  });

  const [currentSetOrdering, setCurrentSetOrdering] = useState({
    order_by: 'id',
    order_by_direction: 'asc',
  });

  const [searchResults, setSearchResults] = useState([]);
  
  const lauchToast = toastData => {
    const toastInternal = (<CToast autohide={false} visible={toastData.visible} color={toastData.color} className="text-white align-items-center">
        <div className="d-flex">
          <CToastBody>{toastData.message}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>)
    
    setToastContent(toastInternal);
  };

  const [formData, setFormData] = useState({
    @foreach ($tablePropertyData as $tableProperty) @if(in_array($tableProperty->Field, ['id', 'created_at', 'updated_at'])) @continue  @endif
    {{ $tableProperty->Field }}: '',
    @endforeach
    order_by: 'id',
    order_by_direction: 'asc',
  });

  const orderOnClick = (orderField) => {
    const currentOrderDirection = formData.order_by != orderField
      ? 'asc'
      : (
        formData.order_by_direction == 'asc' 
          ? 'desc' 
          : 'asc'
        );

    setFormData({
      ...formData, 
      order_by: orderField,
      order_by_direction: currentOrderDirection, 
    });

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

    try {
      const response = await api.get(`${process.env.REACT_APP_API_URL}/admin/{{ $tableName }}`, {
        params: formData,
      });
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const csvExport = async (e) => {
    if(e) {
      e.preventDefault();
    }

    return handleCsvExport(
      formData,
      lauchToast,
      setCsvLoading,  
      `${process.env.REACT_APP_API_URL}/admin/{{ $tableName }}/export-to-csv`
    );

  };

  const makePageRequest = async (e) => {
    const linkpaginacao = e.target.getAttribute('linkpaginacao');

    try {
      const response = await api.get(linkpaginacao);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const delete{{ $tableCamel }} = async {{ $tableName }}Id => {
    try {
      const response = await api.delete(`${process.env.REACT_APP_API_URL}/admin/{{ $tableName }}`, {
        params: { id: {{ $tableName }}Id },
      });

      lauchToast({
        message: 'Excluído com sucesso!',
        color: 'success',
        visible: true,
      });

      handleSubmit();
    } catch (error) {
      console.error(error);

      lauchToast({
        message: 'Falha na exclusão de {{ $tableCamel }}.',
        color: 'danger',
        visible: true,
      });

      handleSubmit();
    }

  };
  
  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    if (
      formData.order_by === currentSetOrdering.order_by &&
      formData.order_by_direction === currentSetOrdering.order_by_direction
    ) {
      return;
    }

    setCurrentSetOrdering({
      order_by: formData.order_by,
      order_by_direction: formData.order_by_direction,
    });

    handleSubmit();
  }, [formData]);

  return (
    <>
      <AuthComponent/>

      <CToaster ref={toaster} placement="top-end" push={toastContent}></CToaster>

      <CModal alignment="center" visible={deleteModalData.visible} onClose={() => setDeleteModalData({visible: false})}>
        <CModalHeader>
          <CModalTitle>Excluir {{ $tableCamel }} {deleteModalData.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir a {{ $tableCamel }} {deleteModalData.name}? Essa ação não pode ser desfeita!
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalData({visible: false})}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => {
            delete{{ $tableCamel }}(deleteModalData.id);
            setDeleteModalData({visible: false});
          }}>Excluir</CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CForm onSubmit={handleSubmit} className="g-3">  
              <CCardHeader>
                <strong>{{ $tableCamel }}</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row'>
              
              @foreach ($tablePropertyData as $tableProperty)
                <CCol xs={4}>
                  <CFormLabel htmlFor="{{ $tableProperty->Field }}">{{ $tableProperty->Field }}</CFormLabel>
                  <CFormInput 
                    value={{ "{formData." . $tableProperty->Field . "}" }} 
                    onChange={handleChange} 
                    id="{{ $tableProperty->Field }}"
                    name="{{ $tableProperty->Field }}">
                  </CFormInput>
                </CCol>
              @endforeach

              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align="right">
                  <CButtonGroup role="group" aria-label="Ações de {{ $tableCamel }}">
                    <CButton type="submit" disabled={loading}>
                      {loading ? (
                        <CSpinner component="span" size="sm" aria-hidden="true" />
                      ): (
                        <CIcon icon={icon.cilZoom} size="lg"/>
                      )}
                      &nbsp;
                      Buscar
                    </CButton>
                    <CButton type="button" color='dark' disabled={csvLoading} onClick={csvExport}>
                      {csvLoading ? (
                        <CSpinner component="span" size="sm" aria-hidden="true" />
                      ): (
                        <CIcon icon={icon.cilSpreadsheet}/>
                      )}
                      &nbsp;
                      Exportar planilha
                    </CButton>
                    <CButton href='{{ "#/admin/{$tableName}-form" }}' color="success">
                      <CIcon icon={icon.cilPlus} size="lg"/>
                      &nbsp;
                      Adicionar
                    </CButton>
                  </CButtonGroup>
                </CCol>

              </CCardFooter>
            </CForm>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Resultados</strong> <small>Busca</small>
            </CCardHeader>
            <CCardBody>
              <SearchResultsTable 
                searchResults={searchResults} 
                onClickPagination={makePageRequest} 
                onClickDelete={setDeleteModalData}
                onClickSort={orderOnClick}
                sortData={formData}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
};

export default {{ $tableCamel }}
