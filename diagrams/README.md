# Diagram sources

| Diagram | Preview | Vector | Mermaid | Editable |
| --- | --- | --- | --- | --- |
| Authentication / authorization sequence | [PNG](auth-sequence.png) | [SVG](auth-sequence.svg) | [Mermaid](auth-sequence.mmd) | [Excalidraw](auth-sequence.excalidraw) |
| User onboarding | [PNG](onboarding-map.png) | [SVG](onboarding-map.svg) | [Mermaid](onboarding-map.mmd) | [Excalidraw](onboarding-map.excalidraw) |

The sequence is conceptual. It distinguishes delegated user authentication,
item/model authorization, RLS/OLS, and the separately configured source identity.
It does not invent internal Fabric token-exchange details.

The onboarding map separates owner preparation, user setup, and acceptance.
Neither diagram performs authentication, grants access, or changes a tenant.

## Edit

Mermaid files render in compatible Markdown/GitHub viewers.
Open `.excalidraw` files in an approved Excalidraw installation; for the
Microsoft internal instance use [aka.ms/excalidraw](https://aka.ms/excalidraw).
Do not upload private authentication material to a diagram editor.

The local [renderer](../tools/render-diagrams.mjs) maintains shared content for
SVG, Excalidraw, and Mermaid outputs. It uses Node built-ins, not an online
rendering service:

```sh
node tools/render-diagrams.mjs
```

Run it from this folder. PNGs are previews of the SVGs; regenerate those with
an approved local SVG renderer after changing the diagram content.
