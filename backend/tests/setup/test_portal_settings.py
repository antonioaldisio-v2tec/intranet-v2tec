"""Portal settings tests."""

from plone import api

import pytest


class TestPortalSettings:
    """Test that Portal configuration is correctly done."""

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["plone.site_title", "Intranet V2 Solucoes"],
            ["plone.email_from_name", "Intranet V2 Solucoes"],
            ["plone.smtp_host", "localhost"],
            ["plone.smtp_port", 25],
            ["plone.portal_timezone", "America/Sao_Paulo"],
            ["plone.available_languages", ["pt-br"]],
            ["plone.navigation_depth", 4],
            ["plone.twitter_username", "plone"],
        ],
    )
    def test_setting(self, portal, key: str, expected: str | int):
        """Test registry setting."""
        value = api.portal.get_registry_record(key)
        assert value == expected
