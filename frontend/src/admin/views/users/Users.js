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
import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AuthComponent } from '../../components/AuthComponent';
import { Caret } from '../../components/Caret';
import { PaginationFromData } from '../../components/PaginationComponent';

const SearchResultsTable = (searchResponse) => {
  const {
    searchResults,
    onClickPagination,
    onClickDelete,
    onClickSort,
    sortData,
  } = searchResponse;

  if (!searchResults.total) {
    return <CAlert color='warning'>Nenhum usuário econtrado</CAlert>;
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
            <CTableHeaderCell scope='col' onClick={() => onClickSort('email')}>
              Email
              <Caret sortData={sortData} columnName='email'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell scope='col'>Ações</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {searchResults.data.map((item, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope='row'>{item.id}</CTableHeaderCell>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.email}</CTableDataCell>

              <CTableDataCell>
                <CButtonGroup role='group' aria-label='Ações de Users'>
                  <CButton
                    color='primary'
                    href={`#/admin/users-form?id=${item.id}`}
                  >
                    <CIcon icon={icon.cilPencil} size='lg' />
                  </CButton>

                  <CButton
                    color='danger'
                    disabled={1 == item.id}
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

const Users = () => {
  const [loading, setLoading] = useState(false);

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
    id: '',
    name: '',
    email: '',
    password: '',
    remember_token: '',
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
        `${process.env.REACT_APP_API_URL}/admin/users`,
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

  const makePageRequest = async (e) => {
    const linkpaginacao = e.target.getAttribute('linkpaginacao');

    try {
      const response = await api.get(linkpaginacao);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const deleteUsers = async (usersId) => {
    try {
      const response = await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/users`,
        {
          params: { id: usersId },
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
        message: 'Falha na exclusão de Users.',
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
          <CModalTitle>Excluir Users {deleteModalData.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir a Users {deleteModalData.name}? Essa
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
              deleteUsers(deleteModalData.id);
              setDeleteModalData({ visible: false });
            }}
          >
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CForm onSubmit={handleSubmit} className='g-3'>
            <CCard className='mb-4'>
              <CCardHeader>
                <strong>Usuários</strong> <small>Busca</small>
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

                <CCol xs={4}>
                  <CFormLabel htmlFor='email'>Email</CFormLabel>
                  <CFormInput
                    value={formData.email}
                    onChange={handleChange}
                    id='email'
                    name='email'
                  ></CFormInput>
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
                        <CIcon icon={icon.cilZoom} size='lg' />
                      )}
                      &nbsp; Buscar
                    </CButton>
                    <CButton href='#/admin/users-form' color='success'>
                      <CIcon icon={icon.cilPlus} size='lg' />
                      &nbsp; Adicionar
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

export default Users;
