---
title: "Guide de mise à jour automatique des dépendances avec Renovate"
description: "Utiliser Renovate pour automatiser complètement les mises à jour des dépendances des dépôts GitHub sans intervention manuelle"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Mise à jour automatique des dépendances avec Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: fr
---

## Introduction

La maintenance des dépendances de projet fait partie du travail quotidien des développeurs. Vérifier, mettre à jour et tester manuellement les versions des dépendances est non seulement chronophage, mais aussi sujet à des omissions. Cet article explique comment utiliser **Renovate** pour automatiser complètement les mises à jour des dépendances.

## Objectifs

- Vérifier automatiquement les mises à jour des dépendances chaque jour à l'aube
- Créer automatiquement des PR et les fusionner (après passage des CI)
- Aucune intervention manuelle, fonctionnement en arrière-plan
- Gestion unifiée sur plusieurs dépôts

## Installation de Renovate

1. Visitez [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. Cliquez sur **Installer**
3. Sélectionnez les dépôts à activer (tous ou spécifiques)
4. Terminez l'autorisation

## Fichier de configuration

Créez `renovate.json` à la racine du dépôt :

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Commit et push :

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## Détails de la configuration

| Option | Description |
|--------|-------------|
| `config:recommended` | Configuration de base recommandée officiellement par Renovate |
| `:automergeAll` | **Option clé** — fusion automatique de toutes les mises à jour (y compris les versions majeures) |
| `:disableDependencyDashboard` | Désactiver le tableau de bord des problèmes pour un fonctionnement en arrière-plan |
| `timezone` | Définir le fuseau horaire sur Asie/Shanghai |
| `schedule` | Exécuter les vérifications avant 3h00 du matin quotidiennement |

## Workflow

```
3h00 du matin quotidiennement
    ↓
Renovate vérifie les dépendances de package.json
    ↓
Mises à jour disponibles détectées
    ↓
Création automatique de Pull Request
    ↓
Déclenchement des vérifications CI
    ↓
CI réussi → Fusion automatique vers la branche main
    ↓
Voir les dépendances mises à jour le lendemain matin
```

## Configuration multi-dépôts

Pour plusieurs projets, copiez le même fichier de configuration :

```bash
# Créer une configuration universelle
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# Appliquer à plusieurs dépôts
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## FAQ

### La PR ne fusionne pas automatiquement ?

Vérifiez l'état des CI. Renovate ne fusionne qu'après le passage de toutes les vérifications CI. Si CI échoue, corrigez manuellement le problème et relancez.

### Comment déclencher immédiatement les mises à jour ?

- Si le tableau de bord est activé : Allez dans Issues → Dependency Dashboard → Cochez les paquets à mettre à jour → Cliquez sur Rebase
- Ou attendez l'heure programmée pour l'exécution automatique

### Comment exclure des dépendances spécifiques ?

Ajoutez des règles d'exclusion dans la configuration :

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### Support de pnpm / yarn / npm ?

Renovate détecte automatiquement les types de fichiers de verrouillage, aucune configuration supplémentaire nécessaire.

## Vérification

Après avoir poussé la configuration, Renovate s'exécutera automatiquement (ou attendra l'heure programmée). Étapes de vérification :

1. Allez sur la page **Pull requests** du dépôt
2. Affichez les PR créées par Renovate (format du titre : `chore(deps): update ...`)
3. Confirmez que la fusion automatique est activée pour la PR
4. Fusion automatique après passage des CI

## Résumé

Seulement 5 lignes de configuration principale :

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Réalisez une gestion entièrement automatisée des dépendances, permettant aux développeurs de se concentrer sur le code métier.
