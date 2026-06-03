from plone.dexterity.content import Item
from plone.supermodel import model
from zope.interface import implementer


class IPessoa(model.Schema):
    """Definição de uma Pessoa."""


@implementer(IPessoa)
class Pessoa(Item):
    """Uma Pessoa no V2Tec."""
