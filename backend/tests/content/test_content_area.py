from AccessControl import Unauthorized
from plone import api
from plone.dexterity.fti import DexterityFTI
from v2tec.intranet.content.area import Area
from zope.component import createObject

import pytest


CONTENT_TYPE = "Area"


@pytest.fixture
def area_payload() -> dict:
    """Return a payload to create a new area."""
    return {
        "type": "Area",
        "id": "ti",
        "title": "Tecnologia da Informação",
        "description": ("Área responsável por TI"),
        "email": "ti@v2solucoes.com.br",
        "telefone": "6132101234",
    }


@pytest.fixture
def area_restapi_payload() -> dict:
    """Return a payload to create a new area."""
    return {
        "@type": "Area",
        "id": "ti",
        "title": "Tecnologia da Informação",
        "description": ("Área responsável por TI"),
        "email": "ti@v2solucoes.com.br",
        "telefone": "6132101234",
    }


class TestArea:
    @pytest.fixture(autouse=True)
    def _setup(self, get_fti, portal):
        self.fti = get_fti(CONTENT_TYPE)
        self.portal = portal

    def test_fti(self):
        assert isinstance(self.fti, DexterityFTI)

    def test_factory(self):
        factory = self.fti.factory
        obj = createObject(factory)
        assert obj is not None
        assert isinstance(obj, Area)

    @pytest.mark.parametrize(
        "behavior",
        [
            "plone.basic",
            "plone.namefromtitle",
            "plone.shortname",
            "plone.excludefromnavigation",
            "plone.versioning",
            "volto.blocks",
            "plone.constraintypes",
            "volto.preview_image",
        ],
    )
    def test_has_behavior(self, get_behaviors, behavior):
        assert behavior in get_behaviors(CONTENT_TYPE)

    @pytest.mark.parametrize(
        "role,allowed",
        [
            ["Manager", True],
            ["Site Administrator", True],
            ["Editor", False],
            ["Reviewer", False],
            ["Contributor", False],
            ["Reader", False],
        ],
    )
    def test_create(self, area_payload, role: str, allowed: bool):
        with api.env.adopt_roles([role]):
            if allowed:
                content = api.content.create(container=self.portal, **area_payload)
                assert content.portal_type == CONTENT_TYPE
                assert isinstance(content, Area)
            else:
                with pytest.raises(Unauthorized):
                    api.content.create(container=self.portal, **area_payload)


class TestAreaFunctional:
    @pytest.fixture(autouse=True)
    def _setup(self, functional_portal, manager_request):
        self.portal = functional_portal
        self.request = manager_request

    @pytest.mark.parametrize(
        "fieldname,type_,fieldset",
        [
            ["email", "string", "contato"],
            ["telefone", "string", "contato"],
            ["endereco", "string", "endereco"],
            ["complemento", "string", "endereco"],
            ["cidade", "string", "endereco"],
            ["estado", "string", "endereco"],
            ["cep", "string", "endereco"],
        ],
    )
    def test_fields(self, fieldname: str, type_: str, fieldset: str):
        response = self.request.get(f"/@types/{CONTENT_TYPE}")
        assert response.status_code == 200
        data = response.json()
        field = data["properties"].get(fieldname)
        assert field is not None
        assert field["type"] == type_
        fieldsets = [fs for fs in data["fieldsets"] if fs["id"] == fieldset]
        assert fieldsets, f"Fieldset '{fieldset}' not found"
        assert fieldname in fieldsets[0]["fields"]

    @pytest.mark.parametrize(
        "email,valid",
        [
            ["foo@plone.org", False],
            ["foo@v2solucoes.com.br", True],
        ],
    )
    def test_validate_email(self, area_restapi_payload, email: str, valid: bool):
        area_restapi_payload["email"] = email
        response = self.request.post("/", json=area_restapi_payload)
        data = response.json()
        if valid:
            assert response.status_code == 201
            assert data["email"] == email
        else:
            assert response.status_code == 400
            assert "email" in data["message"]
