from plone import api
from plone.restapi.services import Service
from typing import TypedDict
from v2tec.intranet import logger
from v2tec.intranet.utils import openmeteo
from v2tec.intranet.vocabularies.localidades import get_localidade
from zExceptions import BadRequest
from ZPublisher.HTTPRequest import HTTPRequest


class ClimaPayload(TypedDict):
    latitude: str
    longitude: str
    timezone: str


class ClimaGet(Service):
    """Obtém os dados do clima para a localidade informada."""

    localidade_padrao = "brasilia"

    @property
    def timezone(self) -> str:
        return api.portal.get_registry_record("plone.portal_timezone")

    def coordenadas(self, localidade: str) -> dict[str, float]:
        """Retorna latitude e longitude da localidade informada."""
        try:
            local = get_localidade(localidade)
        except KeyError as exc:
            logger.error(f"Localidade '{localidade}' não encontrada.")
            raise ValueError(f"Localidade '{localidade}' não encontrada.") from exc
        latitude, longitude = local["coordenadas"]
        return {"latitude": latitude, "longitude": longitude}

    def _prepara_payload(self, localidade: str) -> ClimaPayload:
        """Prepara o payload para a requisição à API do Open Meteo."""
        coordenadas = self.coordenadas(localidade)
        return {
            "latitude": str(coordenadas["latitude"]),
            "longitude": str(coordenadas["longitude"]),
            "timezone": self.timezone,
        }

    def reply(self) -> dict:
        request: HTTPRequest = self.request
        portal = api.portal.get()
        localidade = request.form.get("localidade", self.localidade_padrao)
        logger.info("Acessa dados do clima")
        try:
            payload = self._prepara_payload(localidade)
        except ValueError as exc:
            logger.error(str(exc))
            raise BadRequest(str(exc)) from exc
        dados = openmeteo.dados_clima(**payload)
        dados["@id"] = f"{portal.absolute_url()}/@clima"
        dados["localidade"] = localidade
        logger.info("Retorna dados do clima")
        return dados
