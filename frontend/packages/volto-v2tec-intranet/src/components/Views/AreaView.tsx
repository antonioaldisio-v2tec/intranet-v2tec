import React from 'react';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasBlocksData } from '@plone/volto/helpers/Blocks/Blocks';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import ContactInfo from '../ContactInfo/ContactInfo';
import EnderecoInfo from '../EnderecoInfo/EnderecoInfo';

interface AreaViewProps {
  content: Record<string, unknown>;
  location?: {
    pathname: string;
  };
  [key: string]: unknown;
}

const AreaView: React.FC<AreaViewProps> = (props) => {
  const { content, location } = props;
  const path = getBaseUrl(location?.pathname || '');

  return (
    <div id="page-document" className="view-wrapper area-view">
      {hasBlocksData(content) ? <RenderBlocks {...props} path={path} /> : null}
      <ContactInfo content={content} />
      <EnderecoInfo content={content} />
    </div>
  );
};

export default AreaView;
