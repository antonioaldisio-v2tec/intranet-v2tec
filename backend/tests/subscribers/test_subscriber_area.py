from plone import api
from plone.app.dexterity.behaviors.exclfromnav import IExcludeFromNavigation
from zope.event import notify
from zope.lifecycleevent import ObjectModifiedEvent

import pytest
import transaction


CONTENT_TYPE = "Area"


class TestAreaSubscriber:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    @pytest.mark.parametrize(
        "description,exclude_from_nav,area_id",
        [
            ["Área responsável por TI", False, "area-com-descricao"],
            ["", True, "area-descricao-vazia"],
            [None, True, "area-sem-descricao"],
        ],
    )
    def test_exclude_from_navigation_on_add(
        self,
        description: str | None,
        exclude_from_nav: bool,
        area_id: str,
    ):
        """Área criada com description vazio é excluída da navegação."""
        with api.env.adopt_roles(["Manager"]):
            kwargs = {
                "type": CONTENT_TYPE,
                "id": area_id,
                "title": "Área de Teste",
            }
            if description is not None:
                kwargs["description"] = description
            area = api.content.create(container=self.portal, **kwargs)
            behavior = IExcludeFromNavigation(area)
            assert behavior.exclude_from_nav is exclude_from_nav

    def test_cria_grupo_editores(self):
        """Área criada deve ter um grupo de editores com papel Editor local."""
        with api.env.adopt_roles(["Manager"]):
            area = api.content.create(
                container=self.portal,
                type=CONTENT_TYPE,
                id="rh",
                title="Recursos Humanos",
                description="Área de RH",
            )
            groupname = "rh-editores"
            group = api.group.get(groupname=groupname)
            assert group is not None
            assert group.getProperty("title") == "Editores - Recursos Humanos"
            roles = api.group.get_roles(
                groupname=groupname,
                obj=area,
                inherit=False,
            )
            assert "Editor" in roles

    @pytest.mark.parametrize(
        "initial_description,new_description,exclude_from_nav",
        [
            ["Área responsável por TI", "", True],
            ["Área responsável por TI", None, True],
            ["", "Área com nova descrição", False],
            [None, "Área com nova descrição", False],
        ],
    )
    def test_exclude_from_navigation_on_modify(
        self,
        initial_description: str | None,
        new_description: str | None,
        exclude_from_nav: bool,
    ):
        """Área modificada atualiza exclusão da navegação conforme description."""
        with api.env.adopt_roles(["Manager"]):
            kwargs = {
                "type": CONTENT_TYPE,
                "id": "area-modify",
                "title": "Área de Teste",
            }
            if initial_description is not None:
                kwargs["description"] = initial_description
            area = api.content.create(container=self.portal, **kwargs)
            area.description = new_description
            notify(ObjectModifiedEvent(area))
            behavior = IExcludeFromNavigation(area)
            assert behavior.exclude_from_nav is exclude_from_nav


class TestAreaSubscriberFunctional:
    @pytest.fixture(autouse=True)
    def _setup(self, functional_portal, manager_request):
        self.portal = functional_portal
        self.request = manager_request

    @pytest.mark.parametrize(
        "description,exclude_from_nav,area_id",
        [
            ["Área responsável por TI", False, "area-rest-com-descricao"],
            ["", True, "area-rest-descricao-vazia"],
        ],
    )
    def test_exclude_from_navigation_on_add_via_restapi(
        self,
        description: str,
        exclude_from_nav: bool,
        area_id: str,
    ):
        """Subscriber é acionado ao criar Área via REST API."""
        payload = {
            "@type": CONTENT_TYPE,
            "id": area_id,
            "title": "Área de Teste",
            "description": description,
            "email": "area@v2solucoes.com.br",
            "telefone": "6132101234",
        }
        response = self.request.post("/", json=payload)
        assert response.status_code == 201
        transaction.commit()
        area = self.portal[area_id]
        behavior = IExcludeFromNavigation(area)
        assert behavior.exclude_from_nav is exclude_from_nav

    def test_cria_grupo_editores_via_restapi(self):
        """Subscriber cria grupo de editores ao adicionar Área via REST API."""
        area_id = "area-rest-grupo-editores"
        payload = {
            "@type": CONTENT_TYPE,
            "id": area_id,
            "title": "Comercial",
            "description": "Área comercial",
            "email": "comercial@v2solucoes.com.br",
            "telefone": "6132101234",
        }
        response = self.request.post("/", json=payload)
        assert response.status_code == 201
        transaction.commit()
        area = self.portal[area_id]
        groupname = f"{area_id}-editores"
        group = api.group.get(groupname=groupname)
        assert group is not None
        assert group.getProperty("title") == "Editores - Comercial"
        roles = api.group.get_roles(
            groupname=groupname,
            obj=area,
            inherit=False,
        )
        assert "Editor" in roles
