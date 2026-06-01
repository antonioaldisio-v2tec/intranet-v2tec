import React from 'react';
import { Container } from '@plone/components';
import type { Area } from 'volto-v2tec-intranet/types/content';

interface EnderecoInfoProps {
  content: Area;
}

const EnderecoInfo: React.FC<EnderecoInfoProps> = ({ content }) => {
  const { endereco, complemento, cidade, estado, cep } = content;

  return (
    <Container narrow className="endereco-info">
      {endereco && (
        <Container className="endereco">
          <span className="label">Endereço</span>:{' '}
          <span className="value">{endereco}</span>
        </Container>
      )}
      {complemento && (
        <Container className="complemento">
          <span className="label">Complemento</span>:{' '}
          <span className="value">{complemento}</span>
        </Container>
      )}
      {cidade && (
        <Container className="cidade">
          <span className="label">Cidade</span>:{' '}
          <span className="value">{cidade}</span>
        </Container>
      )}
      {estado && (
        <Container className="estado">
          <span className="label">Estado</span>:{' '}
          <span className="value">{estado}</span>
        </Container>
      )}
      {cep && (
        <Container className="cep">
          <span className="label">CEP</span>:{' '}
          <span className="value">{cep}</span>
        </Container>
      )}
    </Container>
  );
};

export default EnderecoInfo;
