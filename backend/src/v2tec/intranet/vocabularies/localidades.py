from typing import TypedDict
from v2tec.intranet import _
from zope.i18nmessageid import Message
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


class Localidade(TypedDict):
    title: Message
    coordenadas: tuple[float, float]


LOCALIDADES: dict[str, Localidade] = {
    "brasilia": {
        "title": _("Brasília"),
        "coordenadas": (-15.79056430239884, -47.89230121103631),
    },
    "mooca": {
        "title": _("Mooca"),
        "coordenadas": (-23.553271458679138, -46.60494173061538),
    },
    "curitiba": {
        "title": _("Curitiba"),
        "coordenadas": (-25.421495871817786, -49.25942633319336),
    },
}


@provider(IVocabularyFactory)
def vocab_localidades(context) -> SimpleVocabulary:
    """Localidades do Brasil."""
    terms: list[SimpleTerm] = []
    for token, localidade in LOCALIDADES.items():
        terms.append(SimpleTerm(token, token, localidade["title"]))
    return SimpleVocabulary(terms)


def get_localidade(token: str) -> Localidade:
    """Obtém as informações de uma localidade a partir do token."""
    return LOCALIDADES[token]
