import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import config from '@plone/volto/registry';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import {
  withSearch,
  withQueryString,
} from '@plone/volto/components/manage/Blocks/Search/hocs';
import ListingBodyWithPageSize from './ListingBodyWithPageSize';

const getListingBodyVariation = (data: { listingBodyTemplate?: string }) => {
  const { variations } = config.blocks.blocksConfig.listing;

  let variation = data.listingBodyTemplate
    ? variations.find(({ id }) => id === data.listingBodyTemplate)
    : variations.find(({ isDefault }) => isDefault);

  if (!variation) variation = variations[0];

  return variation;
};

const applyDefaults = (
  data: Record<string, unknown>,
  root: string,
  blockQuery?: { i: string; o: string; v: string }[],
) => {
  const defaultQuery = [
    {
      i: 'path',
      o: 'plone.app.querystring.operation.string.absolutePath',
      v: root || '/',
    },
  ];

  const dataQuery = (data?.query as { i: string }[])?.length
    ? (data.query as { i: string }[])
    : [];
  const searchBySearchableText = dataQuery.filter(
    (item) => item['i'] === 'SearchableText',
  ).length;

  const sort_on = data?.sort_on
    ? { sort_on: data.sort_on }
    : searchBySearchableText === 0
      ? { sort_on: 'effective' }
      : {};
  const sort_order = data?.sort_order
    ? { sort_order: data.sort_order }
    : searchBySearchableText === 0
      ? { sort_order: 'descending' }
      : {};

  let query = blockQuery?.length ? blockQuery : [];
  if (!query.length) {
    query = dataQuery.length ? (dataQuery as typeof query) : defaultQuery;
  } else if (dataQuery.length) {
    const filterKeys = new Set(dataQuery.map((obj) => obj.i));
    query = [
      ...(dataQuery as typeof query),
      ...blockQuery.filter((item) => !filterKeys.has(item.i)),
    ];
  }

  return {
    ...data,
    ...sort_on,
    ...sort_order,
    query,
  };
};

const SearchBlockViewWithPageSize = (props: {
  id: string;
  data: Record<string, unknown>;
  searchData: Record<string, unknown>;
  mode?: string;
  variation: { view: React.ComponentType<Record<string, unknown>> };
  className?: string;
  path: string;
}) => {
  const { id, data, searchData, mode = 'view', variation, className } = props;
  const location = useLocation();

  const Layout = variation.view;

  const dataListingBodyVariation = getListingBodyVariation(
    data as { listingBodyTemplate?: string },
  ).id;
  const [selectedView, setSelectedView] = React.useState(
    dataListingBodyVariation,
  );

  React.useEffect(() => {
    if (mode !== 'view') {
      setSelectedView(dataListingBodyVariation);
    }
  }, [dataListingBodyVariation, mode]);

  const root = useSelector(
    (state: { breadcrumbs: { root: string } }) => state.breadcrumbs.root,
  );
  const blockQuery = (
    data as { query?: { query?: { i: string; o: string; v: string }[] } }
  ).query?.query;

  const listingBodyData = applyDefaults(searchData, root, blockQuery);

  const { variations } = config.blocks.blocksConfig.listing;
  const listingBodyVariation = variations.find(
    ({ id: vid }) => vid === selectedView,
  );

  return (
    <div className={cx('block search', selectedView, className)}>
      <Layout
        {...props}
        isEditMode={mode === 'edit'}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      >
        <ListingBodyWithPageSize
          key={location.search}
          id={id}
          variation={{ ...data, ...listingBodyVariation }}
          data={listingBodyData}
          path={props.path}
          isEditMode={mode === 'edit'}
        />
      </Layout>
    </div>
  );
};

export const SearchBlockViewWithPageSizeComponent = compose(
  withBlockExtensions,
)(SearchBlockViewWithPageSize);

export default withSearch()(
  withQueryString(SearchBlockViewWithPageSizeComponent),
);
