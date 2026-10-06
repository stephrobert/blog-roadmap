// Tests du triage automatique : `node --test .github/triage/deduire.test.js`.
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { deduire } = require("./deduire.js");

// Corps d'un signalement venu du bouton du site (gabarit francais).
const humaine = (url) => [
  "### Titre de la page", "", "Mon guide", "",
  "### URL de la page / Page URL", "", url, "",
  "### Identifiant de page / Page id", "", "docs/admin-serveurs/linux/shell", "",
].join("\n");

// Corps d'une issue du synchroniseur de couverture (forme reelle de #63).
const automatisee = [
  "## Objectif", "", "Créer les quiz de l’option `outscale`.", "",
  "<!-- coverage-key: bundle=quiz-option-outscale -->",
  "<!-- coverage-managed:start -->",
  "### Compétences",
  "- [ ] `cloud.account.access` : Accéder à son compte cloud (https://blog.stephane-robert.info/competences/cloud-account-access/)",
  "<!-- coverage-managed:end -->", "", "## Notes humaines", "",
].join("\n");

test("issue humaine : comportement inchangé (origine et domaine déduits de l'URL)", () => {
  assert.deepEqual(deduire(humaine("https://blog.stephane-robert.info/docs/admin-serveurs/linux/shell/"), []).sort(), ["area:linux", "source:reader"]);
  assert.deepEqual(deduire(humaine("https://blog.stephane-robert.info/formations/"), []).sort(), ["area:site", "source:reader"], "une page hors /docs/ vise le site");
  assert.deepEqual(deduire(humaine("https://blog.stephane-robert.info/docs/cloud/x/"), ["area:cloud", "source:reader"]), [], "rien de déjà posé n'est reposé");
});

test("issue source:automated avec URL de compétence : jamais area:site", () => {
  assert.deepEqual(deduire(automatisee, ["source:automated", "type:content-request", "priority:medium"]), []);
});

test("issue automatisée reconnue par son marqueur, même si le label manque à l'événement", () => {
  assert.deepEqual(deduire(automatisee, []), []);
});

test("issue automatisée avec area:cloud : rien n'est ajouté, area:cloud reste (le triage ne retire jamais)", () => {
  const labels = ["source:automated", "area:cloud"];
  const corps = automatisee.replace("/competences/cloud-account-access/", "/docs/cloud/outscale/decouvrir/cockpit/");
  assert.deepEqual(deduire(corps, labels), []);
});

test("issue automatisée sans domaine (CI) : reste sans area:*", () => {
  const corps = automatisee.replace("bundle=quiz-option-outscale", "bundle=proof-mission-standardiser-la-ci");
  assert.ok(!deduire(corps, ["source:automated"]).some((l) => l.startsWith("area:")));
});
