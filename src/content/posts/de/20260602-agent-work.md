---
title: "Mein Workflow für die Zusammenarbeit mit KI"
description: "Wie ich ChatGPT, Codex, Pulse und deep research von OpenAI für Projektangebote und Softwareentwicklung nutze"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "Mein Workflow für die Zusammenarbeit mit KI"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: de
---

Ich nutze ChatGPT seit 2023, zuerst als normaler Nutzer, dann als zahlender Nutzer, schließlich von Plus bis Pro. Als Gemini in der zweiten Hälfte des Jahres 2025 plötzlich stark wurde, wechselte ich für kurze Zeit zu Gemini. Nach der Veröffentlichung von GPT-5.5 kehrte ich in das OpenAI-Ökosystem zurück. Dafür gibt es zwei Hauptgründe. Erstens liegt GPT-5.5 bei den Fähigkeiten des großen Modells weiterhin deutlich vor anderen Modellen. Benchmark-Wettbewerbe zwischen großen Modellen bedeuten für normale Nutzer nicht allzu viel. Normale Nutzer wollen echte Produktivität. GPT hat inzwischen tatsächlich ein Produktivitätsniveau erreicht, mit dem sich lieferbare Ergebnisse erstellen lassen. Zweitens hat OpenAI sehr viel Produktarbeit geleistet. Codex, Pulse und deep research senken jeweils die Einstiegshürde für Nutzer.

Derzeit nutze ich OpenAI-Produkte vor allem für zwei Arten von Arbeit: Projektangebote und Programmierung. Mein grober Ablauf für Projektangebote sieht so aus: Mit Feishu Minutes/Lark Minutes verwandle ich Audioaufnahmen aus Vor-Ort-Recherchen und Kundengesprächen in Besprechungsnotizen. Die geprüften Besprechungsnotizen und weitere Projektunterlagen gebe ich an ChatGPT. Mit deep research lasse ich ChatGPT einen ersten Entwurf des Angebots erstellen. Danach exportiere ich eine Word-Version zur Prüfung und Überarbeitung. Zum Schluss nutze ich Codex, um das Textformat anzupassen. Wenn zusätzlich ein PowerPoint gebraucht wird, verwende ich weiterhin das presentations-Plugin von Codex, um das PPT zu erstellen. Natürlich ist das mit presentations erstellte PPT nicht perfekt. Einige Open-Source-PowerPoint-skills auf GitHub können zur Verbesserung genutzt werden.

Für Bugfixes und Funktionsanpassungen ist Codex vollständig ausreichend. Wenn jedoch ein vollständiges großes System von Grund auf entwickelt werden soll, steht Codex noch vor vielen Herausforderungen, besonders wegen der Gefahr, dass der Prozess außer Kontrolle gerät. In dieser Situation ist es am wichtigsten, klare Grenzen zu setzen: Technologie-Stack, Funktionsumfang und weitere Begrenzungen. Bei einem neuen Projekt sollten zuerst zwei Dateien bestätigt werden: `AGENTS.md` und `DESIGN.md`. `AGENTS.md` begrenzt den Technologie-Stack, die Engineering-Regeln und den Ausführungsrahmen. `DESIGN.md` begrenzt Farben, Schriften, Komponentenstil und andere visuelle Regeln. Der zweite Schritt ist die Wahl des Technologie-Stacks. Man sollte Stacks wählen, die KI gut verwenden kann, etwa React + TypeScript, und nicht vorrangig Stacks, die Menschen gut beherrschen, etwa Java.

KI hat den Arbeitsrhythmus verändert, und die gesundheitliche Frage darf nicht ignoriert werden. AI Agents können die Arbeitseffizienz tatsächlich stark erhöhen. Wenn eine Ihrer Aufgaben noch nicht abgeschlossen ist, erledigt der Agent seinen Teil schnell und schiebt Sie weiter voran. Dadurch müssen Sie immer weiterarbeiten. Das ist intensive Arbeit ohne echten Raum zum Abschweifen. Das Gehirn läuft ununterbrochen, und auf Dauer ist das sehr ermüdend. Deshalb brauchen Sie eine externe Methode, um sich selbst zum Anhalten zu bringen. Die beste Methode ist die Pomodoro-Technik: 25 Minuten arbeiten, 5 Minuten ruhen und dem Gehirn Entspannung geben. Wenn die Zusammenarbeit mit dem Agenten gut funktioniert, können Sie sich selbstverständlich ausruhen, während der Agent arbeitet.
