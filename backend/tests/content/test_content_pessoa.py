from AccessControl import Unauthorized
from plone import api
from plone.dexterity.fti import DexterityFTI
from v2tec.intranet.content.pessoa import Pessoa
from zope.component import createObject

import pytest


CONTENT_TYPE = "Pessoa"


@pytest.fixture
def pessoa_payload() -> dict:
    """Return a payload to create a new pessoa."""
    return {
        "type": "Pessoa",
        "id": "joao-silva",
        "title": "João Silva",
        "description": "Desenvolvedor na V2Tec",
        "email": "joao@v2solucoes.com.br",
        "telefone": "6132101234",
    }


@pytest.fixture
def pessoa_restapi_payload() -> dict:
    """Return a payload to create a new pessoa."""
    return {
        "@type": "Pessoa",
        "id": "joao-silva",
        "title": "João Silva",
        "description": "Desenvolvedor na V2Tec",
        "email": "joao@v2solucoes.com.br",
        "telefone": "6132101234",
    }


class TestPessoa:
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
        assert isinstance(obj, Pessoa)

    @pytest.mark.parametrize(
        "behavior",
        [
            "plone.basic",
            "plone.namefromtitle",
            "plone.shortname",
            "plone.excludefromnavigation",
            "plone.versioning",
            "plone.constraintypes",
            "plone.leadimage",
            "v2tec.intranet.behavior.contato",
            "v2tec.intranet.behavior.endereco",
        ],
    )
    def test_has_behavior(self, get_behaviors, behavior):
        assert behavior in get_behaviors(CONTENT_TYPE)

    @pytest.mark.parametrize(
        "behavior",
        [
            "volto.blocks",
            "volto.preview_image",
        ],
    )
    def test_does_not_have_behavior(self, get_behaviors, behavior):
        assert behavior not in get_behaviors(CONTENT_TYPE)

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
    def test_create(self, pessoa_payload, role: str, allowed: bool):
        with api.env.adopt_roles([role]):
            if allowed:
                content = api.content.create(container=self.portal, **pessoa_payload)
                assert content.portal_type == CONTENT_TYPE
                assert isinstance(content, Pessoa)
            else:
                with pytest.raises(Unauthorized):
                    api.content.create(container=self.portal, **pessoa_payload)


class TestPessoaFunctional:
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
            ["image", "object", "default"],
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
    def test_validate_email(self, pessoa_restapi_payload, email: str, valid: bool):
        pessoa_restapi_payload["email"] = email
        response = self.request.post("/", json=pessoa_restapi_payload)
        data = response.json()
        if valid:
            assert response.status_code == 201
            assert data["email"] == email
        else:
            assert response.status_code == 400
            assert "email" in data["message"]

    @pytest.mark.parametrize(
        "behavior",
        [
            "plone.basic",
            "plone.namefromtitle",
            "plone.shortname",
            "plone.excludefromnavigation",
            "plone.versioning",
            "v2tec.intranet.behavior.contato",
            "v2tec.intranet.behavior.endereco",
            "plone.leadimage",
            "plone.constraintypes",
        ],
    )
    def test_has_behavior(self, get_behaviors, behavior):
        assert behavior in get_behaviors(CONTENT_TYPE)

    @pytest.mark.parametrize(
        "behavior",
        [
            "volto.blocks",
            "volto.preview_image",
        ],
    )
    def test_does_not_have_behavior(self, get_behaviors, behavior):
        assert behavior not in get_behaviors(CONTENT_TYPE)
