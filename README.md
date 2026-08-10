# Site KOMAKA

Site statique (HTML/CSS/JS pur, sans dépendance serveur), construit à partir
de votre `index.html` existant : mêmes couleurs, mêmes polices (Sora + Inter),
même logo, même photo de profil. Prêt pour GitHub Pages, Cloudflare Pages,
ou tout hébergement statique.

## Arborescence

```
/index.html               accueil (contenu original conservé + aperçu blog)
/about.html                page "À propos" complète (Emmanuel Siba Guébé Guilavogui)
/articles/index.html       liste des articles (recherche, filtres, pagination)
/articles/article.html     page article unique (contenu chargé dynamiquement)
/css/styles.css            tous les styles (design original + extensions)
/js/main.js                 animations au scroll, FAQ, barres de compétences
/js/articles.js             logique du blog (liste + article)
/data/articles.json         contenu des articles — voir "Administration"
/images/                    favicon et image Open Graph (déclinés de votre logo)
/sitemap.xml, /robots.txt   SEO
```

## Chemins relatifs (sans domaine)

Tous les liens CSS/JS/images et internes utilisent des **chemins relatifs**
(`css/styles.css`, `../about.html`, `articles/index.html`, etc.) plutôt
qu'absolus. Résultat : le site fonctionne tel quel, sans aucune modification,
à n'importe quelle URL — y compris un sous-dossier GitHub Pages comme
`https://votre-utilisateur.github.io/komaka-site/`. Le jour où vous aurez un
nom de domaine, aucun changement de chemin n'est nécessaire : il suffit de
déployer le dossier tel quel à la racine du nouveau domaine.

## Administration du blog (sans toucher au HTML)

Pour ajouter, modifier ou supprimer un article, éditez uniquement
`/data/articles.json`. Format de chaque entrée :

```json
{
  "slug": "mon-nouvel-article",
  "title": "Titre de l'article",
  "excerpt": "Résumé affiché sur les cartes et en meta description.",
  "category": "Actualités",
  "author": "Emmanuel Siba Guébé Guilavogui",
  "date": "2026-08-06",
  "readTime": 5,
  "cover": "#4F46E5",
  "tags": ["Tag1", "Tag2"],
  "content": [
    { "type": "p", "text": "Un paragraphe." },
    { "type": "h2", "text": "Un sous-titre." }
  ]
}
```

Après ajout, ajoutez l'URL correspondante dans `sitemap.xml`.

## À faire avant mise en production

1. **Domaine (SEO)** : les balises `canonical`, `og:url` et le fichier
   `sitemap.xml` utilisent encore `https://www.komaka.tech` en placeholder
   (ces balises doivent rester des URLs absolues, donc elles ne peuvent pas
   être relatives). Une fois le site en ligne (GitHub Pages ou domaine),
   indiquez-moi l'URL réelle et je les mets à jour partout en une fois.
2. **CV** : le bouton "Télécharger mon CV" sur `about.html` est un placeholder
   (attribut `data-cv-download`) — remplacez-le par un lien vers un PDF réel.
3. **Badge LinkedIn** : intégré tel que fourni (script officiel LinkedIn chargé
   en bas de `about.html`) ; il s'affiche automatiquement une fois le script chargé.
4. **Commentaires** : formulaire désactivé sur `article.html`, prêt pour une
   future intégration (API interne, Giscus, Disqus…).

## Déploiement sur GitHub Pages

1. Créez un dépôt (ex. `komaka-site`), ajoutez tous ces fichiers à la racine.
2. *Settings* → *Pages* → source = branche `main`, dossier `/ (root)`.
3. Le site sera en ligne à `https://votre-utilisateur.github.io/komaka-site/`
   — aucun réglage de chemin supplémentaire n'est nécessaire.

## Compatibilité

Aucune dépendance externe hors Google Fonts (Sora + Inter) et le script
officiel LinkedIn (badge). Fonctionne sans build, sans serveur, sans base
de données.
