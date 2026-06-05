---
title: "Una migración de datos forzada"
description: "Preste atención a la protección de la privacidad, los datos deben tener múltiples copias de seguridad y las cuentas deben habilitar la autenticación de dos factores"
category: "life"
tags:
  - "roam"
pubDate: 2020-03-10
heroImage: "https://cos.zbz.ai/images/202310181512073.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "es"
---

###

### Restauración de eventos

El 18 de febrero, recibí una notificación de Taoluyun diciendo que la contraseña de la cuenta del servidor estaba en riesgo y debía cambiarse lo antes posible. Debido a que la cuenta tiene verificación por SMS, además de que había muchas cosas que hacer después de reanudar el trabajo, no me tomé la notificación en serio.

El 7 de marzo, cuando me preparaba para actualizar el artículo, descubrí que el servidor había sido bloqueado por Taoluyun. Pregunté el motivo y me dijeron que el método de pago de la cuenta estaba en riesgo. Necesitaba proporcionar mi tarjeta de identificación, la tarjeta bancaria vinculada y el estado de cuenta del último mes antes de intentar desbloquearlo. Al mismo tiempo, al revisar la factura, descubrí que la suscripción mensual ECS tenía 2 dólares pendientes de pago este mes.

Taoluyun International no admite tarjetas bancarias continentales ni pagos de terceros. En ese momento, solo podía usar Paypal de EE. UU. para comprar. Para evitar robos, después de comprar un ciclo de ECS, ya había desvinculado PP y Taoluyun, y la asociación entre PP y la tarjeta bancaria. Ahora, para completar el desbloqueo del servidor y pagar la factura, debo vincular PayPal y Taoluyun nuevamente. Después de muchos intentos de volver a vincular, PP siempre indica "No se puede configurar el pago preaprobado temporalmente". Lo busqué en Google, resultó que muchas personas encontrarían el mismo problema. El oficial de PP implementó el control de riesgos en la cuenta. Si se puede vincular depende del destino.

Después de varios intentos fallidos, tuve que comprar un nuevo servidor en Liangxinyun y reconstruirlo. Gracias a la copia de seguridad de datos habitual, tardé 3 horas en restaurarlo manualmente. Durante el proceso de recuperación de datos, algunos amigos que se suscribieron a este sitio recibieron una gran cantidad de envíos RSS de contenido antiguo. Por favor, perdónenme por las molestias causadas. En cuanto al Taoluyun bloqueado y la factura, solo puedo pensar en otras formas de resolverlo.

### Lección

**Los datos necesitan múltiples copias de seguridad** No importa si se trata de un disco de red en la nube, un servidor o un disco duro local, existe la posibilidad de pérdida de datos. Los datos importantes deben tener una copia de seguridad en al menos tres ubicaciones diferentes. Preste especial atención a que si realiza una copia de seguridad localmente, no utilice unidades de estado sólido SSD. Los datos de la unidad de estado sólido no se pueden recuperar después de la pérdida. Puede utilizar discos duros mecánicos o discos ópticos. Al utilizar discos de red en la nube, consulte principalmente los anuncios oficiales. Debido a que es difícil para los discos de red en la nube obtener ganancias, algunos proveedores de servicios pueden detener los servicios en cualquier momento, así que descargue y transfiera sus datos a tiempo. En la actualidad, los discos de red más concienzudos, personalmente creo que son He Caiyun y Jianguoyun de China Mobile. Jianguoyun se puede utilizar para la sincronización habitual, y He Caiyun se utiliza para el almacenamiento de datos. Para álbumes de fotos, puede utilizar Google Photos.

**Las cuentas deben habilitar la autenticación de dos factores** Todo tipo de cuentas deben habilitar la autenticación de dos factores. Generalmente, la autenticación de dos factores tiene dos tipos: SMS y autenticador MFA. Al utilizar la verificación por SMS, tenga claro el área de operación del proveedor de servicios. Algunos mensajes de proveedores de servicios no admiten números de teléfono móvil +86. También puede registrar un Google Voice para recibir mensajes de verificación del proveedor de servicios. Hay muchos autenticadores, y se recomienda utilizar Authenticator de Microsoft, que es producido por un gran fabricante y admite la sincronización y recuperación de cuentas. Al utilizar el autenticador, se debe utilizar el método del código QR para la primera verificación, y el código QR se debe conservar permanentemente. Este código QR es válido permanentemente. Cuando se pierde el teléfono o se reinstala el autenticador, se puede volver a utilizar. No se recomienda utilizar Authy. Aunque también admite copias de seguridad, al iniciar sesión nuevamente, se requiere verificación por SMS y, a veces, los teléfonos móviles +86 no pueden recibir el código de verificación.
