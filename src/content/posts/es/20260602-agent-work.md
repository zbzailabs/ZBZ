---
title: "Mi flujo de trabajo colaborativo con IA"
description: "Cómo uso ChatGPT, Codex, Pulse y deep research de OpenAI para propuestas de proyecto y desarrollo de software"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "Mi flujo de trabajo colaborativo con IA"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: es
---

Uso ChatGPT desde 2023. Pasé de usuario normal a usuario de pago, y luego de Plus a Pro. En la segunda mitad de 2025, cuando Gemini ganó fuerza de forma repentina, cambié brevemente de plataforma y usé Gemini. Con el lanzamiento de GPT-5.5, volví al ecosistema de OpenAI. Las razones principales son dos. Primero, la capacidad del modelo GPT-5.5 sigue estando muy por delante de otros modelos. Las competiciones de puntuaciones entre grandes modelos no tienen demasiado significado para los usuarios comunes. Lo que un usuario común necesita es productividad real. GPT ya ha alcanzado un nivel de productividad capaz de generar entregables. Segundo, OpenAI ha trabajado mucho en convertir sus modelos en productos. Codex, Pulse y deep research reducen cada uno la barrera de uso.

Actualmente uso los productos de OpenAI principalmente para dos tipos de trabajo: propuestas de proyecto y programación. El proceso general para hacer propuestas de proyecto es este: uso Feishu Minutes/Lark Minutes para convertir en actas de reunión los audios de investigación en sitio y comunicación con clientes; envío a ChatGPT las actas revisadas y otros materiales del proyecto; uso deep research para que ChatGPT produzca un primer borrador; exporto una versión Word para revisión y corrección; por último, uso Codex para ajustar el formato del texto. Si también hay que preparar un PowerPoint, sigo usando el plugin presentations de Codex para crear el PPT. Por supuesto, el PPT hecho con presentations no es perfecto, y se puede mejorar con algunos skills de PowerPoint open source en GitHub.

Para corregir bugs y ajustar funcionalidades, Codex cumple completamente. Si se quiere desarrollar desde cero un sistema grande y completo, Codex todavía afronta muchos retos, especialmente el riesgo de perder el control. En ese momento, lo más importante es imponer límites claros: pila técnica, alcance funcional y otros bordes del proyecto. Para inicializar un proyecto, primero hay que confirmar dos archivos: `AGENTS.md` y `DESIGN.md`. `AGENTS.md` se usa para limitar la pila técnica, las normas de ingeniería y el alcance de ejecución; `DESIGN.md` se usa para limitar colores, tipografía, estilo de componentes y otras reglas visuales. El segundo paso es elegir la pila técnica. Conviene elegir tecnologías que la IA maneja bien, como React + TypeScript, en lugar de tecnologías que los humanos pueden dominar mejor, como Java.

El cambio que la IA ha traído al ritmo de trabajo plantea un problema de salud que no se puede ignorar. Los agentes de IA aumentan mucho la eficiencia. Si una tarea tuya no está terminada, el agente completa rápido su parte y te empuja a seguir avanzando, lo que puede obligarte a trabajar sin parar. Es trabajo intenso, sin espacio real para distraerse. El cerebro sigue funcionando continuamente, y con el tiempo resulta muy agotador. Por eso necesitas una forma externa de obligarte a parar. La mejor es la técnica Pomodoro: trabajar 25 minutos, descansar 5 minutos y darle al cerebro una pausa. Naturalmente, si coordinas bien el trabajo con el agente, puedes descansar mientras el agente trabaja.
