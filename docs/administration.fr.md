# Administration

**Autre langue :** [English](./administration.md)

Exploitation quotidienne du tracker : ce qui est en place, ce qui doit rester
manuel, et comment le circuit a été vérifié.

## Réglages manuels, une fois

Trois workflows intégrés du projet **ne s'activent pas par l'API**. Le schéma
GraphQL public ne porte ni `createProjectV2Workflow` ni
`updateProjectV2Workflow`, seulement `deleteProjectV2Workflow`. Ils s'activent
dans l'interface du projet, menu **Workflows** :

| Workflow | Réglage |
|---|---|
| **Auto-add to project** | dépôt `blog-roadmap`, filtre `is:issue,is:open` |
| **Item added to project** | `Status` à `Inbox` |
| **Item closed** | `Status` à `Done` |

L'alternative serait l'action `actions/add-to-project`, qui exige un jeton
personnel stocké en secret du dépôt. Trois bascules coûtent moins cher qu'un
jeton durable à portée projet posé dans un dépôt public.

**Les filtres de vue** ont la même limite : `ProjectV2ViewConfigurationInput`
n'expose que `visibleFieldIds`. Les sept vues existent avec leur disposition et
leurs colonnes ; chaque filtre se colle une fois dans l'interface.

| Vue | Filtre |
|---|---|
| Inbox | `is:open status:Inbox` |
| Backlog | `is:open status:Backlog` |
| Current | `is:open status:Planned,"In progress",Review` |
| Content | `is:open label:type:content-request,type:content-error,type:outdated,type:enhancement` |
| Bugs | `is:open label:type:bug,type:broken-link,type:ux,type:seo` |
| Roadmap | `is:open status:Planned,"In progress"` |
| Done | `status:Done` |

## Ce que le circuit a été vérifié faire

Quatre issues, une par nature, ouvertes le 2026-09-17 puis fermées. Le workflow
de triage a posé, sans aucune intervention :

| Issue | Origine | Labels obtenus |
|---|---|---|
| Erreur de page, page FR | marqueur du site | `area:kubernetes`, `source:reader` |
| Obsolète, page FR, sans source | marqueur du site | `area:ansible`, `source:reader` |
| Lien cassé, **page EN** | marqueur du site | `area:containers`, `source:reader` |
| Amélioration, ouverte par l'auteur | aucun marqueur | `area:site`, pas de `source:reader` |

Deux choses prouvées, une infirmée.

Prouvé que **le domaine se déduit aussi sur les pages anglaises**. Les motifs ne
sont pas ancrés, ils testent une sous-chaîne, et `/en/docs/conteneurs/...`
contient `/docs/conteneurs/...`. Une revue avait annoncé ce cas cassé ; exécuter
les motifs réels sur des URL anglaises a montré le contraire.

Prouvé que **`source:reader` n'est posé que sur les issues portant le marqueur**
du site : celle ouverte par l'auteur ne l'a pas reçu.

Rien d'infirmé sur la **falsifiabilité** : n'importe qui peut recopier la ligne
du marqueur. `source:reader` veut dire « issue portant le marqueur du site », et
non « preuve qu'elle vient du bouton ». C'est suffisant pour ce qu'on en fait,
mesurer la part des corrections venues des lecteurs, et cela ne vaut pas la peine
d'être compliqué.

## La branche `main` est protégée

Une règle de dépôt calquée sur celle de `feint` s'applique à la branche par
défaut. Quatre contraintes, actives pour tout le monde :

| Règle | Effet |
|---|---|
| `deletion` | la branche ne peut pas être supprimée |
| `non_fast_forward` | pas de réécriture d'historique, donc pas de `push --force` |
| `pull_request` | toute modification passe par une pull request, **zéro approbation requise** |
| `required_status_checks` | la PR attend « Les gabarits portent les champs attendus », branche à jour exigée |

Zéro approbation n'est pas une protection molle : sur un dépôt tenu par une
seule personne, exiger un relecteur rendrait la règle contournable ou bloquante,
ce qui revient au même. Ce que la règle achète ici, c'est qu'aucune modification
n'atterrisse sans être passée par une PR, donc sans que le contrat des
formulaires ait été vérifié, et que l'historique reste linéaire et intact.

Le rôle administrateur figure en `bypass_actors`, mais en mode `pull_request` :
il contourne les contrôles **dans** une PR, jamais en poussant directement sur
`main`. Vérifié sur le dépôt, un `git push origin main` est refusé.

Conséquence sur la manière de travailler :

```bash
git switch -c <branche>
# ... modifications, commit ...
git push -u origin <branche>
gh pr create --fill
gh pr merge --squash --delete-branch
```

Le contrôle du contrat des formulaires se déclenche **sans filtre de chemin**
côté pull request, contrairement au déclencheur `push`. C'est délibéré : un
contrôle requis filtré par chemin laisse en attente éternelle toute PR qui ne
touche pas ces fichiers.

## Ouvrir une issue depuis un poste

```bash
gh issue create --repo stephrobert/blog-roadmap \
  --title "[Page] <titre exact de la page>" \
  --label "type:content-error,priority:medium,area:kubernetes,source:author" \
  --body-file <fichier>
```

Le formulaire **n'est pas appliqué** en ligne de commande : les labels se posent
à la main, et le corps doit porter l'URL, faute de quoi l'issue viole sa propre
règle de triage. Écrire le corps dans un fichier, jamais en ligne : le quoting
casse sur les accents et les apostrophes.

## Le contrat avec le site, et sa moitié aveugle

`contrat-formulaires.yml` vérifie, à chaque modification d'un gabarit, que les
quatre formulaires atteignables depuis une page portent `page-title`,
`page-url`, `page-id` et `locale`, et que leur préfixe de `title` correspond à ce
que le site envoie.

Il ne couvre que **la moitié que ce dépôt possède**. Un renommage côté site reste
invisible d'ici : le composant porte le même avertissement dans son en-tête, et
la skill `pilotage-backlog` le porte une troisième fois. Trois copies d'un
avertissement coûtent moins cher qu'une régression silencieuse.

## Ce qu'il ne faut pas automatiser

La priorité, l'effort, l'acceptation, le refus, et la fermeture pour inactivité.
Aucun workflow `stale` n'est installé, et c'est une décision, pas un oubli : une
idée éditoriale qui dort dix-huit mois reste une bonne idée.

## Catégories de discussion : pourquoi elles se posent à la main

Même limite que les workflows de projet, et vérifiée plutôt que supposée :
GraphQL n'expose **aucune mutation qui crée, renomme ou supprime une catégorie
de discussion**, et l'API REST n'a aucun endpoint, rendant 404 même en lecture.
Le seul `categoryId` mutable est celui d'`updateDiscussion`, qui **déplace** une
discussion sans toucher à la catégorie. L'API de GitHub range des discussions,
elle ne fabrique pas les casiers.

Les six catégories par défaut ont donc été **renommées** plutôt que créées, ce
qui conserve leur identifiant et laisse en place les discussions déjà publiées.
Voici l'état relevé le 2026-09-17, slugs compris :

| Catégorie | Slug réel | Format | Gabarit |
|---|---|---|---|
| 💡 Idées & suggestions | `idées-suggestions` | ouvert | oui |
| 🎓 Formations & pédagogie | `formations-pédagogie` | ouvert | oui |
| ❓ Questions | `questions` | Q&A | oui |
| 🔬 Retours d'expérience | `retours-d-expérience` | ouvert | oui |
| 📣 Annonces | `annonces` | annonce | non, écriture réservée |
| 🗳 Polls | supprimée | | |

**Le slug ne se devine pas, il se mesure.** GitHub met en minuscules, remplace
espaces, `&` et apostrophe par un tiret, fusionne les séparateurs consécutifs,
et **conserve les accents**. La première version de `.github/discussions.yml`
pariait sur une translittération, et interroger le dépôt a rendu les trois
écarts d'un coup.

Cette vérification n'est pas automatisée : une catégorie renommée ou supprimée
ne produit donc **aucun signal**. Elle se refait à la main quand les catégories
bougent, la requête est en tête de `.github/discussions.yml`.

Ce n'est pas cosmétique : GitHub apparie un gabarit de `DISCUSSION_TEMPLATE/` à
sa catégorie **par le nom du fichier**. Sur un slug faux, aucune erreur n'est
levée, le formulaire n'apparaît simplement jamais. Renommer une catégorie impose
de renommer son gabarit dans la foulée.

L'épinglage est manuel lui aussi : le schéma porte `pinIssue` et `unpinIssue`,
mais aucun équivalent pour une discussion, vérifié le 2026-09-17. Reste à
épingler **« Bienvenue : comment participer à l'évolution du site »**.
