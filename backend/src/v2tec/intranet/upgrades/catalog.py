from plone import api
from Products.GenericSetup.tool import SetupTool
from Products.ZCatalog.CatalogBrains import AbstractCatalogBrain
from v2tec.intranet import logger
from v2tec.intranet.content.pessoa import Pessoa


def reindexa_pessoa(portal_setup: SetupTool):
    """Reindexa todos os objetos do tipo Pessoa."""
    brains: list[AbstractCatalogBrain] = api.content.find(portal_type="Pessoa")
    for brain in brains:
        pessoa: Pessoa = brain.getObject()
        # Reindexa os campos area e categoria do objeto pessoa
        pessoa.reindexObject(idxs=["area", "categoria"])
        logger.info(
            f"- Reindexa os campos area e categoria do objeto {pessoa.absolute_url()}"
        )
    logger.info("Reindexação completa")
