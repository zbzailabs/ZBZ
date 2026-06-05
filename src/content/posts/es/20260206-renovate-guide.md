---
title: "Guía de actualización automática de dependencias con Renovate"
description: "Usar Renovate para automatizar completamente las actualizaciones de dependencias de repositorios GitHub sin intervención manual"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Actualización automática de dependencias con Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: es
---

## Introducción

Mantener las dependencias del proyecto es parte del trabajo diario de los desarrolladores. Verificar, actualizar y probar manualmente las versiones de las dependencias no solo consume tiempo, sino que también es propenso a omisiones. Este artículo explica cómo usar **Renovate** para lograr actualizaciones de dependencias completamente automatizadas.

## Objetivos

- Verificar automáticamente las actualizaciones de dependencias todos los días al amanecer
- Crear PR automáticamente y fusionarlas (después de pasar CI)
- Sin intervención manual, funcionando en segundo plano
- Gestión unificada en múltiples repositorios

## Instalación de Renovate

1. Visite [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. Haga clic en **Instalar**
3. Seleccione los repositorios para habilitar (todos o específicos)
4. Complete la autorización

## Archivo de configuración

Cree `renovate.json` en la raíz del repositorio:

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

Commit y push:

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## Detalles de la configuración

| Opción | Descripción |
|--------|-------------|
| `config:recommended` | Configuración base recomendada oficialmente por Renovate |
| `:automergeAll` | **Opción clave** — fusión automática de todas las actualizaciones (incluyendo versiones mayores) |
| `:disableDependencyDashboard` | Desactivar el panel de control de problemas para funcionamiento en segundo plano |
| `timezone` | Establecer la zona horaria en Asia/Shanghai |
| `schedule` | Ejecutar verificaciones antes de las 3:00 AM diariamente |

## Flujo de trabajo

```
3:00 AM diariamente
    ↓
Renovate verifica las dependencias de package.json
    ↓
Actualizaciones disponibles detectadas
    ↓
Creación automática de Pull Request
    ↓
Activación de verificaciones CI
    ↓
CI pasa → Fusión automática a la rama main
    ↓
Ver dependencias actualizadas a la mañana siguiente
```

## Configuración multi-repositorio

Para múltiples proyectos, copie el mismo archivo de configuración:

```bash
# Crear configuración universal
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# Aplicar a múltiples repositorios
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## Preguntas frecuentes

### ¿La PR no se fusiona automáticamente?

Verifique el estado de CI. Renovate solo fusiona después de que todas las verificaciones de CI pasen. Si CI falla, corrija manualmente el problema y vuelva a ejecutar.

### ¿Cómo activar actualizaciones inmediatamente?

- Si el panel de control está habilitado: Vaya a Issues → Dependency Dashboard → Marque los paquetes para actualizar → Haga clic en Rebase
- O espere el tiempo programado para la ejecución automática

### ¿Cómo excluir dependencias específicas?

Agregue reglas de exclusión en la configuración:

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### ¿Soporte de pnpm / yarn / npm?

Renovate detecta automáticamente los tipos de archivos de bloqueo, no se necesita configuración adicional.

## Verificación

Después de enviar la configuración, Renovate se ejecutará automáticamente (o esperará el tiempo programado). Pasos de verificación:

1. Vaya a la página **Pull requests** del repositorio
2. Ver las PR creadas por Renovate (formato del título: `chore(deps): update ...`)
3. Confirmar que la fusión automática está habilitada para la PR
4. Fusión automática después de pasar CI

## Resumen

Solo 5 líneas de configuración principal:

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

Logre una gestión completamente automatizada de dependencias, permitiendo que los desarrolladores se enfoquen en el código de negocio.
