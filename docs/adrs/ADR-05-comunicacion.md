# ADR-05 Llamadas locales síncronas y notificación posterior al commit

Estado: adoptado para el diseño del Entregable 2. Responsable: Juan José Alzate Rojas. Fecha: 27 de octubre de 2026.

## Contexto
Validar un cierre, impedir la autoeliminación por toque y liquidar puntos requieren un resultado coherente inmediato. La comunicación con los jugadores puede fallar después del commit. WebSocket es el canal de sincronización requerido; no proporciona por sí solo autorización, orden de negocio o entrega durante desconexiones.

## Decisión
Usar llamadas locales mediante interfaces en el camino crítico: coordinador, registro, estrategia y unidad de trabajo. Guardar estado, resultado, movimientos, respuesta de operación y evento de outbox en una misma transacción. Un despachador desacoplado procesa la outbox después del commit. La implementación del publicador WebSocket enviará vistas autorizadas, autenticará suscripciones y repondrá una instantánea al reconectar. No se utilizará polling ni long polling de estado en los clientes.

## Alternativas y fundamento
Eventos locales volátiles para toda la liquidación desacoplan llamadas, pero complican orden, errores y recuperación; una caída puede perder el aviso. Eventos durables de cada subpaso añaden coordinación innecesaria para una transacción local. Llamadas síncronas para enviar por red dentro de la transacción prolongan el bloqueo y mezclan disponibilidad del cliente con consistencia del marcador. La solución mixta concentra invariantes y desacopla solo la notificación.

## Consecuencias
Entrega al menos una vez: un fallo después del envío y antes de marcar entrega puede producir duplicados. El cliente deduplica por eventId y aplica versiones de forma monótona; un salto pide una instantánea por WebSocket. operationId identifica reintentos y un fingerprint rechaza su reutilización con otro contenido. La outbox tiene costo de almacenamiento y requiere reintentos con límite de frecuencia, observabilidad y limpieza. Un worker puede consultar la outbox en el servidor; eso no constituye polling del juego desde el cliente.

## Compliance
Las pruebas de aplicación comprueban un solo resultado ante reintento, rechazo de versión antigua y de cambio de payload, no revelación ante toque rechazado, rollback y retención del evento si el publicador falla. La prueba PostgreSQL verifica la atomicidad real. El adaptador WebSocket y los ensayos con seis dispositivos son trabajo de integración del MVP: se verificará privacidad, reconexión y las metas p95 del Entregable 1. No se declaran como mediciones realizadas por esta base de código.

## Notas e historial
Integra y amplía el antecedente E1-ADR-03 sobre WebSockets, conservado en docs/history/E1-ADR-03-websockets.md. En el Entregable 2, ADR-03 se reserva para estilo y extensibilidad por exigencia de la guía. La comunicación interna y el transporte hacia clientes son decisiones relacionadas, pero distintas.
