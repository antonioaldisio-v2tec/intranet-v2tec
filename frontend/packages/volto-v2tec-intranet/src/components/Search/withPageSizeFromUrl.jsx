import React from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSizeFromLocation } from '../../utils/paginationQuery';

/**
 * Garante que b_size da URL seja aplicado aos resultados (atualiza ao mudar página ou tamanho).
 */
export default function withPageSizeFromUrl(WrappedComponent) {
  function WithPageSizeFromUrl(props) {
    const location = useLocation();
    const configuredSize = props.data?.b_size;
    const pageSize = getPageSizeFromLocation(location.search, configuredSize);

    return (
      <WrappedComponent
        {...props}
        data={{
          ...props.data,
          b_size: pageSize,
        }}
      />
    );
  }

  WithPageSizeFromUrl.displayName = `WithPageSizeFromUrl(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithPageSizeFromUrl;
}
