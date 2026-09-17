# Signaler un problème de sécurité

Ce dépôt est un **backlog éditorial public**. Il ne contient ni code applicatif,
ni configuration de déploiement, ni secret. Une faille ne s'y trouve donc pas,
mais deux cas voisins méritent un canal privé.

## Ce qui ne passe pas par une issue publique

**Un secret publié par erreur sur le site.** Une clé d'API, un jeton, un mot de
passe ou une adresse interne qui se serait glissé dans un exemple de guide.
Ouvrir une issue publique reviendrait à le signaler à tout le monde en même temps
qu'à moi, et à le figer dans l'historique du tracker.

**Un conseil de sécurité dangereux.** Une commande, une configuration ou un
exemple qui exposerait le lecteur qui l'applique : permissions trop larges,
authentification désactivée, chiffrement absent. Le signaler en privé laisse le
temps de corriger la page avant qu'elle ne soit lue davantage.

## Comment le signaler

Par les **[Security Advisories](https://github.com/stephrobert/blog-roadmap/security/advisories/new)**
de ce dépôt, qui ouvrent un fil privé entre vous et moi.

À défaut, par le formulaire de contact du site. Dans les deux cas, donnez
l'**URL exacte** de la page et ce qui vous paraît dangereux.

## Ce que vous pouvez attendre

Un accusé de réception sous quelques jours. Un secret exposé est traité en
priorité, révoqué puis retiré du contenu. Une recommandation dangereuse est
corrigée sur la page, et la correction est publique même si le signalement ne
l'était pas.

## Ce qui n'entre pas dans ce cadre

Une erreur technique ordinaire, un lien cassé, un contenu obsolète : ce sont des
issues publiques, et elles se traitent bien mieux au grand jour. Les formulaires
de ce dépôt sont faits pour cela.

Le site n'expose aucun service applicatif : il s'agit de pages statiques servies
par un CDN. Un rapport de vulnérabilité portant sur une application inexistante
sera fermé sans suite.
