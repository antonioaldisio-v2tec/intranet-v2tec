import React from 'react';
import { textValue } from '../../utils/textValue';

interface EnderecoInfoProps {
  content: Record<string, unknown>;
}

const EnderecoInfo: React.FC<EnderecoInfoProps> = ({ content }) => {
  const endereco = textValue(content.endereco);
  const complemento = textValue(content.complemento);
  const cidade = textValue(content.cidade);
  const estado = textValue(content.estado);
  const cep = textValue(content.cep);

  if (!endereco && !complemento && !cidade && !estado && !cep) {
    return null;
  }

  return (
    <section className="endereco-info">
      {endereco ? (
        <p className="endereco">
          <span className="label">Endereço</span>:{' '}
          <span className="value">{endereco}</span>
        </p>
      ) : null}
      {complemento ? (
        <p className="complemento">
          <span className="label">Complemento</span>:{' '}
          <span className="value">{complemento}</span>
        </p>
      ) : null}
      {cidade ? (
        <p className="cidade">
          <span className="label">Cidade</span>:{' '}
          <span className="value">{cidade}</span>
        </p>
      ) : null}
      {estado ? (
        <p className="estado">
          <span className="label">Estado</span>:{' '}
          <span className="value">{estado}</span>
        </p>
      ) : null}
      {cep ? (
        <p className="cep">
          <span className="label">CEP</span>:{' '}
          <span className="value">{cep}</span>
        </p>
      ) : null}
    </section>
  );
};

export default EnderecoInfo;
