import React from 'react';
import { textValue } from '../../utils/textValue';

interface ContactInfoProps {
  content: Record<string, unknown>;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ content }) => {
  const telefone = textValue(content.telefone);
  const email = textValue(content.email);

  if (!telefone && !email) {
    return null;
  }

  return (
    <section className="contato">
      {telefone ? (
        <p className="telefone">
          <span className="label">Telefone</span>:{' '}
          <span className="value">{telefone}</span>
        </p>
      ) : null}
      {email ? (
        <p className="email">
          <span className="label">E-mail</span>:{' '}
          <span className="value">
            <a href={`mailto:${email}`}>{email}</a>
          </span>
        </p>
      ) : null}
    </section>
  );
};

export default ContactInfo;
