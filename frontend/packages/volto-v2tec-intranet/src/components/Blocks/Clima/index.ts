import type { BlockConfigBase } from '@plone/types';
import globeSVG from '@plone/volto/icons/globe.svg';
import ClimaBlockEdit from './Edit';
import ClimaBlockView from './View';
import { ClimaSchema } from './schema';

const ClimaBlockInfo: BlockConfigBase = {
  id: 'climaBlock',
  title: 'Previsão do Tempo',
  icon: globeSVG,
  group: 'common',
  edit: ClimaBlockEdit,
  view: ClimaBlockView,
  blockSchema: ClimaSchema,
  restricted: false,
  mostUsed: false,
  sidebarTab: 1,
};

export default ClimaBlockInfo;

export interface ClimaBlockData {
  location?: string;
  measure?: string;
}
