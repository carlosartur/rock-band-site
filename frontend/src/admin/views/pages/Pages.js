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
import { CFormInputWithMask } from '../../../components/CFormInputWithMask';
import { PaginationFromData } from '../../components/PaginationComponent';
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AuthComponent } from '../../components/AuthComponent';
import { Caret } from '../../components/Caret';
import { handleCsvExport } from '../../../utils/exportcsv';
import { BrazilianFormatData } from '../../../components/BrazilianFormatData';

const SearchResultsTable = (searchResponse) => {
  const {
    searchResults,
    onClickPagination,
    onClickDelete,
    sortData,
    onClickSort,
  } = searchResponse;

  if (!searchResults.total) {
    return <CAlert color='warning'>Nenhuma Pages econtrada</CAlert>;
  }

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('id')}
              style={{ width: '50px' }}
            >
              #<Caret sortData={sortData} columnName='id'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('slug')}>
              Url
              <Caret sortData={sortData} columnName='slug'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('title')}>
              Título
              <Caret sortData={sortData} columnName='title'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col'>Texto</CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('home')}>
              Home
              <Caret sortData={sortData} columnName='home'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col' onClick={() => onClickSort('order')}>
              Ordem
              <Caret sortData={sortData} columnName='order'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              style={{ width: '150px' }}
              onClick={() => onClickSort('created_at')}
            >
              Criado em
              <Caret sortData={sortData} columnName='created_at'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              style={{ width: '150px' }}
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

              <CTableDataCell>{item.slug}</CTableDataCell>
              <CTableDataCell>{item.title}</CTableDataCell>
              <CTableDataCell
                dangerouslySetInnerHTML={{ __html: item.text_raw }}
              ></CTableDataCell>
              <CTableDataCell>{item.home ? 'Sim' : 'Não'}</CTableDataCell>
              <CTableDataCell>{item.order}</CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.created_at} />
              </CTableDataCell>
              <CTableDataCell>
                <BrazilianFormatData date={item.updated_at} />
              </CTableDataCell>
              <CTableDataCell>
                <CButtonGroup role='group' aria-label='Ações de Pages'>
                  <CButton
                    color='primary'
                    href={`#/admin/pages-form?id=${item.id}`}
                  >
                    <CIcon icon={icon.cilPencil} size='lg' />
                  </CButton>

                  <CButton
                    color='danger'
                    onClick={() =>
                      onClickDelete({
                        id: item.id,
                        visible: true,
                        title: item.title,
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

const Pages = () => {
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [toastContent, setToastContent] = useState(false);
  const toaster = useRef();

  const [deleteModalData, setDeleteModalData] = useState({
    visible: false,
    title: '',
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
    slug: '',
    title: '',
    text: '',
    home: '',
    order: '',
    gallery_id: '',
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
        `${process.env.REACT_APP_API_URL}/admin/pages`,
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
      `${process.env.REACT_APP_API_URL}/admin/pages/export-to-csv`
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

  const deletePages = async (pagesId) => {
    try {
      const response = await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/pages`,
        {
          params: { id: pagesId },
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
        message: 'Falha na exclusão de Pages.',
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
          <CModalTitle>Excluir Página {deleteModalData.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir a Página {deleteModalData.title}? Essa
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
              deletePages(deleteModalData.id);
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
                <strong>Pages</strong> <small>Busca</small>
              </CCardHeader>
              <CCardBody className='row'>
                <CCol xs={2}>
                  <CFormLabel htmlFor='slug'>Url</CFormLabel>
                  <CFormInput
                    value={formData.slug}
                    onChange={handleChange}
                    id='slug'
                    name='slug'
                  ></CFormInput>
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='title'>Titulo</CFormLabel>
                  <CFormInput
                    value={formData.title}
                    onChange={handleChange}
                    id='title'
                    name='title'
                  ></CFormInput>
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='text'>Texto</CFormLabel>
                  <CFormInput
                    value={formData.text}
                    onChange={handleChange}
                    id='text'
                    name='text'
                  ></CFormInput>
                </CCol>
                <CCol xs={2}>
                  <CFormLabel htmlFor='home'>Exibe na home</CFormLabel>
                  <CFormSelect
                    aria-label='Exibe na home'
                    id='home'
                    name='home'
                    value={formData.home}
                    onChange={handleChange}
                  >
                    <option value=''>Selecione uma opção</option>
                    <option value='0'>Não exibe na home</option>
                    <option value='1'>Exibe na home</option>
                  </CFormSelect>
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Pages'>
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
                    <CButton href='#/admin/pages-form' color='success'>
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

export default Pages;
