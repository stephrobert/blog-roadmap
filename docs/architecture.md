# Architecture du pilotage

Ce document décrit comment un signalement devient une correction publiée. Il est
la référence pour le triage, les labels et les automatisations.

## Le circuit

```text
SITE  blog.stephane-robert.info
  │
  │   bouton « Signaler un problème » en bas de page
  │   pré-remplit titre, URL, chemin et langue
  ▼
GITHUB ISSUE  stephrobert/blog-roadmap
  │
  │   Issue Form : le lecteur ne décrit que le problème
  │   Action de triage : pose source:reader et area:*
  ▼
GITHUB PROJECT  « blog.stephane-robert.info — Roadmap »
  │
  ├─ Inbox        arrivée, non triée
  ├─ Triage       type, priorité, domaine, effort posés
  ├─ Backlog      accepté, non planifié
  ├─ Planned      inscrit à une échéance
  ├─ In progress  en cours de correction, dans le dépôt du SITE
  ├─ Review       corrigé, en attente de publication
  ├─ Done         publié
  └─ Won't do     refusé, avec la raison écrite dans l'issue
  │
  ▼
DÉPÔT DU SITE  (séparé)
  correction, build, publication
  │
  ▼
ISSUE FERMÉE  en référence au commit
```

Le point important est la **frontière** : ce dépôt porte la décision, le dépôt du
site porte la correction. Aucune modification de contenu ne se fait ici.

## Labels

La taxonomie est volontairement **courte**. Un tracker meurt de trop de labels
bien avant de mourir de trop d'issues : passé une vingtaine, plus personne ne les
pose de la même façon, et le filtre cesse de vouloir dire quelque chose.

### Type, un seul par issue

| Label | Ce qu'il désigne |
|---|---|
| `type:content-error` | La page dit quelque chose de faux |
| `type:outdated` | La page était juste, la technologie a changé |
| `type:broken-link` | Un lien ne répond plus |
| `type:content-request` | Un contenu qui n'existe pas encore |
| `type:enhancement` | Le contenu est juste, la forme peut être meilleure |
| `type:seo` | Référencement, métadonnées, structure de titres |
| `type:ux` | Navigation, lisibilité, ergonomie du site |
| `type:bug` | Défaut technique du site lui-même |

`type:outdated` et `type:content-error` se confondent souvent. La règle : si la
page a **déjà été juste**, c'est `outdated` ; si elle n'a **jamais** été juste,
c'est `content-error`. La distinction n'est pas cosmétique, elle décide de la
correction, un rafraîchissement de version dans un cas, une réécriture dans
l'autre.

### Priorité, un seul par issue

| Label | Critère |
|---|---|
| `priority:critical` | Le lecteur qui applique la page casse quelque chose, ou s'expose |
| `priority:high` | Information fausse sur une page très lue, ou parcours bloqué |
| `priority:medium` | Défaut réel, sans conséquence immédiate |
| `priority:low` | Confort, cohérence, dette |

La priorité se pose **au triage**, jamais à l'ouverture. Une issue qui arrive
avec une priorité annoncée par son auteur la reçoit quand même de nouveau.

### Domaine

`area:kubernetes`, `area:linux`, `area:ansible`, `area:terraform`, `area:cloud`,
`area:devsecops`, `area:containers`, `area:observability`, `area:ai`,
`area:site`.

Ces labels sont **déduits de l'URL** par le workflow de triage, et le dernier,
`area:site`, désigne ce qui ne concerne aucun contenu : navigation, recherche,
thème, performance.

### Origine

`source:reader`, `source:author`, `source:automated`.

`source:reader` est posé automatiquement quand l'issue vient du bouton du site.
Il sert à mesurer une chose utile : la part des corrections qui viennent des
lecteurs plutôt que d'une relecture interne.

## Règles de triage

Une issue quitte **Inbox** quand quatre choses sont vraies :

1. elle porte **une URL exploitable**, ou elle n'en a pas besoin ;
2. elle décrit **une seule action** réalisable, sinon elle est scindée ;
3. elle porte **un type** et **une priorité** ;
4. elle n'est pas un **doublon**, sinon elle est fermée en référence à l'autre.

Trois refus fréquents, et ils se motivent toujours par écrit :

- **hors ligne éditoriale** : le sujet existe, il n'entre pas dans le périmètre
  que le site s'est fixé ;
- **déjà traité ailleurs** : une page couvre le besoin, l'issue devient un
  problème de maillage ;
- **non reproductible** : le signalement ne permet pas de retrouver le défaut, et
  une relance est restée sans réponse.

## Automatisations

Ce qui est automatisé est ce qu'un humain retaperait **à l'identique** à chaque
fois. Le reste ne l'est pas, par choix.

| Automatisation | Où | Ce qu'elle fait |
|---|---|---|
| Ajout au projet | Workflow intégré du Project | Toute nouvelle issue arrive en `Inbox` |
| Passage en Done | Workflow intégré du Project | Une issue fermée passe en `Done` |
| Origine et domaine | `.github/workflows/issue-triage.yml` | Pose `source:reader` et `area:*` depuis l'URL |

**Ce qui n'est pas automatisé, et ne le sera pas** : la priorité, l'effort,
l'acceptation, le refus, et la fermeture pour inactivité. Un backlog éditorial
n'est pas une file de bugs : une idée qui dort dix-huit mois reste une bonne
idée, et un robot qui la ferme au bout de soixante jours détruit précisément ce
que ce dépôt existe pour conserver. C'est la raison pour laquelle **aucun
workflow `stale` n'est installé**.

Le workflow de triage ne **retire** jamais un label. Une déduction fausse
corrigée à la main reste corrigée, même si l'issue est éditée ensuite.

## Le pré-remplissage depuis le site

Le bouton de chaque page construit une URL vers le formulaire
`page-error.yml` et passe les champs par la chaîne de requête. Les noms des
paramètres sont les **identifiants** des champs du formulaire, et un changement
d'identifiant côté formulaire casse silencieusement le pré-remplissage côté site.

| Paramètre | Champ du formulaire |
|---|---|
| `title` | le titre de l'issue |
| `page-title` | Page concernée |
| `page-url` | URL |
| `locale` | Langue de la page |

Le corps de l'issue se termine par la ligne
`Issue créée depuis blog.stephane-robert.info`, qui est le marqueur lu par le
workflow pour poser `source:reader`. **Ne pas la modifier sans modifier le
workflow.**

## Ce que ce dépôt ne fait pas

Il ne mesure pas l'audience, il ne collecte pas de vote « cette page vous
a-t-elle été utile », et il ne reçoit pas de métrique. Ces signaux ont leur
place, mais séparément : transformer chaque pouce en bas en issue noierait le
backlog sous du bruit non actionnable, et rendrait le tracker inutilisable en
quelques semaines.
