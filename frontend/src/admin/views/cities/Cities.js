import {
  CAlert,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react';
import api from '../../api/api';
import React, { useEffect, useRef, useState } from 'react';
import { PaginationFromData } from '../../components/PaginationComponent';
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AuthComponent } from '../../components/AuthComponent';
import { Caret } from '../../components/Caret';
import { CFormInputWithMask } from '../../components/CFormInputWithMask';
import { handleCsvExport } from '../../utils/exportcsv';

function formatPostCode(postcode) {
  postcode = String(postcode);

  if (postcode.length === 8) {
    const firstPart = postcode.substr(0, 5);
    const secondPart = postcode.substr(5, 3);

    return firstPart + '-' + secondPart;
  }

  return postcode;
}

const SearchResultsTable = (searchResponse) => {
  const { searchResults, onClickPagination, onClickSort, sortData } =
    searchResponse;

  if (!searchResults.total) {
    return <CAlert color='warning'>Nenhuma cidade econtrada</CAlert>;
  }

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('id')}>
              #<Caret sortData={sortData} columnName='id'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('name')}>
              Nome
              <Caret sortData={sortData} columnName='name'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col'>Estado</CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('code')}>
              Codigo IBGE
              <Caret sortData={sortData} columnName='code'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('postcode_start')}
            >
              CEP Inicial
              <Caret sortData={sortData} columnName='postcode_start'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('postcode_end')}
            >
              CEP Final
              <Caret sortData={sortData} columnName='postcode_end'></Caret>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {searchResults.data.map((item, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope='row'>{item.id}</CTableHeaderCell>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.state.name}</CTableDataCell>
              <CTableDataCell>{item.code}</CTableDataCell>
              <CTableDataCell>
                {formatPostCode(item.postcode_start)}
              </CTableDataCell>
              <CTableDataCell>
                {formatPostCode(item.postcode_end)}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <PaginationFromData
        searchResults={searchResults}
        clickFunction={onClickPagination}
      ></PaginationFromData>
    </>
  );
};

const Cities = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [toastContent, setToastContent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    state_id: '',
    code: '',
    postcode: '',
    order_by: 'id',
    order_by_direction: 'asc',
  });

  const [currentSetOrdering, setCurrentSetOrdering] = useState({
    order_by: 'id',
    order_by_direction: 'asc',
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

    if ('postcode' === name) {
      value = value.replace(/-/g, '');
    }

    setFormData({ ...formData, [name]: value });
  };

  const orderOnClick = (orderField) => {
    const currentOrderDirection =
      formData.order_by != orderField
        ? 'asc'
        : formData.order_by_direction == 'asc'
          ? 'desc'
          : 'asc';

    setFormData({
      ...formData,
      order_by: orderField,
      order_by_direction: currentOrderDirection,
    });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/admin/cities`,
        {
          params: formData,
        }
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const csvExport = async (e) => {
    if (e) {
      e.preventDefault();
    }

    return handleCsvExport(
      formData,
      lauchToast,
      setCsvLoading,
      `${process.env.REACT_APP_API_URL}/admin/cities/export-to-csv`
    );
  };

  const makeCityRequest = async (e) => {
    const linkpaginacao = e.target.getAttribute('linkpaginacao');

    try {
      const response = await api.get(linkpaginacao);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  useEffect(() => {
    handleSubmit();

    api
      .get(`${process.env.REACT_APP_API_URL}/admin/states/all`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar estados:', error);
      });
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
      <AuthComponent />
      <CToaster
        ref={toaster}
        placement='top-end'
        push={toastContent}
      ></CToaster>
      <CRow>
        <CCol xs={12}>
          <CForm onSubmit={handleSubmit}>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>Cidade</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row g-3'>
                <CCol xs={4}>
                  <CFormLabel htmlFor='name'>Nome</CFormLabel>
                  <CFormInput
                    value={formData.name}
                    onChange={handleChange}
                    id='name'
                    name='name'
                  ></CFormInput>
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='state_id'>Estado</CFormLabel>
                  <CFormSelect
                    aria-label='Estado da cidade'
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
                </CCol>
                <CCol xs={2}>
                  <CFormLabel value={formData.code} htmlFor='code'>
                    Código IBGE
                  </CFormLabel>
                  <CFormInputWithMask
                    mask='0000000'
                    onChange={handleChange}
                    id='code'
                    name='code'
                  ></CFormInputWithMask>
                </CCol>
                <CCol xs={2}>
                  <CFormLabel htmlFor='postcode'>CEP</CFormLabel>
                  <CFormInputWithMask
                    mask='00000-000'
                    onChange={handleChange}
                    id='postcode'
                    name='postcode'
                  ></CFormInputWithMask>
                </CCol>
              </CCardBody>
              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Users'>
                    <CButton type='submit' disabled={loading} color='primary'>
                      {loading ? (
                        <CSpinner
                          component='span'
                          size='sm'
                          aria-hidden='true'
                        />
                      ) : (
                        <CIcon icon={icon.cilZoom} />
                      )}
                      &nbsp; Buscar
                    </CButton>
                    <CButton
                      type='button'
                      color='dark'
                      disabled={csvLoading}
                      onClick={csvExport}
                    >
                      {csvLoading ? (
                        <CSpinner
                          component='span'
                          size='sm'
                          aria-hidden='true'
                        />
                      ) : (
                        <CIcon icon={icon.cilSpreadsheet} />
                      )}
                      &nbsp; Exportar planilha
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CCardFooter>
            </CCard>
          </CForm>
        </CCol>

        <CCol xs={12}>
          <CCard className='mb-4'>
            <CCardHeader>
              <strong>Resultados</strong> <small>Busca</small>
            </CCardHeader>
            <CCardBody>
              <SearchResultsTable
                searchResults={searchResults}
                onClickPagination={makeCityRequest}
                onClickSort={orderOnClick}
                sortData={formData}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Cities;
