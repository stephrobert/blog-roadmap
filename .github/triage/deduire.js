// Ce que le triage automatique DEDUIT d'une issue : son origine et son domaine.
//
// Module pur, sans appel a GitHub : le workflow `issue-triage.yml` l'appelle,
// et `deduire.test.js` le verifie a chaque pull request. Il ne prend aucune
// decision editoriale (priorite, type, fermeture) et ne RETIRE jamais un label.
"use strict";

// Le domaine se lit dans le chemin de l'URL, jamais dans le texte : un lecteur
// qui ecrit « kubernetes » dans sa phrase ne dit pas sur quelle page il etait.
// L'ordre compte, le premier motif qui matche gagne, et le plus specifique
// passe donc en premier.
const DOMAINES = [
  [/\/docs\/conteneurs\/orchestrateurs\/kubernetes\//, "area:kubernetes"],
  [/\/docs\/infra-as-code\/gestion-de-configuration\/ansible\//, "area:ansible"],
  [/\/docs\/infra-as-code\/provisionnement\/terraform\//, "area:terraform"],
  [/\/docs\/admin-serveurs\/linux\//, "area:linux"],
  [/\/docs\/observabilite\//, "area:observability"],
  [/\/docs\/securiser\//, "area:devsecops"],
  [/\/docs\/(ia|mlops)\//, "area:ai"],
  [/\/docs\/cloud\//, "area:cloud"],
  [/\/docs\/conteneurs\//, "area:containers"],
];

/**
 * Une issue ecrite par un outil, pas par un lecteur : le synchroniseur de
 * couverture du site pose lui-meme `source:automated` et ses `area:*`, et
 * marque son corps d'une `coverage-key`. Le marqueur est lu en plus du label :
 * a l'ouverture, un label pose par l'API peut manquer a la charge utile.
 */
function estAutomatisee(corps, labels) {
  return labels.includes("source:automated") || /<!-- coverage-key: /.test(corps);
}

/**
 * Les labels a AJOUTER, compte tenu de ceux deja poses.
 *
 * Une issue automatisee ne recoit rien : son domaine est decide par l'outil
 * qui l'ecrit, et les URL de son corps pointent vers des fiches de competence
 * (`/competences/…`), pas vers la page signalee. Les lire posait `area:site`
 * sur 19 issues de couverture le 2026-10-06. Une issue automatisee sans
 * domaine (la CI, par exemple) reste sans `area:*` plutot que d'en recevoir
 * un artificiel.
 */
function deduire(corps, labelsPoses) {
  corps = corps || "";
  const deja = new Set(labelsPoses);
  if (estAutomatisee(corps, labelsPoses)) return [];

  const labels = new Set();

  // L'origine se lit dans le champ `page-id`, que seul le bouton du site
  // remplit. GitHub ecrit chaque champ sous un titre `### <label>` ; les
  // libelles sont figes par contrat-formulaires.yml : « Identifiant de page /
  // Page id » pour les gabarits francais, « Page id » pour les anglais.
  const pageId = (corps.match(/^### (?:Identifiant de page \/ )?Page id\s*\n+([^\n]+)/m) || [])[1] || "";
  if (pageId.trim() && pageId.trim() !== "_No response_") labels.add("source:reader");

  const url = (corps.match(/https:\/\/blog\.stephane-robert\.info\/\S*/) || [])[0] || "";
  if (url) {
    for (const [motif, label] of DOMAINES) {
      if (motif.test(url)) { labels.add(label); break; }
    }
    // Une URL hors /docs/ vise le site lui-meme, pas un contenu.
    if (![...labels].some((l) => l.startsWith("area:")) && !url.includes("/docs/")) labels.add("area:site");
  }

  // Ne jamais RETIRER un label : un humain a pu corriger une deduction fausse.
  return [...labels].filter((l) => !deja.has(l));
}

module.exports = { deduire, estAutomatisee, DOMAINES };
