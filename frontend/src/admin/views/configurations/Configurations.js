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
} from '@coreui/react';
import api from '../../api/api';
import React, { useEffect, useRef, useState } from 'react';
import { PaginationFromData } from '../../components/PaginationComponent';
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AuthComponent } from '../../components/AuthComponent';
import { handleCsvExport } from '../../utils/exportcsv';
import { BrazilianFormatData } from '../../components/BrazilianFormatData';
import { stringLimit } from '../../../Utils/Utils';

const SearchResultsTable = (searchResponse) => {
  const { searchResults, onClickPagination, onClickDelete, onClickSort } = searchResponse;

  if (!searchResults.total) {
    return <CAlert color='warning'>Nenhuma configuração econtrada</CAlert>;
  }

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope='col' style={{ width: '50px' }}>#</CTableHeaderCell>

            <CTableHeaderCell scope='col'>Nome</CTableHeaderCell>
            <CTableHeaderCell scope='col'>Valor</CTableHeaderCell>
            <CTableHeaderCell scope='col'>Tipo</CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              style={{ width: '150px' }}
              onClick={() => onClickSort('updated_at')}
            >
              Atualizado em
            </CTableHeaderCell>
            <CTableHeaderCell scope='col'>Ações</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {searchResults.data.map((item, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope='row'>{item.id}</CTableHeaderCell>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>
                {(() => {
                  if (!item.value) {
                    return <span>-</span>;
                  }

                  switch (item.type) {
                    case 'gallery':
                      return (
                        <img
                          style={{ maxWidth: '100px' }}
                          src={
                            process.env.REACT_APP_API_URL +
                            item.value_translated
                          }
                          alt='Gallery'
                        />
                      );
                    case 'page':
                      return <div>{item.value_translated.title}</div>;
                    case 'text':
                      return <div>{item.value_translated}</div>;
                    case 'string':
                      return <div>{stringLimit(item.value)}</div>;
                    case 'multivalues':
                      return <span>
                        {Object.entries(JSON.parse(item.value)).map((val, idx) => {
                          return <p key={idx}>
                            <b>{val[0]}:</b>
                            <span> {val[1]}</span>
                          </p>
                        })}
                      </span>;
                    default:
                      return null; // Lida com outros casos, se necessário
                  }
                })()}
              </CTableDataCell>
              <CTableDataCell>
                {(() => {
                  switch (item.type) {
                    case 'gallery':
                      return <span>Imagem</span>;
                    case 'text':
                      return <span>Texto longo</span>;
                    case 'string':
                      return <span>Texto curto</span>;
                    case 'page':
                      return <span>Página</span>;
                    case 'multivalues':
                      return <span>Múltiplos valores</span>;
                    default:
                      return <span>-</span>; // Lida com outros casos, se necessário
                  }
                })()}
              </CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.updated_at} />
              </CTableDataCell>
              <CTableDataCell>
                <CButtonGroup role='group' aria-label='Ações de Configurations'>
                  <CButton
                    color='primary'
                    href={`#/admin/configurations-form?id=${item.id}`}
                  >
                    <CIcon icon={icon.cilPencil} size='lg' />
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

const Configurations = () => {
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [toastContent, setToastContent] = useState(false);
  const toaster = useRef();

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
    name: '',
    value: '',
    type: '',
    order_by: 'id',
    order_by_direction: 'asc',
  });

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

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    try {
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/admin/configurations`,
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
      `${process.env.REACT_APP_API_URL}/admin/configurations/export-to-csv`
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

  const deleteConfigurations = async (configurationsId) => {
    try {
      const response = await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/configurations`,
        {
          params: { id: configurationsId },
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
        message: 'Falha na exclusão de Configurations.',
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
          <CModalTitle>
            Excluir Configurations {deleteModalData.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir a Configurations {deleteModalData.name}
          ? Essa ação não pode ser desfeita!
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
              deleteConfigurations(deleteModalData.id);
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
                <strong>Configurations</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row'>
                <CCol xs={4}>
                  <CFormLabel htmlFor='name'>Nome</CFormLabel>
                  <CFormInput
                    value={formData.name}
                    onChange={handleChange}
                    id='name'
                    name='name'
                  ></CFormInput>
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup
                    role='group'
                    aria-label='Ações de Configurations'
                  >
                    <CButton type='submit' disabled={loading} color='primary'>
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
                    <CButton href='#/admin/configurations-form' color='success'>
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

export default Configurations;
