# txswap-releases

**txSwap** est une application Android qui aide à échanger des cartes Pokémon à la table : elle reconnaît les
cartes posées par chacun **sans réseau**, les cote sur Cardmarket et calcule l'écart entre les deux côtés.
On décoche ce qui ne s'échange pas, l'écart se recalcule.

Ce dépôt sert à **distribuer l'app** : il contient les APK signés publiés par la CI, et le site de présentation.
Le code source de l'app n'est pas public.

🌐 **Site : https://txreplay.github.io/txswap-releases/** — fonctionnalités, captures, guide d'installation, nouveautés.

## Télécharger

La dernière version est sur la page **[Releases](https://github.com/txreplay/txswap-releases/releases/latest)**,
dans la section *Assets* (`txswap-x.y.z.apk`).

- Android **8.0** minimum, processeur 64 bits ARM (`arm64-v8a`) : presque tous les téléphones sortis depuis 2017.
- Gratuit, sans compte, sans pub. Pas encore disponible sur iPhone (en préparation).

## Installer

1. Télécharge l'APK depuis le téléphone, puis ouvre-le.
2. Android demande d'autoriser les installations depuis cette source (navigateur ou app Fichiers) : accepte.
3. Play Protect peut afficher un avertissement, comme pour toute app hors Play Store :
   *Plus de détails → Installer quand même*.

Chaque release indique l'empreinte **SHA-256** de l'APK. Pour vérifier le fichier depuis un ordinateur :

```sh
shasum -a 256 txswap-x.y.z.apk
```

## Mises à jour automatiques avec Obtainium

[Obtainium](https://github.com/ImranR98/Obtainium) suit les releases GitHub et installe les nouvelles versions :
*Ajouter une app* → colle `https://github.com/txreplay/txswap-releases` → *Ajouter* → *Installer*.

> **Ne désinstalle pas txSwap pour le mettre à jour** : installe la nouvelle version par-dessus.
> La désinstallation efface les échanges enregistrés sur le téléphone.

## Signaler un problème

Bug, carte mal reconnue, idée ou question : [ouvre une issue](https://github.com/txreplay/txswap-releases/issues/new/choose)
(un modèle par type), ou passe par le [formulaire du site](https://txreplay.github.io/txswap-releases/#contact).

## Contenu du dépôt

| Emplacement | Rôle |
|---|---|
| [Releases](https://github.com/txreplay/txswap-releases/releases) | APK signés, publiés à chaque tag par la CI de l'app. |
| `docs/` | Site de présentation, servi par GitHub Pages. |
| `.github/ISSUE_TEMPLATE/` | Modèles d'issue : bug, reconnaissance, idée, question. |

---

txSwap est un projet indépendant, non affilié à The Pokémon Company, Nintendo, Creatures, GAME FREAK, Cardmarket,
eBay ni Pokécardex. Données des cartes et cotes : [TCGdex](https://tcgdex.dev).
