import React from 'react';
import config from '@plone/registry';
import ContactInfo from '../ContactInfo/ContactInfo';
import EnderecoInfo from '../EnderecoInfo/EnderecoInfo';
import type { Pessoa } from '../../types/content';

interface PessoaViewProps {
  content: Pessoa;
  [key: string]: unknown;
}

const PessoaView: React.FC<PessoaViewProps> = ({ content }) => {
  const Image = config.getComponent({ name: 'Image' }).component;

  return (
    <div id="page-document" className="view-wrapper pessoa-view">
      {content.title ? (
        <h1 className="documentFirstHeading">{content.title}</h1>
      ) : null}
      {content.description ? (
        <p className="documentDescription">{content.description}</p>
      ) : null}
      {content.image ? (
        <Image
          className="documentImage pessoa-photo"
          alt={content.title}
          title={content.title}
          item={content}
          imageField="image"
          responsive={true}
        />
      ) : null}
      <ContactInfo content={content} />
      <EnderecoInfo content={content} />
    </div>
  );
};

export default PessoaView;
