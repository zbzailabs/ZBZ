---
title: "Configuración multidispositivo del método de entrada Rime"
description: "Recientemente, el Ministerio de Industria y Tecnología de la Información publicó datos que muestran que casi todos los métodos de entrada en la nube convencionales están recopilando datos de privacidad del usuario en violación de las regulaciones. Para ingresar de manera segura, solo se pueden usar métodos de entrada fuera de línea. El mejor método de entrada fuera de línea actualmente es, sin duda, Rime."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "es"
---

Recientemente, el Ministerio de Industria y Tecnología de la Información publicó datos que muestran que casi todos los métodos de entrada en la nube convencionales están recopilando datos de privacidad del usuario en violación de las regulaciones. Para ingresar de manera segura, solo se pueden usar métodos de entrada fuera de línea. El mejor método de entrada fuera de línea actualmente es, sin duda, [Rime](https://github.com/rime/home/wiki/Introduction).

Hablando con precisión, Rime es un motor de método de entrada multiplataforma de código abierto. El código es de código abierto y completamente fuera de línea. A través de una personalización y ajuste extremos, los usuarios pueden personalizar un método de entrada que se adapte a todos. La ventaja es la seguridad y el soporte para múltiples esquemas de entrada; la desventaja es que el tesauro no es lo suficientemente fuerte, la configuración es compleja y la sincronización del tesauro debe hacerse de forma semimanual.

### Instalación de la versión para Mac

La versión en chino tradicional desarrollada originalmente por [Lotem](https://github.com/lotem), el autor de Rime. Si desea utilizar la versión simplificada, puede configurarla de acuerdo con el tutorial de [Yifang](https://github.com/maomiui/rime). Tenga en cuenta lo siguiente durante el proceso de configuración:

- Hay un EZBZOR en la versión actual (2021-05-12). Si está habilitado en `luna_pinyin_simp.custom.yaml`
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  Después del sonido difuso, Emoji y el tiempo dinámico se vuelven inválidos.

- El autor ha preparado una variedad de esquemas de entrada. Si no usa Xiaohe Shuangpin, etc., puede eliminar los archivos de configuración correspondientes.

- Incluso si no usa Luna Pinyin tradicional, no elimine archivos como `luna_pinyin.zonghe.dict.yaml` y `luna_pinyin.dict.yaml`. La eliminación puede causar falta de palabras necesarias.

- La información común, como el correo electrónico y la dirección, se puede configurar en `custom_phrase.txt`.

- Puede modificar y cambiar el tema en el archivo `squirrel.custom.yaml`. Por ejemplo, basado en el tema `macos_light`, el autor imitó un tema "Pink World" del método de entrada Google Pinyin.

### Instalación de la versión Win10

Para la versión Win10 de Rime Weasel, simplemente siga el [tutorial oficial](https://github.com/rime/weasel) para instalar. Una vez completada la instalación, puede copiar el archivo de configuración de Mac para su uso. Necesita prestar atención a

- Necesita nombrar `squirrel.custom.yaml` como `weasel.custom.yaml`

- Las líneas simples y dobles de la piel, la visualización de una sola línea Pinyin, etc. se personalizan en `weasel.custom.yaml` de la siguiente manera:

  ```yaml
  # Disposición horizontal del texto
  style/horizontal: true

  # Visualización de una sola línea
  style/inline_preedit: true

  # Cambiar piel
  style/color_scheme: win10
  ```

- La ruta de sincronización en `installation.yaml` es diferente para Win y Mac. No se requieren comillas simples o dobles en Win.

  ```yaml
  # formato de ruta de sincronización de win
  sync_dir: C:\Users\Nombredeusuario\iCloudDrive\Rime

  # formato de ruta de sincronización de mac
  sync_dir: "/Users/Nombredeusuario/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- En win10, puede usar el programador de tareas de win10 para sincronizar [automáticamente](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html) los datos. Todavía no hay forma de lograr la sincronización automática en Mac.

Para teléfonos Android, puede instalar y usar [Trime](https://github.com/osfans/trime), y para teléfonos iOS, puede instalar y usar [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977).
