#!/usr/bin/env bash
# Pose les discussions fondatrices, une fois les categories creees.
#
# Idempotent : une discussion dont le titre existe deja n'est pas recreee. Le
# script peut donc etre rejoue apres un renommage de categorie sans produire de
# doublon.
#
# Il ne CREE PAS les categories, aucune mutation publique ne le permet. Il lit
# leurs identifiants et refuse de travailler si celles qu'il vise manquent,
# plutot que de poser les discussions n'importe ou.
set -euo pipefail

OWNER=${OWNER:-stephrobert}
REPO=${REPO:-blog-roadmap}
RACINE=$(cd "$(dirname "$0")/.." && pwd)

echo "### Categories du depot"
DONNEES=$(gh api graphql -f query="
  query {
    repository(owner: \"$OWNER\", name: \"$REPO\") {
      id
      discussionCategories(first: 50) { nodes { id name slug } }
      discussions(first: 100) { nodes { title } }
    }
  }")

DEPOT_ID=$(printf '%s' "$DONNEES" | python3 -c 'import json,sys;print(json.load(sys.stdin)["data"]["repository"]["id"])')
printf '%s' "$DONNEES" | python3 -c '
import json, sys
d = json.load(sys.stdin)["data"]["repository"]
for c in d["discussionCategories"]["nodes"]:
    print("  %-24s %s" % (c["slug"], c["name"]))
'

# La categorie visee : « annonces » si elle existe deja, sinon celle que GitHub
# fournit par defaut. Le script fonctionne donc avant ET apres le renommage.
CATEGORIE=$(printf '%s' "$DONNEES" | python3 -c '
import json, sys
c = {x["slug"]: x["id"] for x in json.load(sys.stdin)["data"]["repository"]["discussionCategories"]["nodes"]}
for slug in ("annonces", "announcements"):
    if slug in c:
        print(c[slug]); break
else:
    sys.exit("aucune categorie d annonces trouvee")
')

poser() {
  local titre="$1" fichier="$2"
  if printf '%s' "$DONNEES" | grep -qF "\"$titre\""; then
    echo "  deja presente : $titre"
    return 0
  fi
  python3 - "$DEPOT_ID" "$CATEGORIE" "$titre" "$fichier" <<'PY'
import json, subprocess, sys
depot, cat, titre, fichier = sys.argv[1:5]
corps = open(fichier, encoding="utf-8").read()
req = {
    "query": """mutation($d:ID!,$c:ID!,$t:String!,$b:String!){
      createDiscussion(input:{repositoryId:$d,categoryId:$c,title:$t,body:$b}){
        discussion { number url }
      }
    }""",
    "variables": {"d": depot, "c": cat, "t": titre, "b": corps},
}
p = subprocess.run(["gh", "api", "graphql", "--input", "-"],
                   input=json.dumps(req), capture_output=True, text=True)
if p.returncode:
    sys.exit(p.stderr.strip()[:300])
n = json.loads(p.stdout)["data"]["createDiscussion"]["discussion"]
print(f"  creee : {n['url']}")
PY
}

echo
echo "### Discussions fondatrices"
poser "Bienvenue : comment participer à l'évolution du site" "$RACINE/docs/discussions/bienvenue.md"
poser "Pourquoi la roadmap de blog.stephane-robert.info est publique" "$RACINE/docs/discussions/roadmap-publique.md"

echo
echo "Epinglage a faire dans l'interface : il n'existe pas de mutation pinDiscussion."
