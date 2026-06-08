import React from 'react';
import VoltoPagination from '@plone/volto/components/theme/Pagination/Pagination';
import { PAGE_SIZE_OPTIONS } from '../../constants/pagination';

/**
 * Paginação com números de página e seletor de itens por página (10, 20, 50, 100).
 */
const ListingPagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => (
  <VoltoPagination
    current={currentPage - 1}
    total={Math.max(totalPages ?? 1, 1)}
    pageSize={pageSize}
    pageSizes={[...PAGE_SIZE_OPTIONS]}
    onChangePage={(_e, { value }) => {
      onPageChange(value + 1);
    }}
    onChangePageSize={(_e, { value }) => {
      onPageSizeChange(Number(value));
    }}
  />
);

export default ListingPagination;
