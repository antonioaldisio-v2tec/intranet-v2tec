from plone import api
from plone.app.dexterity.behaviors.exclfromnav import IExcludeFromNavigation
from v2tec.intranet.content.area import Area


def area_added(obj: Area, event) -> None:
    """Ações executadas ao adicionar uma Área."""
    behavior = IExcludeFromNavigation(obj)
    if obj.description:
        behavior.exclude_from_nav = False
    else:
        behavior.exclude_from_nav = True

    groupname = f"{obj.getId()}-editores"
    api.group.create(
        groupname=groupname,
        title=f"Editores - {obj.Title()}",
        description=f"Grupo de editores da área {obj.Title()}",
    )
    api.group.grant_roles(
        groupname=groupname,
        roles=["Editor"],
        obj=obj,
    )
