import React from 'react';
import config from '@plone/volto/registry';
import Card from '@kitconcept/volto-light-theme/primitives/Card/Card';
import { textValue } from 'volto-v2tec-intranet/utils/textValue';

interface AreaGridItemProps {
  item: Record<string, unknown>;
}

const AreaGridItem: React.FC<AreaGridItemProps> = ({ item }) => {
  const PreviewImageComponent = config.getComponent('PreviewImage').component;
  const cidade = textValue(item.cidade);
  const estado = textValue(item.estado);
  const telefone = textValue(item.telefone);
  const email = textValue(item.email);
  const title = item.title ? String(item.title) : String(item.id);

  return (
    <>
      {item.image_field !== '' && (
        <Card.Image
          className="item-image"
          item={item}
          imageComponent={PreviewImageComponent}
        />
      )}
      <Card.Summary>
        <h3>{title}</h3>
        {item.description ? <p>{String(item.description)}</p> : null}
        {cidade || estado ? (
          <p className="local">
            {[cidade, estado].filter(Boolean).join(' - ')}
          </p>
        ) : null}
        {telefone ? <p className="telefone">{telefone}</p> : null}
        {email ? (
          <p className="email">
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        ) : null}
      </Card.Summary>
    </>
  );
};

export default AreaGridItem;
