# Fabric IQ B2B Onboarding

Connect external Microsoft Entra B2B users to Power BI through native
Fabric IQ MCP in GitHub Copilot CLI, using their own identities and
existing row-level and object-level security.

**Start with the [step-by-step procedure](docs/B2B-PROCEDURE.md).**
It covers guest invitation, report sharing, semantic model permissions,
RLS membership, licensing, and sign-in, with annotated screenshots.

## Requirements

- GitHub Copilot CLI installed and authenticated to GitHub.
- An external work/school account accepted as a guest in the resource tenant.
- Read access to the report and its semantic model, with intended RLS membership.
- Applicable Power BI licensing and compliance with tenant sign-in policies.
- A tenant home region that supports Fabric IQ MCP.

**Build permission and a workspace role are not required for native MCP.**
Keep the guest read-only; do not grant Admin, Member, or Contributor to
work around access problems.

## Copilot CLI setup

Merge the [example configuration](examples/mcp-config.example.json) into
your MCP configuration, preserving existing servers:

| Platform | Configuration file |
| --- | --- |
| macOS / Linux | `~/.copilot/mcp-config.json` |
| Windows | `%USERPROFILE%\.copilot\mcp-config.json` |

The example uses the official endpoint and pins the current tool contract.
No new app registration, proxy, or pasted bearer token is needed.

## Authenticate

Start `copilot`, then enter:

```text
/mcp show FabricIQ
```

Sign in with the intended Microsoft account and complete required MFA and
consent. Microsoft sign-in is separate from GitHub login.
The native client manages authentication; do not add an `Authorization` header.

## Test access

Follow [the identity-first check](docs/B2B-PROCEDURE.md#10-prove-the-actual-caller-before-reading-business-data)
before querying business data, then complete the
[security and restart checks](docs/B2B-PROCEDURE.md#11-test-security-and-persistence).

## Authentication sequence

![Native OAuth and data authorization sequence](diagrams/auth-sequence.png)

See [Authentication and authorization](docs/AUTHENTICATION.md) for details.

## Resources

| Resource | Purpose |
| --- | --- |
| [Procedure](docs/B2B-PROCEDURE.md) | Complete owner/user instructions |
| [Screenshots](screenshots/README.md) | Numbered red callouts for permissions and settings |
| [Checklist](docs/ONBOARDING.md) | Track onboarding completion |
| [CLI checks](docs/CLI-CHECKS.md) | Optional read-only administrator checks |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Help when setup is blocked |
| [Authentication](docs/AUTHENTICATION.md) | Identity, consent, and security boundaries |
| [Validation skill](skills/README.md) | Guided Copilot verification |

For product requirements, see Microsoft's
[Fabric IQ MCP documentation](https://learn.microsoft.com/en-us/fabric/iq/connectors/fabric-iq-mcp)
and [Fabric licensing guidance](https://learn.microsoft.com/en-us/fabric/enterprise/licenses).
