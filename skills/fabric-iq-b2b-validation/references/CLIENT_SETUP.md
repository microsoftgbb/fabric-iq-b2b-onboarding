# Client setup

## Native configuration

Check the user's installed CLI with `copilot --version` and its current help.
Use the current supported release first. Record OS/architecture and the
executable actually launched; a package manifest alone does not prove which
CLI is running.

Microsoft documents the normal MCP configuration file as:

- macOS/Linux: `~/.copilot/mcp-config.json`
- Windows: `%USERPROFILE%\.copilot\mcp-config.json`

For a separate profile, supported CLI builds recognize `COPILOT_HOME`.
Confirm behavior with the installed client. Choose a new, approved local
directory and create its `mcp-config.json`; never overwrite an existing file
without reading and preserving its unrelated entries.

The example server alias is `FabricIQ`:

```json
{
  "mcpServers": {
    "FabricIQ": {
      "type": "http",
      "url": "https://fabriciq.svc.cloud.microsoft/v1/mcp/fabriciq",
      "headers": {
        "X-Variants": "Fabric.Routing.FabricIQ.V1"
      },
      "tools": ["*"]
    }
  }
}
```

The header pins the currently documented tool-contract version, not the
endpoint's path version. Confirm the selector against current Microsoft
documentation when using this skill later.

`tools: ["*"]` exposes this server's documented read-only toolset; it neither
grants additional data permissions nor authorizes unrelated client actions.
Do not add an Authorization header or guessed OAuth tenant/scope settings.

For an organization that actually requires private links, Microsoft documents
`https://api.fabric.microsoft.com/v1/mcp/fabriciq` as the alternative endpoint.
Choose that based on the deployment's requirements, not as a blind error retry.

## Profile launch examples

These examples assume the approved profile directory and its configuration
already exist. Replace the sample local directory with your own. No personal
username, tenant ID, fixed callback port or Homebrew path is required.

POSIX shell, macOS/Linux:

```sh
profile="$HOME/fabric-iq-guest-profile"
cd "$profile" || exit 1
COPILOT_HOME="$profile" copilot --no-auto-update
```

PowerShell, Windows:

```powershell
$profile = Join-Path $HOME "fabric-iq-guest-profile"
if (-not (Test-Path -LiteralPath $profile -PathType Container)) {
    throw "Create and configure the approved profile directory first."
}
$previousHome = $env:COPILOT_HOME
try {
    $env:COPILOT_HOME = $profile
    Push-Location -LiteralPath $profile
    try {
        copilot --no-auto-update
    } finally {
        Pop-Location
    }
} finally {
    $env:COPILOT_HOME = $previousHome
}
```

Check that `--no-auto-update` is supported before using it. Pinning during
verification prevents an unobserved version change; it is not a recommendation
to remain indefinitely on an obsolete release.

Do not copy auth/credential files into the profile. Complete the native GitHub
login if the CLI needs it, then the separate Microsoft guest OAuth flow.
Do not reset HOME or erase corporate proxy/certificate settings as a default
cross-platform setup technique.

**A configuration profile is not an authentication security boundary.**
macOS Keychain and other OS-level stores/browser sessions may be shared.
An administrator sign-in in another profile can affect credential context.
Always verify the actual guest with a fresh model query.

## Native OAuth

Use the interactive CLI's current MCP UI, `/mcp show FabricIQ` where supported,
or `/mcp auth FabricIQ`. Verify the alias if different from this example.
Slash commands in another chat application are not necessarily executable.

The native client uses a preregistered Microsoft application and manages
delegated OAuth. The documented API permissions are `Item.Read.All`,
`Item.Execute.All`, and `Dataset.Read.All`; consent is subject to tenant policy.
Do not manufacture an explicit `.default` scope override or create a new app
registration to replace the native client.

Select the external guest's own work/school account, not a host administrator.
Allow the human to handle credentials, MFA and any actual consent decision.
Run only one active client/browser flow. A callback timeout requires a fresh
native flow, not reusing an expired page.

## Optional local version control

Use only an official GitHub Copilot CLI release or published official package.
Get explicit approval before installing a prerelease or updating globally.
Prefer a local installation so a working global CLI is not replaced.

Select the correct OS/architecture asset from the official release page.
Verify the release-provided digest/checksum where available before extraction,
and verify the executable's actual `--version` output and interactive banner.
Preserve the same MCP configuration when comparing versions.

If npm installs a loader but cannot find its platform package, the installation
is incomplete even when the root package has the expected version.
Check optional dependency availability once; do not blindly reinstall.
An official standalone platform release is an alternative.

Any saved launcher must accept or derive local profile/executable paths,
preserve relevant OS environment settings, and pass through user arguments.
Never distribute a launcher tied to another operator's username or install.

## Official sources

- [Fabric IQ MCP setup, auth and tool-contract selection](https://learn.microsoft.com/en-us/fabric/iq/connectors/fabric-iq-mcp)
- [GitHub Copilot CLI releases](https://github.com/github/copilot-cli/releases)
- [GitHub Copilot CLI repository and installation guidance](https://github.com/github/copilot-cli)
