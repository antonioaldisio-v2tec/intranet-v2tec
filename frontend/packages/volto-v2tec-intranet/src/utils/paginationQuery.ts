import { findBlocks } from '@plone/volto/helpers/Blocks/Blocks';
import { slugify } from '@plone/volto/helpers/Utils/Utils';
import qs from 'query-string';

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../constants/pagination';

type BlocksMap = Record<string, { '@type'?: string }>;

export const getPageQueryKey = (
  blockId: string,
  blocks: BlocksMap = {},
): string => {
  const blockTypesWithPagination = ['search', 'listing'];
  const hasMultiplePaginations =
    findBlocks(blocks, blockTypesWithPagination).length > 1;

  return hasMultiplePaginations ? slugify(`page-${blockId}`) : 'page';
};

export const parsePageSize = (
  value: string | string[] | null | undefined,
  fallback: number = DEFAULT_PAGE_SIZE,
): number => {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  if (
    PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])
  ) {
    return parsed;
  }
  return fallback;
};

export const getPageSizeFromLocation = (
  search: string,
  configuredSize?: string | number | null,
): number => {
  const params = qs.parse(search);
  if (params.b_size != null) {
    return parsePageSize(params.b_size);
  }
  if (configuredSize != null && configuredSize !== '') {
    return parsePageSize(String(configuredSize));
  }
  return DEFAULT_PAGE_SIZE;
};

export const buildSearchWithPageSize = (
  search: string,
  pageSize: number,
  pageQueryKey: string,
): string => {
  const params = qs.parse(search);
  params.b_size = String(pageSize);
  delete params[pageQueryKey];
  return qs.stringify(params);
};
