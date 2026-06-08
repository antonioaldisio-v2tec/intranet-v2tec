from plone import api
from plone.indexer import indexer
from v2tec.intranet.content.pessoa import IPessoa
from v2tec.intranet.content.pessoa import Pessoa
from z3c.relationfield.relation import RelationValue


@indexer(IPessoa)
def area_indexer(obj: Pessoa) -> str | None:
    """Retorna o UUID da área de uma Pessoa, se ela estiver definida."""
    area_rel: RelationValue | None = obj.area
    if area_rel:
        area = area_rel.to_object
        uuid: str = api.content.get_uuid(area)
        return uuid


@indexer(IPessoa)
def categoria_indexer(obj: Pessoa) -> str | None:
    """Retorna o categoria de uma Pessoa, se ele estiver definido."""
    return obj.categoria if obj.categoria else None
