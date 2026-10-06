# Included skills

| Skill | Purpose |
| --- | --- |
| [fabric-iq-b2b-validation](fabric-iq-b2b-validation/SKILL.md) | Native guest onboarding, identity, RLS/OLS, troubleshooting and restart workflow |
| [Microsoft fabriciq](https://github.com/microsoft/skills-for-fabric/blob/main/skills/fabriciq/SKILL.md) | Official business-question orchestration; install separately |

The included skill's references must stay beside `SKILL.md`.
Microsoft's skill is linked rather than bundled. No skill grants data access.

## Install the included skill

Copy **only the complete `fabric-iq-b2b-validation` folder** to one supported scope:

| Scope | Destination |
| --- | --- |
| Project | `<repository>/.github/skills/fabric-iq-b2b-validation/` |
| Personal | `~/.copilot/skills/fabric-iq-b2b-validation/` |
| Alternative | `<repository>/.agents/skills/fabric-iq-b2b-validation/` or `~/.agents/skills/fabric-iq-b2b-validation/` |

On Windows, the personal Copilot directory is under
`%USERPROFILE%\.copilot\skills\`.
Review an existing same-name skill before merging or replacing it.
Do not copy MCP credential/session directories.

Inside the native CLI, where supported:

```text
/skills reload
/skills info fabric-iq-b2b-validation
```

Check the installed client's help if command availability differs.
Verify discovery in the same configuration profile used for MCP.

## Use

```text
Use the fabric-iq-b2b-validation skill to onboard my external user
to the intended report. Ask for missing environment details.
Do not change permissions, install versions, or alter sign-in behavior
without approval.
```

Replace the bundled skill's illustrative identifiers with your own target.
For a report, confirm its linked model and use report-ID input when supported
by the current native tool schema. See [troubleshooting](../docs/TROUBLESHOOTING.md)
for registration policy, artifact access, and licensing.

## Share

Share this documentation folder or ZIP. It contains placeholders and public
endpoints, not a tenant, invitation, permission grant, authentication bridge,
or installed executable.

Do not add raw logs, customer records, tokens, cookies, OAuth URLs, or
environment-specific evidence before distributing it.

See [GitHub's skill instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
and [Microsoft's Skills for Fabric installation](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install).
