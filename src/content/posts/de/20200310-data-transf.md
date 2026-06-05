---
title: "Eine erzwungene Datenmigration"
description: "Achten Sie auf den Schutz der Privatsphäre, Daten sollten mehrfach gesichert werden und Konten sollten die Zwei-Faktor-Authentifizierung aktivieren"
category: "life"
tags:
  - "roam"
pubDate: 2020-03-10
heroImage: "https://cos.zbz.ai/images/202310181512073.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "de"
---

###

### Ereigniswiederherstellung

Am 18. Februar erhielt ich eine Benachrichtigung von Taoluyun, dass das Passwort des Serverkontos gefährdet sei und so schnell wie möglich geändert werden sollte. Da das Konto über eine SMS-Verifizierung verfügt und nach Wiederaufnahme der Arbeit viele Dinge zu erledigen waren, nahm ich mir die Benachrichtigung nicht zu Herzen.

Als ich mich am 7. März darauf vorbereitete, den Artikel zu aktualisieren, stellte ich fest, dass der Server von Taoluyun gesperrt worden war. Ich fragte nach dem Grund und mir wurde gesagt, dass die Zahlungsmethode des Kontos gefährdet sei. Ich musste meinen Personalausweis, die gebundene Bankkarte und den Kontoauszug des letzten Monats vorlegen, bevor ich versuchen konnte, ihn zu entsperren. Gleichzeitig stellte ich bei der Überprüfung der Rechnung fest, dass für das monatliche Abonnement ECS in diesem Monat 2 Dollar zur Zahlung ausstanden.

Taoluyun International unterstützt keine Bankkarten vom Festland und Zahlungen von Drittanbietern. Zu diesem Zeitpunkt konnte ich nur US-Paypal zum Kauf verwenden. Um Diebstahl zu verhindern, hatte ich nach dem Kauf eines ECS-Zyklus bereits die Bindung von PP und Taoluyun sowie die Verbindung zwischen PP und der Bankkarte aufgehoben. Um die Entsperrung des Servers und die Bezahlung der Rechnung abzuschließen, muss ich PayPal und Taoluyun erneut binden. Nach vielen Versuchen, die Bindung erneut herzustellen, meldet PP immer „Vorab genehmigte Zahlung kann vorübergehend nicht eingerichtet werden“. Als ich danach googelte, stellte sich heraus, dass viele Leute auf das gleiche Problem stoßen würden. PP Official hat eine Risikokontrolle für das Konto implementiert. Ob es gebunden werden kann, hängt vom Schicksal ab.

Nach mehreren fehlgeschlagenen Versuchen musste ich einen neuen Server bei Liangxinyun kaufen und neu aufbauen. Dank der üblichen Datensicherung dauerte die manuelle Wiederherstellung 3 Stunden. Während des Datenwiederherstellungsprozesses erhielten einige Freunde, die diese Website abonniert hatten, eine große Anzahl von RSS-Pushes mit alten Inhalten. Bitte verzeihen Sie mir die Unannehmlichkeiten, die Ihnen entstanden sind. Was das gesperrte Taoluyun und die Rechnung betrifft, kann ich mir nur andere Wege überlegen, um das Problem zu lösen.

### Lektion

**Daten benötigen mehrere Backups** Egal, ob es sich um eine Cloud-Netzwerkfestplatte, einen Server oder eine lokale Festplatte handelt, es besteht die Möglichkeit eines Datenverlusts. Wichtige Daten sollten an mindestens drei verschiedenen Orten gesichert werden. Achten Sie besonders darauf, dass Sie bei einer lokalen Sicherung keine SSD-Solid-State-Laufwerke verwenden. Daten von Solid-State-Laufwerken können nach einem Verlust nicht wiederhergestellt werden. Sie können mechanische Festplatten oder optische Datenträger verwenden. Überprüfen Sie bei der Verwendung von Cloud-Netzwerkfestplatten hauptsächlich offizielle Ankündigungen. Da es für Cloud-Netzwerkfestplatten schwierig ist, Gewinne zu erzielen, können einige Dienstanbieter ihre Dienste jederzeit einstellen. Laden Sie Ihre Daten daher rechtzeitig herunter und übertragen Sie sie. Die gewissenhaftesten Netzwerkfestplatten sind meiner Meinung nach derzeit He Caiyun und Jianguoyun von China Mobile. Jianguoyun kann für die übliche Synchronisierung verwendet werden, und He Caiyun wird für die Datenspeicherung verwendet. Für Fotoalben können Sie Google Fotos verwenden.

**Konten müssen die Zwei-Faktor-Authentifizierung aktivieren** Alle Arten von Konten sollten die Zwei-Faktor-Authentifizierung aktivieren. Im Allgemeinen gibt es zwei Arten der Zwei-Faktor-Authentifizierung: SMS und Authentifikator-MFA. Wenn Sie die SMS-Verifizierung verwenden, sollten Sie sich über das Betriebsgebiet des Dienstanbieters im Klaren sein. Einige Nachrichten von Dienstanbietern unterstützen keine +86-Mobiltelefonnummern. Sie können auch eine Google Voice registrieren, um Verifizierungsnachrichten von Dienstanbietern zu erhalten. Es gibt viele Authentifikatoren, und es wird empfohlen, den Authenticator von Microsoft zu verwenden, der von einem großen Hersteller hergestellt wird und die Kontosynchronisierung und -wiederherstellung unterstützt. Bei Verwendung des Authentifikators muss für die erste Verifizierung die QR-Code-Methode verwendet werden, und der QR-Code muss dauerhaft aufbewahrt werden. Dieser QR-Code ist dauerhaft gültig. Wenn das Telefon verloren geht oder der Authentifikator neu installiert wird, kann er wieder verwendet werden. Es wird nicht empfohlen, Authy zu verwenden. Obwohl es auch Backups unterstützt, ist bei der erneuten Anmeldung eine SMS-Verifizierung erforderlich, und manchmal können +86-Mobiltelefone den Verifizierungscode nicht empfangen.
