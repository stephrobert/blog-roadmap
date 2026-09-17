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
