import { CPagination, CPaginationItem } from '@coreui/react';

export const PaginationFromData = (paginationInfo) => {
  const { searchResults, clickFunction } = paginationInfo;

  return (
    <>
      <CPagination
        className='justify-content-center'
        aria-label='Page navigation example'
      >
        {searchResults?.links && searchResults.links.map((page) => (
          <CPaginationItem
            className={page.active ? 'active' : ''}
            disabled={!page.url}
            onClick={clickFunction}
            linkpaginacao={page.url}
            key={page.label}
          >
            {page.label
              .replace('&laquo; Previous', '<<')
              .replace('Next &raquo;', '>>')}
          </CPaginationItem>
        ))}
      </CPagination>
      <div align='center'>
        {searchResults.from} - {searchResults.to} de {searchResults.total}
      </div>
    </>
  );
};
