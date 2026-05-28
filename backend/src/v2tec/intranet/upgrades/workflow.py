"""GenericSetup upgrade steps for workflow configuration."""

from plone import api
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.WorkflowTool import WorkflowTool
from Products.GenericSetup.tool import SetupTool
from v2tec.intranet import logger


PROFILE = "profile-v2tec.intranet:default"


def import_workflow(context):
    """Re-import workflow bindings from the default profile."""
    setup = getToolByName(context, "portal_setup")
    setup.runImportStepFromProfile("type-workflow", PROFILE)


def atualiza_permissoes(portal_setup: SetupTool):
    """Atualiza todas as permissões em vista do novo workflow."""
    # Utilizamos a tool que gerencia todos os workflows
    wf_tool: WorkflowTool = api.portal.get_tool("portal_workflow")
    # Atualiza permissões
    wf_tool.updateRoleMappings()
    # Loga que modificação foi realizada
    logger.info("Permissões de workflow atualizadas")
