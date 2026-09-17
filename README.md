# blog-roadmap

**Ce dépôt est le backlog public de [blog.stephane-robert.info](https://blog.stephane-robert.info).**

Il sert à signaler une erreur, proposer une amélioration, demander un contenu et
suivre ce qui est prévu. Tout passe par les **issues**, et chaque issue est
rattachée à un **projet** qui donne l'état d'avancement.

| | |
|---|---|
| Le site | https://blog.stephane-robert.info |
| Signaler quelque chose | [Ouvrir une issue](https://github.com/stephrobert/blog-roadmap/issues/new/choose) |
| Ce qui est en cours | [Roadmap](https://github.com/users/stephrobert/projects/3) |
| Ce qui existe déjà | [Issues ouvertes](https://github.com/stephrobert/blog-roadmap/issues) |

## In English

This repository is the **public backlog** of
[blog.stephane-robert.info](https://blog.stephane-robert.info): bug reports,
content requests and roadmap. It holds **no site code**.

The site is written in French and so is this tracker, but **you can write your
issues in English**. Every form accepts it, and the four forms reachable from a
page carry bilingual labels. The quickest way in is the **report button at the
bottom of any page**: it opens an issue already filled with the page title, its
URL and its language.

## Ce dépôt ne contient pas le code du site

Le site est un projet Astro Starlight qui vit **ailleurs**, dans un dépôt
séparé. Vous ne trouverez ici **ni page, ni composant, ni configuration de
build**, et rien de ce dépôt n'est nécessaire pour construire ou déployer le
site.

Ce choix est délibéré. Un backlog public doit pouvoir être lu, commenté et trié
par n'importe qui, sans donner accès au dépôt qui produit la publication, et
sans mélanger une discussion éditoriale avec une revue de code.

Conséquence pratique : **une issue ouverte ici ne se corrige pas ici**. Elle
décrit un problème ou une idée, elle est triée, puis la correction est faite
dans le dépôt du site et l'issue est fermée en référence.

## Signaler une erreur dans une page

Le plus simple est de partir de la page concernée : chaque page du site porte un
lien **« Signaler un problème »** en bas de contenu. Il ouvre une issue déjà
remplie avec le **titre de la page**, son **URL**, son **chemin** et sa
**langue**. Vous n'avez plus qu'à décrire ce que vous avez constaté.

Depuis GitHub, cinq formulaires existent :

| Formulaire | Quand l'utiliser |
|---|---|
| **Erreur dans une page** | Une commande fausse, une explication inexacte, une capture qui ne correspond plus |
| **Contenu obsolète** | La page décrit une version dépassée, l'outil a changé de comportement |
| **Lien cassé** | Un lien interne ou externe ne répond plus |
| **Demande de contenu** | Un sujet manque, une formation mériterait d'exister |
| **Amélioration** | Le contenu est juste mais la forme, la structure ou le parcours peuvent être meilleurs |

Un sixième, **Autre**, existe pour ce qui n'entre dans aucune case. Il est
volontairement le dernier : une issue bien rangée est une issue qui avance plus
vite.

## Proposer une amélioration ou un contenu

Les propositions sont bienvenues, et elles n'ont pas besoin d'être détaillées
pour être utiles. Deux choses aident vraiment : dire **à qui** le contenu
servirait, et **ce que le lecteur saurait faire** après l'avoir lu. Une demande
formulée comme un besoin se traite mieux qu'une demande formulée comme un titre.

L'ouverture d'une issue **ne garantit pas** son intégration. Le site suit une
ligne éditoriale, et certaines demandes seront refusées ou différées. Quand
c'est le cas, la raison est écrite dans l'issue avant sa fermeture.

## Suivre les évolutions

Le projet **blog.stephane-robert.info — Roadmap** porte toutes les issues, avec
leur statut, leur priorité et leur domaine. Les vues **Roadmap** et **Done**
donnent respectivement ce qui est planifié et ce qui vient d'être livré.

Pour être averti d'un changement précis, abonnez-vous à l'issue plutôt qu'au
dépôt entier : le volume attendu est élevé.

## Comment une issue avance

```text
Inbox  →  Triage  →  Backlog  →  Planned  →  In progress  →  Review  →  Done
                        ↓
                    Won't do
```

Le détail du triage, des labels et des automatisations vit dans
[docs/architecture.md](docs/architecture.md).

## Licence

Les issues et discussions de ce dépôt sont publiques. Le contenu du site, lui,
reste soumis à la licence annoncée sur le site.
