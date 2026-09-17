La roadmap de [blog.stephane-robert.info](https://blog.stephane-robert.info)
est désormais publique, dans ce dépôt.

## Ce que ça change

Jusqu'ici, ce qui restait à corriger sur le site vivait dans des fichiers de
suivi locaux, lisibles de moi seul. Un lecteur qui trouvait une commande fausse
n'avait aucun endroit évident où le dire, et aucun moyen de savoir si son
signalement avait été pris en compte.

Trois choses deviennent visibles :

- **ce qui est signalé**, y compris ce qui ne sera pas corrigé, avec la raison ;
- **ce qui est prévu**, dans le projet lié à ce dépôt ;
- **ce qui vient d'être publié**.

## Ce que ce dépôt ne contient pas

**Aucune ligne du code du site.** Il vit dans un dépôt séparé, et rien d'ici
n'est nécessaire pour le construire ou le déployer. La séparation est
volontaire : un backlog public doit pouvoir être lu et commenté par n'importe
qui, sans mélanger une discussion éditoriale avec une revue de code.

Conséquence pratique : une issue ouverte ici n'est pas corrigée ici. Elle décrit
un problème, elle est triée, la correction se fait dans le dépôt du site, et
l'issue se ferme en référence au commit.

## Ce qui n'est pas automatisé, et ne le sera pas

La priorité, l'effort, l'acceptation et le refus restent des décisions humaines.
Et **aucun robot ne fermera une issue pour inactivité** : sur un backlog
éditorial, une idée qui dort dix-huit mois reste une bonne idée. Un `stale bot`
détruirait exactement ce que ce dépôt existe pour conserver.

Ce qui est automatisé se limite à ce qu'un humain retaperait à l'identique : le
domaine déduit de l'URL, l'origine du signalement, l'arrivée dans le projet.

## Comment participer

Tout est dans la discussion épinglée, et le résumé tient en une ligne :
**une issue pour ce qui est précis et à corriger, une discussion pour tout ce qui
précède cette décision.**

Le détail du circuit, des labels et du triage vit dans
[docs/architecture.fr.md](https://github.com/stephrobert/blog-roadmap/blob/main/docs/architecture.fr.md).
