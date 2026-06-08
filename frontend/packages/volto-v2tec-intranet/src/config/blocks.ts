import type { ConfigType } from '@plone/registry';
import SearchBlockViewWithPageSize from 'volto-v2tec-intranet/components/Search/SearchBlockViewWithPageSize';

export default function install(config: ConfigType) {
  const searchBlock = config.blocks.blocksConfig.search;
  if (searchBlock) {
    searchBlock.view = SearchBlockViewWithPageSize;
  }
  return config;
}
