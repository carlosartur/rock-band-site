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
import { BrazilianFormatData } from '../../components/BrazilianFormatData';
import { Caret } from '../../components/Caret';
import { handleCsvExport } from '../../utils/exportcsv';

const SearchResultsTable = (searchResponse) => {
  const {
    searchResults,
    onClickPagination,
    onClickDelete,
    onClickShowDetails,
    onClickSort,
    sortData,
  } = searchResponse;

  if (!searchResults.total) {
    return <CAlert color='warning'>Nenhum contato econtrado</CAlert>;
  }

  return (
    <>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope='col' style={{width: "60px" }} onClick={() => onClickSort('id')}>
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
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('subject')}
            >
              Assunto
              <Caret sortData={sortData} columnName='subject'></Caret>
            </CTableHeaderCell>
            <CTableHeaderCell
              scope='col'
              onClick={() => onClickSort('message')}
            >
              Mensagem
              <Caret sortData={sortData} columnName='message'></Caret>
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
                    .padStart(5, ' ')
                    .replace(/\s/g, '&nbsp;'),
                }}
              />
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.email}</CTableDataCell>
              <CTableDataCell>{item.subject}</CTableDataCell>
              <CTableDataCell>{item.message_raw}</CTableDataCell>

              <CTableDataCell>
                <CButtonGroup role='group' aria-label='Ações de Contact'>
                  <CButton
                    color='primary'
                    href={`#/admin/contact-form?id=${item.id}`}
                  >
                    <CIcon icon={icon.cilPencil} size='lg' />
                  </CButton>
                  <CButton
                    color='dark'
                    onClick={() =>
                      onClickShowDetails({
                        visible: true,
                        item,
                      })
                    }
                  >
                    <CIcon icon={icon.cilLowVision} size='lg' />
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

const Contact = () => {
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
    order_by_direction: 'desc',
  });

  const [detailsModalData, setDetailsModalData] = useState({
    visible: false,
    item: {
      id: '',
      name: '',
      email: '',
      enterprise: '',
      subject: '',
      message: '',
      ip: '',
      created_at: '',
      updated_at: '',
    },
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
    email: '',
    phone: '',
    enterprise: '',
    subject: '',
    message: '',
    ip: '',
    order_by: 'id',
    order_by_direction: 'desc',
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
        `${process.env.REACT_APP_API_URL}/admin/contact`,
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
      `${process.env.REACT_APP_API_URL}/admin/contact/export-to-csv`
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

  const deleteContact = async (contactId) => {
    try {
      const response = await api.delete(
        `${process.env.REACT_APP_API_URL}/admin/contact`,
        {
          params: { id: contactId },
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
        message: 'Falha na exclusão de Contact.',
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
          <CModalTitle>Excluir contato {deleteModalData.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir o contato {deleteModalData.name}? Essa
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
              deleteContact(deleteModalData.id);
              setDeleteModalData({ visible: false });
            }}
          >
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        alignment='center'
        visible={detailsModalData.visible}
        onClose={() =>
          setDetailsModalData({ ...detailsModalData, visible: false })
        }
      >
        <CModalHeader>
          <CModalTitle>
            Detalhes de contato <strong>#{detailsModalData.item.id}</strong>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Id</strong>:&nbsp;
          <span>{detailsModalData.item.id}</span>
          <br />
          <strong>Nome do contato</strong>:&nbsp;
          <span>{detailsModalData.item.name}</span>
          <br />
          <strong>Email</strong>:&nbsp;
          <span>{detailsModalData.item.email}</span>
          <br />
          <strong>Assunto</strong>:&nbsp;
          <span>{detailsModalData.item.subject}</span>
          <br />
          <strong>Mensagem</strong>:&nbsp;
          <br />
          <CCard>
            <CCardBody
              dangerouslySetInnerHTML={{
                __html: detailsModalData.item.message,
              }}
            />
          </CCard>
          <br />
          <strong>IP</strong>:&nbsp;
          <span>{detailsModalData.item.ip}</span>
          <br />
          <strong>Criado em</strong>:&nbsp;
          <span>
            <BrazilianFormatData date={detailsModalData.item.created_at} />
          </span>
          <br />
          <strong>Atualizado em</strong>:&nbsp;
          <span>
            <BrazilianFormatData date={detailsModalData.item.updated_at} />
          </span>
          <br />
        </CModalBody>
        <CModalFooter>
          <CButton
            color='secondary'
            onClick={() =>
              setDetailsModalData({ ...detailsModalData, visible: false })
            }
          >
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CCard className='mb-4'>
            <CForm onSubmit={handleSubmit} className='g-3'>
              <CCardHeader>
                <strong>Contact</strong> <small>Busca</small>
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
                <CCol xs={4}>
                  <CFormLabel htmlFor='phone'>Telefone</CFormLabel>
                  <CFormInput
                    value={formData.phone}
                    onChange={handleChange}
                    id='phone'
                    name='phone'
                  ></CFormInput>
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='subject'>Assunto</CFormLabel>
                  <CFormInput
                    value={formData.subject}
                    onChange={handleChange}
                    id='subject'
                    name='subject'
                  ></CFormInput>
                </CCol>
                <CCol xs={4}>
                  <CFormLabel htmlFor='message'>Mensagem</CFormLabel>
                  <CFormInput
                    value={formData.message}
                    onChange={handleChange}
                    id='message'
                    name='message'
                  ></CFormInput>
                </CCol>
              </CCardBody>

              <CCardFooter>
                <CCol xs={12} align='right'>
                  <CButtonGroup role='group' aria-label='Ações de Contact'>
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
                    <CButton href='#/admin/contact-form' color='success'>
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
                onClickShowDetails={setDetailsModalData}
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

export default Contact;
