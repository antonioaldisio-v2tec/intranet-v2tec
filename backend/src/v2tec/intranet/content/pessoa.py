from plone.dexterity.content import Container
from plone.supermodel import model
from v2tec.intranet import _
from zope import schema
from zope.interface import implementer


class IPessoa(model.Schema):
    """Definição de uma Pessoa."""

    categoria = schema.Choice(
        title=_("Categoria de contratação"),
        vocabulary="v2tec.intranet.vocabulary.categorias",
        required=False,
    )


@implementer(IPessoa)
class Pessoa(Container):
    """Uma Pessoa no V2Tec."""
