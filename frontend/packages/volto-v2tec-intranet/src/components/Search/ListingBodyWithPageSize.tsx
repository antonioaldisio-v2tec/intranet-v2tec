import React, { createRef, useMemo, useCallback } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { Dimmer, Loader } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { renderLinkElement } from '@plone/volto-slate/editor/render';
import config from '@plone/volto/registry';
import withQuerystringResults from '@plone/volto/components/manage/Blocks/Listing/withQuerystringResults';
import { normalizeString } from '@plone/volto/helpers/Utils/Utils';
import SlotRenderer from '@plone/volto/components/theme/SlotRenderer/SlotRenderer';
import ListingPagination from './ListingPagination';
import withPageSizeFromUrl from './withPageSizeFromUrl';

import { PAGE_SIZE_OPTIONS } from '../../constants/pagination';
import {
  getPageQueryKey,
  buildSearchWithPageSize,
} from '../../utils/paginationQuery';

const Headline = ({
  headlineTag,
  id,
  data = {},
  listingItems,
  isEditMode,
}: {
  headlineTag: string;
  id: string;
  data: Record<string, unknown>;
  listingItems: unknown[];
  isEditMode: boolean;
}) => {
  const attr: { id: string } = { id };
  const slug = Slugger.slug(normalizeString(data.headline as string));
  attr.id = slug || id;
  const LinkedHeadline = useMemo(
    () => renderLinkElement(headlineTag),
    [headlineTag],
  );
  return (
    <LinkedHeadline
      mode={!isEditMode && 'view'}
      children={data.headline as string}
      attributes={attr}
      className={cx('headline', {
        emptyListing: !(listingItems?.length > 0),
      })}
    />
  );
};

const ListingBodyInner = (props: Record<string, unknown>) => {
  const {
    data = {},
    isEditMode,
    listingItems,
    totalPages,
    onPaginationChange,
    variation,
    currentPage,
    isFolderContentsListing,
    hasLoaded,
    id,
    content,
  } = props;

  const routerLocation = useLocation();
  const history = useHistory();
  const blocks = useSelector(
    (state: { content?: { data?: { blocks?: Record<string, unknown> } } }) =>
      state?.content?.data?.blocks || {},
  );
  const pageQueryKey = getPageQueryKey(
    id as string,
    blocks as Record<string, { '@type'?: string }>,
  );
  const pageSize = Number(data.b_size) || PAGE_SIZE_OPTIONS[0];

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (isEditMode) {
        return;
      }
      history.push({
        search: buildSearchWithPageSize(
          routerLocation.search,
          size,
          pageQueryKey,
        ),
      });
    },
    [history, isEditMode, routerLocation.search, pageQueryKey],
  );

  const handlePageChange = useCallback(
    (activePage: number) => {
      onPaginationChange({} as React.SyntheticEvent, { activePage });
    },
    [onPaginationChange],
  );

  let ListingBodyTemplate;
  const variations = config.blocks?.blocksConfig['listing']?.variations || [];
  const defaultVariation = variations.filter(
    (item: { isDefault?: boolean }) => item.isDefault,
  )?.[0];

  if (data.template && !data.variation) {
    const legacyTemplateConfig = variations.find(
      (item: { id: string }) => item.id === (data.template as string),
    );
    ListingBodyTemplate = legacyTemplateConfig?.template;
  } else {
    ListingBodyTemplate =
      (variation as { template?: React.ComponentType })?.template ??
      defaultVariation?.template ??
      null;
  }

  const listingRef = createRef<HTMLDivElement>();

  const NoResults = (variation as { noResultsComponent?: React.ComponentType })
    ?.noResultsComponent
    ? (variation as { noResultsComponent: React.ComponentType })
        .noResultsComponent
    : config.blocks?.blocksConfig['listing'].noResultsComponent;

  const HeadlineTag = (data.headlineTag as string) || 'h2';
  const showPagination =
    !isEditMode && listingItems && (listingItems as unknown[]).length > 0;

  return (
    <>
      {data.headline && (
        <Headline
          headlineTag={HeadlineTag}
          id={id as string}
          listingItems={listingItems as unknown[]}
          data={data}
          isEditMode={isEditMode as boolean}
        />
      )}
      <SlotRenderer name="aboveListingItems" content={content} data={data} />
      {listingItems && (listingItems as unknown[]).length > 0 ? (
        <div ref={listingRef}>
          {ListingBodyTemplate && (
            <ListingBodyTemplate
              items={listingItems}
              isEditMode={isEditMode}
              {...data}
              {...(variation as object)}
            />
          )}
          {showPagination && (
            <div className="pagination-wrapper v2tec-pagination">
              <ListingPagination
                currentPage={currentPage as number}
                totalPages={totalPages as number}
                pageSize={pageSize}
                onPageChange={(activePage) => {
                  listingRef.current?.scrollIntoView({ behavior: 'smooth' });
                  handlePageChange(activePage);
                }}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
      ) : isEditMode ? (
        <div className="listing message" ref={listingRef}>
          {isFolderContentsListing && (
            <FormattedMessage
              id="No items found in this container."
              defaultMessage="No items found in this container."
            />
          )}
          {hasLoaded && NoResults && (
            <NoResults isEditMode={isEditMode} {...data} />
          )}
          <Dimmer active={!hasLoaded} inverted>
            <Loader indeterminate size="small">
              <FormattedMessage id="loading" defaultMessage="Loading" />
            </Loader>
          </Dimmer>
        </div>
      ) : (
        <div className="emptyListing">
          {hasLoaded && NoResults && (
            <NoResults isEditMode={isEditMode} {...data} />
          )}
          <Dimmer active={!hasLoaded} inverted>
            <Loader indeterminate size="small">
              <FormattedMessage id="loading" defaultMessage="Loading" />
            </Loader>
          </Dimmer>
        </div>
      )}
    </>
  );
};

const ListingBodyWithPageSize = withPageSizeFromUrl(
  withQuerystringResults(ListingBodyInner),
);

export default injectIntl(ListingBodyWithPageSize);
