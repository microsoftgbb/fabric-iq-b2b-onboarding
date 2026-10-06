import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'diagrams');
mkdirSync(output, { recursive: true });
const palette = {
  blue: ['#0078D4', '#CFE4FA'],
  purple: ['#5C2D91', '#E8DAEF'],
  green: ['#107C10', '#DFF6DD'],
  gray: ['#495057', '#F3F2F1'],
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[c]));

function drawing(name, width, height, title, description) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">`,
    `<title id="title">${escape(title)}</title><desc id="description">${escape(description)}</desc>`,
    '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs>',
    '<rect width="100%" height="100%" fill="#ffffff"/>',
  ];
  const elements = [];
  let serial = 0;
  const base = (type, x, y, w, h, color) => ({
    id: `${name}-${++serial}`, type, x, y, width: w, height: h, angle: 0,
    strokeColor: color, backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 2, strokeStyle: 'solid', roughness: 0, opacity: 100,
    groupIds: [], frameId: null, roundness: null, seed: serial,
    version: 1, versionNonce: serial, isDeleted: false, boundElements: null,
    updated: 1, link: null, locked: false,
  });
  function text(x, y, value, size = 20, align = 'left', textWidth = 800, containerId = null) {
    const lines = value.split('\n');
    const el = {
      ...base('text', x, y, textWidth, size * 2.5 * lines.length, '#000000'),
      text: value, originalText: value, fontSize: size, fontFamily: 2,
      textAlign: align, verticalAlign: containerId ? 'middle' : 'top',
      containerId, lineHeight: 1.25, autoResize: false,
    };
    elements.push(el);
    const anchor = align === 'center' ? 'middle' : 'start';
    const sx = align === 'center' ? x + textWidth / 2 : x;
    svg.push(`<text x="${sx}" y="${y + size}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" fill="#000000" text-anchor="${anchor}">${lines.map((line, i) => `<tspan x="${sx}" dy="${i ? size * 1.3 : 0}">${escape(line)}</tspan>`).join('')}</text>`);
    return el;
  }
  function box(x, y, w, h, value, color = 'blue', size = 20, container = false) {
    const [stroke, fill] = palette[color];
    const el = { ...base('rectangle', x, y, w, h, stroke), backgroundColor: container ? 'transparent' : fill, roundness: { type: 3 } };
    elements.push(el);
    svg.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${container ? 'none' : fill}" stroke="${stroke}" stroke-width="2"/>`);
    if (value) {
      const label = text(x + 16, y + 18, value, size, 'center', w - 32, el.id);
      el.boundElements = [{ id: label.id, type: 'text' }];
    }
    return el;
  }
  function line(x1, y1, x2, y2, color = 'gray', dashed = false, arrow = false) {
    const stroke = palette[color][0];
    const el = {
      ...base(arrow ? 'arrow' : 'line', x1, y1, Math.abs(x2 - x1), Math.abs(y2 - y1), stroke),
      points: [[0, 0], [x2 - x1, y2 - y1]], startBinding: null, endBinding: null,
      startArrowhead: null, endArrowhead: arrow ? 'arrow' : null,
      strokeStyle: dashed ? 'dashed' : 'solid',
    };
    elements.push(el);
    svg.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="2"${dashed ? ' stroke-dasharray="7 6"' : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`);
  }
  function save(mermaid) {
    writeFileSync(resolve(output, `${name}.svg`), `${svg.join('\n')}\n</svg>\n`);
    writeFileSync(resolve(output, `${name}.excalidraw`), `${JSON.stringify({
      type: 'excalidraw', version: 2, source: 'fabric-iq-native-onboarding',
      elements, appState: { viewBackgroundColor: '#ffffff', gridSize: null }, files: {},
    }, null, 2)}\n`);
    writeFileSync(resolve(output, `${name}.mmd`), `${mermaid.trim()}\n`);
  }
  text(40, 26, title, 32, 'left', width - 80);
  return { text, box, line, save };
}

const actors = [
  ['U', 'User / browser', 'blue'],
  ['C', 'Native\nCopilot CLI', 'blue'],
  ['E', 'Entra ID /\nresource policies', 'blue'],
  ['H', 'Home identity\nprovider', 'gray'],
  ['M', 'Fabric IQ\nMCP', 'purple'],
  ['P', 'Power BI\nsemantic engine', 'purple'],
  ['S', 'Model data\nsource', 'green'],
];
const messages = [
  ['C', 'M', 'Connect; discover\nauth requirements', 'Connect; discover authentication requirements'],
  ['M', 'C', 'Challenge / metadata\nwhen needed', 'Authentication challenge / metadata when needed', true],
  ['C', 'U', 'Open native sign-in\nstate + PKCE', 'Open native sign-in with state and PKCE'],
  ['U', 'E', 'Authorize in correct\nresource context', 'Authorize in the correct resource context'],
  ['E', 'H', 'B2B guest only:\nfederate sign-in', "Federate authentication to user's home identity"],
  ['H', 'E', 'B2B guest only:\nhome auth result', 'Home authentication result', true],
  ['E', 'U', 'Resource policy:\nMFA + consent if required', 'Apply resource policies, MFA and consent as required'],
  ['U', 'C', 'Native callback:\nauthorization code', 'Native callback with authorization code', true],
  ['C', 'E', 'Redeem code:\nnative PKCE verifier', 'Redeem code using the native PKCE verifier'],
  ['E', 'C', 'Delegated tokens\nclient-managed', 'Delegated token response managed by the client', true],
  ['C', 'M', 'Authenticated MCP:\ninitialize + tools/list', 'Authenticated MCP initialize and tools/list'],
  ['C', 'M', 'tools/call:\nidentity or bounded query', 'tools/call: identity or bounded data query'],
  ['M', 'P', 'Execute under caller\nitem/model permissions', "Execute under caller's item/model permissions"],
  ['P', 'S', 'If source read needed:\nconfigured source identity', "Read using the model's configured source identity"],
  ['S', 'P', 'Source-authorized\ndata', 'Source-authorized data', true],
  ['P', 'M', 'Caller RLS/OLS:\nsecured result or denial', "Result restricted by caller's RLS/OLS, or denial", true],
  ['M', 'C', 'Actual result + errors\nartifact metadata', 'Actual tool result, errors and artifact metadata', true],
  ['C', 'U', 'Explain permitted results\nretain actual evidence', 'Explain permitted results; retain actual response evidence', true],
];
{
  const d = drawing('auth-sequence', 2520, 2520, 'Fabric IQ MCP: authentication and authorization',
    'Conceptual native OAuth flow, optional B2B federation, model RLS and OLS, and separate source identity.');
  d.text(40, 84, 'Native client owns OAuth. Item permissions and RLS/OLS still govern data access.', 22, 'left', 2440);
  const positions = Object.fromEntries(actors.map(([id], i) => [id, 180 + i * 360]));
  for (const [id, label, color] of actors) {
    d.box(positions[id] - 160, 165, 320, 140, label, color);
    d.line(positions[id], 305, positions[id], 2310, 'gray', true);
  }
  d.text(40, 330, 'AUTHN: establish the intended Microsoft account and delegated API access', 22, 'left', 2440);
  messages.forEach(([from, to, label, , reply], i) => {
    const y = 400 + i * 100 + (i >= 11 ? 70 : 0);
    if (i === 11) d.text(40, y - 68, 'AUTHZ: verify item/model access, source access, and caller RLS/OLS', 22, 'left', 2440);
    const x1 = positions[from], x2 = positions[to];
    const w = Math.max(230, Math.abs(x2 - x1) - 16);
    d.text((x1 + x2 - w) / 2, y, `${i + 1}. ${label}`, 16, 'center', w);
    d.line(x1, y + 59, x2, y + 59, i >= 11 ? 'purple' : 'blue', Boolean(reply), true);
  });
  d.box(40, 2350, 2440, 140, 'Conceptual boundaries; SDK / broker details vary. No asserted internal token-exchange implementation.\nFixed workspace identity is an optional source pattern, not the guest caller. Cached queries may not read the source.', 'gray', 20);
  let mermaid = 'sequenceDiagram\n    autonumber\n';
  actors.forEach(([id, label]) => {
    mermaid += `    ${id === 'U' ? 'actor' : 'participant'} ${id} as ${label.replaceAll('\n', ' ')}\n`;
  });
  mermaid += '    Note over U,C: GitHub login is separate; Microsoft OAuth is client-managed\n';
  messages.forEach(([from, to, , label, reply], i) => {
    if (i === 4) mermaid += '    opt B2B guest with external home tenant\n';
    if (i === 13) mermaid += '    opt Model needs source access\n';
    mermaid += `    ${from}${reply ? '-->>' : '->>'}${to}: ${label}\n`;
    if (i === 5 || i === 14) mermaid += '    end\n';
    if (i === 14) mermaid += '    Note over P,S: Fixed workspace identity is optional and distinct from the guest\n';
  });
  d.save(mermaid);
}

const stages = [
  ['Owner', '1. Select the target', 'Report + linked model\nExpected user and RLS role\nLicensing + source preflight', 'blue'],
  ['Owner', '2. Prepare the identity', 'Member: confirm host account\nGuest: invite / redeem if needed\nMatch accepted host guest object', 'blue'],
  ['Owner', '3. Grant least privilege', 'Report + model Read\nExact RLS role; existing OLS\nNo speculative Build / source grant', 'blue'],
  ['User', '4. Check the report', 'Sign in as intended user\nComplete policy-required MFA\nApproved network / VPN if required', 'purple'],
  ['User', '5. Connect native MCP', 'Merge the HTTP configuration\nGitHub and Microsoft logins differ\nConfirm connected tools', 'purple'],
  ['Owner + user', '6. Prove and hand off', 'Fresh caller + original model\nBounded positive / RLS / OLS probes\nRestart; record scoped outcomes', 'green'],
];
{
  const d = drawing('onboarding-map', 1560, 1560, 'Fabric IQ MCP: new-user onboarding',
    'Owner preparation, user sign-in and connection, and evidence-based acceptance without permission escalation.');
  d.text(40, 85, 'Same native client steps for members and guests. Only guests need the B2B invitation / redemption branch.', 21, 'left', 1480);
  const xs = [40, 560, 1080];
  ['OWNER: prepare access', 'USER: sign in + connect', 'ACCEPTANCE: verify'].forEach((t, i) => d.text(xs[i], 165, t, 22, 'left', 440));
  d.box(30, 220, 500, 1210, '', 'blue', 20, true);
  d.box(550, 220, 500, 1210, '', 'purple', 20, true);
  d.box(1070, 220, 460, 1210, '', 'green', 20, true);
  const locations = [[50, 260], [50, 650], [50, 1040], [570, 260], [570, 1000], [1090, 620]];
  stages.forEach(([who, title, body, color], i) => {
    const [x, y] = locations[i];
    const w = i === 5 ? 420 : 460;
    d.box(x, y, w, 350, `${title}\n${who}\n\n${body}`, color, 19);
  });
  d.line(280, 610, 280, 645, 'blue', false, true);
  d.line(280, 1000, 280, 1035, 'blue', false, true);
  d.line(510, 1215, 540, 1215, 'blue');
  d.line(540, 1215, 540, 435, 'blue');
  d.line(540, 435, 565, 435, 'blue', false, true);
  d.text(580, 660, 'Owner preparation precedes\nuser report / MCP checks.', 20, 'left', 430);
  d.line(800, 610, 800, 995, 'purple', false, true);
  d.text(815, 790, 'Browser success\nis not MCP\nidentity proof.', 18, 'left', 210);
  d.line(1030, 1175, 1060, 1175, 'purple');
  d.line(1060, 1175, 1060, 795, 'purple');
  d.line(1060, 795, 1085, 795, 'purple', false, true);
  d.text(1095, 1070, 'Accept only actual user results.\nFail: unexpected data / identity.\nInconclusive: source/schema error.\nNever count an error as zero.', 19, 'left', 410);
  d.text(40, 1480, 'Stop at a failed gate. Fix the identified layer through approved owner action; never weaken MFA, RLS or OLS.', 21, 'left', 1480);
  d.save(`flowchart TD
    subgraph O["Owner: prepare access"]
        A["1. Select report + model, expected user, licensing and source"]
        B{"Member or B2B guest?"}
        C["Member: confirm resource-tenant account"]
        D["Guest: invite / redeem if needed; verify host guest object"]
        E["3. Report + model Read; intended RLS role; existing OLS"]
        A --> B
        B -->|Member| C
        B -->|Guest| D
        C --> E
        D --> E
    end
    subgraph U["User: sign in and connect"]
        F["4. Original report; intended account; MFA and approved network if required"]
        G["5. Native HTTP MCP configuration; separate GitHub / Microsoft sign-in"]
        H["Confirm native server and current tools"]
        E --> F --> G --> H
    end
    subgraph V["Owner + user: acceptance"]
        I["6. Fresh identity; original model; permitted aggregate"]
        J["Owner-defined serial RLS / OLS checks; restart identity"]
        K["Record pass / fail / inconclusive; sanitized handoff"]
        H --> I --> J --> K
    end
    X["Stop at failed gate; no speculative permission escalation"]
    F -.->|Policy / licensing block| X
    I -.->|Wrong caller / target| X
    J -.->|Unexpected visibility| X`);
}
