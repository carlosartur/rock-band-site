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
  CFormSwitch,
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
    return <CAlert color='warning'>Nenhum evento econtrado</CAlert>;
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
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('organizer')}
            >
              Organizador
              <Caret sortData={sortData} columnName='organizer'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('date_start')}
            >
              Data início
              <Caret sortData={sortData} columnName='date_start'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('date_end')}
            >
              Data fim
              <Caret sortData={sortData} columnName='date_end'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col'>Habilitado</CTableHeaderCell>
            <CTableHeaderCell scope='col'>Cidade</CTableHeaderCell>
            <CTableHeaderCell scope='col'>Estado</CTableHeaderCell>
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
              <CTableHeaderCell
                scope='row'
                dangerouslySetInnerHTML={{
                  __html: String(item.id)
                    .trim()
                    .padStart(7, ' ')
                    .replace(/\s/g, '&nbsp;'),
                }}
              />
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.organizer}</CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.date_start} />
              </CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.date_end} />
              </CTableDataCell>
              <CTableDataCell>{item.enabled ? 'Sim' : 'Não'}</CTableDataCell>
              <CTableDataCell>{item.city.name}</CTableDataCell>
              <CTableDataCell>{item.city.state.name}</CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.created_at} />
              </CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.updated_at} />
              </CTableDataCell>
              <CTableDataCell>
                <CButtonGroup role='group' aria-label='Ações de eventos'>
                  <CButton
                    color='primary'
                    href={`#/admin/events-form?id=${item.id}`}
                  >
                    <CIcon icon={icon.cilPencil} size='lg' />
                  </CButton>

                  <CButton
                    color='danger'
                    onClick={() =>
                      onClickDelete({
                        id: item.id,
                        visible: true,
                        name: item.name,
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

const Events = () => {
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
    organizer: '',
    date_start_from: '',
    date_start_to: '',
    date_end_from: '',
    date_end_to: '',
    enabled: '',
    city_name: '',
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
        `${process.env.REACT_APP_API_URL}/admin/events`,
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
      `${process.env.REACT_APP_API_URL}/admin/events/export-to-csv`
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

  const deleteEvents = async (eventsId) => {
    try {
      const response = await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/events`,
        {
          params: { id: eventsId },
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
        message: 'Falha na exclusão de evento.',
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
          <CModalTitle>Excluir evento {deleteModalData.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir o evento {deleteModalData.name}? Essa
          ação não pode ser desfeita!
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
              deleteEvents(deleteModalData.id);
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
                <strong>Evento</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row'>
                <CCol xs={3}>
                  <CFormLabel htmlFor='name'>Nome</CFormLabel>
                  <CFormInput
                    value={formData.name}
                    onChange={handleChange}
                    id='name'
                    name='name'
                  ></CFormInput>
                </CCol>
                <CCol xs={3}>
                  <CFormLabel htmlFor='organizer'>Organizador</CFormLabel>
                  <CFormInput
                    value={formData.organizer}
                    onChange={handleChange}
                    id='organizer'
                    name='organizer'
                  ></CFormInput>
                </CCol>
                <CCol xs={3}>
                  <CFormLabel htmlFor='enabledCheckbox'>Habilitado</CFormLabel>
                  <input
                    type='hidden'
                    value={formData.enabled}
                    id='enabled'
                    name='enabled'
                  />

                  <CFormSwitch
                    id='enabledCheckbox'
                    onChange={(e) => {
                      formData.enabled = e.target.checked;
                      handleChange(e);
                    }}
                    type='checkbox'
                    defaultChecked={!!formData.enabled}
                    checked={!!formData.enabled}
                    label='Habilitado'
                  />
                </CCol>
                <CCol xs={3}>
                  <CFormLabel htmlFor='city_name'>Cidade</CFormLabel>
                  <CFormInput
                    value={formData.city_name}
                    onChange={handleChange}
                    id='city_name'
                    name='city_name'
                  ></CFormInput>
                </CCol>

                <CCol xs={6}>
                  <CFormLabel htmlFor='date_start_from'>
                    Data de início de
                  </CFormLabel>
                  <CFormInput
                    type='datetime-local'
                    value={formData.date_start_from}
                    onChange={handleChange}
                    id='date_start_from'
                    name='date_start_from'
                  ></CFormInput>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor='date_start_to'>
                    Data de início até
                  </CFormLabel>
                  <CFormInput
                    type='datetime-local'
                    value={formData.date_start_to}
                    onChange={handleChange}
                    id='date_start_to'
                    name='date_start_to'
                  ></CFormInput>
                </CCol>

                <CCol xs={6}>
                  <CFormLabel htmlFor='date_end_from'>
                    Data de fim de
                  </CFormLabel>
                  <CFormInput
                    type='datetime-local'
                    value={formData.date_end_from}
                    onChange={handleChange}
                    id='date_end_from'
                    name='date_end_from'
                  ></CFormInput>
                </CCol>
                <CCol xs={6}>
                  <CFormLabel htmlFor='date_end_to'>Data de fim até</CFormLabel>
                  <CFormInput
                    type='datetime-local'
                    value={formData.date_end_to}
                    onChange={handleChange}
                    id='date_end_to'
                    name='date_end_to'
                  ></CFormInput>
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de eventos'>
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
                    <CButton href='#/admin/events-form' color='success'>
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

export default Events;
