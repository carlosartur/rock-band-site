import {
  CAlert,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToaster,
  CToastClose,
  CToastBody,
  CToast,
  CFormSelect,
} from '@coreui/react';
import api from '../../api/api';
import React, { useEffect, useRef, useState } from 'react';
import { PaginationFromData } from '../../components/PaginationComponent';
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AuthComponent } from '../../components/AuthComponent';
import { BrazilianFormatData } from '../../../components/BrazilianFormatData';
import { Caret } from '../../components/Caret';
import { handleCsvExport } from '../../../utils/exportcsv';

const SearchResultsTable = (searchResponse) => {
  const {
    searchResults,
    onClickPagination,
    onClickDelete,
    onClickSort,
    sortData,
  } = searchResponse;

  if (!searchResults.total) {
    return (
      <CAlert color='warning'>Nenhuma informação de contato econtrada</CAlert>
    );
  }

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('id')}>
              #<Caret sortData={sortData} columnName='id'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('value')}>
              Valor
              <Caret sortData={sortData} columnName='value'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('type')}>
              Tipo
              <Caret sortData={sortData} columnName='type'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('created_at')}
            >
              Criado em
              <Caret sortData={sortData} columnName='created_at'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('updated_at')}
            >
              Atualizado em
              <Caret sortData={sortData} columnName='updated_at'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col'>Ações</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {searchResults.data.map((item, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope='row'>{item.id}</CTableHeaderCell>
              <CTableDataCell>{item.value}</CTableDataCell>
              <CTableDataCell>
                {(() => {
                  return {
                    phone: 'Telefone',
                    whats: 'Whatsapp',
                    email: 'Email',
                  }[item.type];
                })()}
                &nbsp;
                {(() => {
                  if ('phone' === item.type) {
                    return (
                      <CIcon
                        size='sm'
                        className='text-primary'
                        icon={icon.cilPhone}
                      ></CIcon>
                    );
                  }
                  if ('whats' === item.type) {
                    return (
                      <CIcon
                        size='sm'
                        className='text-success'
                        icon={icon.cibWhatsapp}
                      ></CIcon>
                    );
                  }
                  return (
                    <CIcon
                      size='sm'
                      className='text-dark'
                      icon={icon.cilEnvelopeClosed}
                    ></CIcon>
                  );
                })()}
              </CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.created_at} />
              </CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.updated_at} />
              </CTableDataCell>
              <CTableDataCell>
                <CButtonGroup
                  role='group'
                  aria-label='Ações de informações de contato'
                >
                  <CButton
                    color='primary'
                    href={`#/admin/contact-info-form?id=${item.id}`}
                  >
                    <CIcon icon={icon.cilPencil} size='lg' />
                  </CButton>

                  <CButton
                    color='danger'
                    onClick={() =>
                      onClickDelete({
                        id: item.id,
                        visible: true,
                        name: item.value,
                      })
                    }
                  >
                    <CIcon icon={icon.cilTrash} size='lg' />
                  </CButton>
                </CButtonGroup>
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

const ContactInfo = () => {
  const [loading, setLoading] = useState(false);

  const [toastContent, setToastContent] = useState(false);
  const toaster = useRef();
  const [csvLoading, setCsvLoading] = useState(false);

  const [deleteModalData, setDeleteModalData] = useState({
    visible: false,
    name: '',
    id: 0,
  });

  const [currentSetOrdering, setCurrentSetOrdering] = useState({
    order_by: 'id',
    order_by_direction: 'asc',
  });

  const [searchResults, setSearchResults] = useState([]);

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

  const [formData, setFormData] = useState({
    id: '',
    value: '',
    type: '',
    order_by: 'id',
    order_by_direction: 'asc',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

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
        `${process.env.REACT_APP_API_URL}/admin/contact_info`,
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
      `${process.env.REACT_APP_API_URL}/admin/contact_info/export-to-csv`
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

  const deleteContactInfo = async (contact_infoId) => {
    try {
      const response = await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/contact_info`,
        {
          params: { id: contact_infoId },
        }
      );

      lauchToast({
        message: 'Excluído com sucesso!',
        color: 'success',
        visible: true,
      });

      handleSubmit();
    } catch (error) {
      console.error(error);

      lauchToast({
        message: 'Falha na exclusão da informação de contato.',
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
      <AuthComponent />

      <CToaster
        ref={toaster}
        placement='top-end'
        push={toastContent}
      ></CToaster>

      <CModal
        alignment='center'
        visible={deleteModalData.visible}
        onClose={() => setDeleteModalData({ visible: false })}
      >
        <CModalHeader>
          <CModalTitle>Excluir informação de contato</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir a informação de contato{' '}
          {deleteModalData.name}? Essa ação não pode ser desfeita!
        </CModalBody>
        <CModalFooter>
          <CButton
            color='secondary'
            onClick={() => setDeleteModalData({ visible: false })}
          >
            Cancelar
          </CButton>
          <CButton
            color='danger'
            onClick={() => {
              deleteContactInfo(deleteModalData.id);
              setDeleteModalData({ visible: false });
            }}
          >
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CCard className='mb-4'>
            <CForm onSubmit={handleSubmit} className='g-3'>
              <CCardHeader>
                <strong>Informação de contato</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row'>
                <CCol xs={4}>
                  <CFormLabel htmlFor='value'>Valor</CFormLabel>
                  <CFormInput
                    value={formData.value}
                    onChange={handleChange}
                    id='value'
                    name='value'
                  ></CFormInput>
                </CCol>

                <CCol xs={4}>
                  <CFormLabel htmlFor='type'>Tipo</CFormLabel>

                  <CFormSelect
                    value={formData.type}
                    onChange={handleChange}
                    id='type'
                    name='type'
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
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de ContactInfo'>
                    <CButton type='submit' disabled={loading}>
                      {loading ? (
                        <CSpinner
                          component='span'
                          size='sm'
                          aria-hidden='true'
                        />
                      ) : (
                        <CIcon icon={icon.cilZoom} size='lg' />
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
                    <CButton href='#/admin/contact-info-form' color='success'>
                      <CIcon icon={icon.cilPlus} size='lg' />
                      &nbsp; Adicionar
                    </CButton>
                  </CButtonGroup>
                </CCol>
              </CCardFooter>
            </CForm>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className='mb-4'>
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
  );
};

export default ContactInfo;
