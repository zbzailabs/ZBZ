---
title: "Un viaje de plagio de una piel de Baidu imitada"
description: "Como método de entrada personal, no reinvente la rueda. Copie (plagie/tome prestado) los archivos fuente de la piel del método de entrada existentes y desarrolle en el menor tiempo posible."
category: "life"
tags:
  - "roam"
pubDate: 2021-05-18
heroImage: "https://cos.zbz.ai/images/202310181257285.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "es"
---

Piel del método de entrada Baidu para macOS, estilo minimalista, altamente personalizable.

## Características de la piel

1. Adecuado para el método de entrada Baidu para Mac.
2. Perfectamente adaptado a macOS Monterey.
3. Estilo minimalista, concéntrese en la entrada.
4. Resalte la primera opción, concéntrese más en la selección de palabras.
5. Altamente personalizable, se puede personalizar según las necesidades.

## Registro de actualizaciones

### `V1.1` 2021-11-05

1. Reglas de nomenclatura de archivos unificadas.
2. Se agregaron comentarios para una fácil personalización.
3. Se eliminó el icono de cambio de página a la derecha, lo que hace que todo sea más simple.
4. Se agregó el archivo `global.ini`.
5. Se agregó piel de grafito.
6. Se actualizaron los ejemplos de piel.

### `V1.0` 2021-05-18

1. Piel lanzada.

## Instrucciones de uso

1. Cuando no haya necesidades especiales, puede descargar directamente el paquete de piel en formato `.bdskk` en la carpeta `examples` y hacer doble clic para instalar y usar.
2. Si se requiere personalización, el archivo se puede modificar.
3. Comprima el contenido de la carpeta de recursos de la piel en un paquete comprimido en formato `.zip`, no comprima toda la carpeta.
4. Modifique el paquete comprimido a un paquete de piel en formato `.bdskk`.
5. Haga doble clic en el paquete de instalación para importarlo al método de entrada Baidu.

## Estructura de archivos

```json
└── src
    ├── global.ini
    ├── horizontal.ini
    ├── single.ini
    ├── statusbar.ini
    └── *.png
└── examples
└── README.md
└── LICENSE
```

1. `src`: Carpeta de recursos.

2. `globe.ini`: Archivo de definición global, puede definir el nombre de la piel, el tipo de piel, la descripción de la piel, la identificación del autor, el correo electrónico, el sitio web, etc. La información relevante se mostrará en la página de configuración de apariencia del método de entrada Baidu Mac.

3. `horizontal.ini`: Archivo de configuración del modo de doble línea. La piel de doble línea se refiere al modo que muestra códigos de entrada y palabras candidatas al mismo tiempo.

   **Área de entrada y área de palabras candidatas**: Encuadre el rango de la imagen de fondo del modo de doble línea, como se muestra en la figura. El principio de configuración de cada parámetro en las dos áreas es el mismo.

   **Área de nueve cuadrados**: El fondo de la barra de candidatos se adapta a diferentes longitudes de palabras candidatas en una forma de expansión de nueve cuadrados. Los cuatro parámetros X / Y / Ancho / Alto definen el área verde en la figura a continuación, que es el palacio central de la cuadrícula de nueve cuadrados.

   **Margen de contenido**: La distancia entre el código de entrada y el borde del corte de fondo. Aproximadamente

   **Fuente y color**: El color de la fuente y las palabras candidatas utiliza el formato RGB hexadecimal. Los elementos a los que se refiere cada campo se muestran en la figura a continuación:

   **Símbolo de intervalo**: Establezca el símbolo de intervalo entre el número de serie digital y la palabra candidata. El espacio es ESPACIO (mayúsculas) y otros caracteres se ingresan directamente.

4. `single.ini`: Archivo de configuración del modo de una sola línea. La piel de una sola línea se refiere al modo que solo muestra palabras candidatas, que se ve más limpio y simple en Mac. El modo de una sola línea solo necesita configurar los parámetros del área de palabras candidatas. El principio de que la configuración de parámetros surta efecto es el mismo que el de la piel de doble línea.

5. `statusbar.ini`: Archivo de configuración de la barra de estado. Los iconos de la barra de estado se pueden organizar en cualquier lugar de la imagen de fondo de la barra de estado, solo necesita configurar sus coordenadas horizontales y verticales. Todos los valores de coordenadas se basan en la esquina superior izquierda.

6. `*.png`: Archivo de corte de piel, puede reemplazar el archivo correspondiente con su propio corte.

7. `examples`: Pieles de ejemplo, se pueden descargar y usar directamente.

8. `README.md`: Archivo léame del proyecto.

9. `LICENSE`: Este proyecto sigue la [licencia MIT](https://github.com/xiyizhou/BaiduIM-Skin/blob/main/LICENSE). Puede usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y vender el software y copias del software, y también puede modificar los términos de la licencia al contenido apropiado según las necesidades del programa.

## Contribución

Si tiene alguna pregunta, duda o sugerencia, no dude en preguntar.

Este conjunto de pieles todavía tiene los siguientes problemas por resolver. Debido a que no entiendo el código del programa del método de entrada Baidu, este desarrollador no puede implementarlo en poco tiempo. Si tiene una forma de implementarlo, puede contribuir.

- [ ] Perfeccionar la barra de estado y la piel de doble línea.

- [ ] Centrado vertical de la fuente del área candidata y el color de fondo.

- [ ] Puede personalizar el glifo, el tamaño de fuente y el color del número de serie digital de la palabra candidata para lograr un efecto de visualización similar al método de entrada incorporado de Mac para resaltar las palabras candidatas.

- [ ] El formato de piel actual es `.bdskk`, es necesario cambiar al formato de piel predeterminado del método de entrada Baidu Mac `.bpsm`.

- [ ] Desarrollar pieles para iPhone y iPad similares a las pieles que pueden personalizar el color de fondo de la palabra preferida.
