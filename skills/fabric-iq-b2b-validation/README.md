# Fabric IQ B2B validation skill

A standalone GitHub Copilot skill for connecting external Microsoft Entra
guests to Fabric IQ MCP, checking their actual query identity, verifying
owner-defined RLS/OLS expectations, and testing a restart.

It contains instructions and parameterized examples, **not credentials,
an MCP server, an authentication bridge, or a preconfigured tenant**.
All required references are included in the folder.

## Install

Copy the **entire** `fabric-iq-b2b-validation` folder to one of these locations:

| Scope | Destination |
| --- | --- |
| Project | `<repository>/.github/skills/fabric-iq-b2b-validation/` |
| Personal | `~/.copilot/skills/fabric-iq-b2b-validation/` |
| Alternative supported scope | `.agents/skills/` in a repository or your home directory |

On Windows, the personal path is under
`%USERPROFILE%\.copilot\skills\fabric-iq-b2b-validation`.
If a skill with the same name already exists, review and merge/replace it
deliberately; do not blindly overwrite it.

Inside the **native Copilot CLI**, run:

```text
/skills reload
/skills info fabric-iq-b2b-validation
```

For a folder outside the standard search locations, supported CLI versions
also offer `/skills add <absolute-skill-folder-path>`. Check the actual
client's help and confirm discovery in the same profile you will use for MCP.
In particular, do not assume a custom `COPILOT_HOME` profile discovers every
skill from your normal profile.

## Use

Examples to enter into the native CLI:

```text
Use the /fabric-iq-b2b-validation skill to connect my external customer
to Fabric IQ. Ask for missing environment details before changing settings.
```

```text
Use the /fabric-iq-b2b-validation skill to verify the current guest
identity on my Contoso Sales model. Do not change permissions or retrieve
customer records.
```

```text
Use the /fabric-iq-b2b-validation skill to diagnose "authenticated,
but failed to reconnect" and prove any recovery with a fresh query
and cold restart.
```

Supply your own resource tenant, expected guest UPN, report/model target,
configuration location and authorized security expectations when requested.
Placeholders such as `<MODEL_ID>` and `<EXPECTED_UPN>` must be replaced;
they are not runnable identifiers.

## Share

Share this complete folder or its local ZIP, including `SKILL.md`, this README,
and `references/`. Do **not** add your MCP profile, native session files,
software installation, OAuth URLs, tokens, cookies, tenant-specific evidence
or business data.

Sharing the folder does not grant Fabric access. Each recipient authenticates
with their own identity and follows their own organization's policies.
No repository publication, upload, license choice, or global installation is
performed by this package.

## Scope and limits

Start with the currently supported client and documented setup. Confirm
tenant policies, licensing, model permissions, and security expectations
for each user. These instructions do not certify another environment or
automate tenant setup.

Microsoft's general `fabriciq` skill covers business-question orchestration.
This skill deliberately focuses on native-client onboarding, B2B caller
verification, least privilege, security probes and recovery evidence.
