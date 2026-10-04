/*
 * Journal des versions, écrit à la main : les notes publiées sur GitHub ne
 * décrivent que l'installation. Ajouter une entrée en tête à chaque tag.
 *
 * `fallback` sert quand l'API GitHub ne répond pas (hors-ligne, quota de
 * 60 requêtes par heure et par IP dépassé) : le garder aligné sur la
 * dernière entrée publiée.
 *
 * GitHub Pages met les fichiers en cache 10 min : après toute modification
 * d'un .css ou .js, incrémenter le `?v=` de ses balises dans index.html.
 */
window.TXSWAP_RELEASES = {
  repo: "txreplay/txswap-releases",

  fallback: {
    version: "0.3.0",
    date: "2026-10-04",
    file: "txswap-0.3.0.apk",
    size: 54817782,
    sha256: "550a7f881609ddc2ab8837aaa38cda4f5b536008de28aaa20862b015fc85fff3",
  },

  // kind : "new" (Nouveau), "better" (Amélioré), "fix" (Corrigé)
  changelog: [
    {
      version: "0.3.0",
      date: "2026-10-04",
      title: "txSwap sur iPhone",
      items: [
        ["new", "txSwap arrive sur iPhone : la même app, à installer avec SideStore ou AltStore depuis la source txSwap. iOS 16 minimum."],
        ["new", "Sur iPhone, la lecture des cartes passe par la reconnaissance de texte d'Apple, sur l'appareil comme sur Android."],
        ["better", "Android : l'app repose désormais sur la même base que la version iPhone. Rien ne change à l'usage ; échanges, réglages et cotes en cache sont conservés à la mise à jour."],
      ],
    },
    {
      version: "0.2.0",
      date: "2026-10-03",
      title: "Ta cote, ton récap",
      items: [
        ["new", "Le récap d'un échange se partage en image : vignettes des cartes retenues, cotes et écart, dans le thème de l'app."],
        ["new", "Valeur de référence au choix dans les réglages : tendance, à partir de, moyenne 7 jours ou 30 jours. C'est elle qui s'affiche en grand et qu'un échange fige."],
        ["new", "Sans réseau, une cote relevée depuis moins de 24 h reste affichée, avec l'heure du relevé."],
        ["new", "Recherche : la cote de référence s'affiche sur chaque résultat."],
        ["new", "Recherche : depuis une fiche ouverte, un glissement passe au résultat suivant."],
        ["new", "Recherche : filtres Pikachu Rare, Triple Rare et Character Super Rare."],
        ["fix", "Le clavier ne s'ouvre plus au retour d'une fiche, seulement à l'arrivée sur la recherche."],
      ],
    },
    {
      version: "0.1.0",
      date: "2026-09-20",
      title: "Première version publique",
      items: [
        ["new", "Scan continu hors-ligne en français, anglais et japonais, sur un catalogue embarqué."],
        ["new", "Proposition en un tap quand la carte n'est pas certaine, et liste des candidats en repli."],
        ["new", "Classeurs et pochettes : seul le cadre-guide compte, conseil d'inclinaison contre les reflets."],
        ["new", "Mode manuel : photo à la résolution du capteur, figée puis analysée."],
        ["new", "Cote Cardmarket par variante, liens vers Cardmarket, eBay et Pokécardex."],
        ["new", "Échanges à deux côtés nommés, cartes retenues ou laissées sur la table, prix convenu avec raccourcis, produit libre."],
        ["new", "Récap d'échange partageable en texte."],
        ["new", "Recherche par nom, numéro, rareté et extension."],
        ["new", "Thèmes sombre et clair, mise à jour du catalogue depuis les réglages."],
      ],
    },
  ],
};
