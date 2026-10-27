# ADR-03 Sincronización mediante WebSockets

Antecedente conservado del Entregable 1. Su estado corresponde al momento del primer informe.

Estado. WebSockets seleccionado para la comunicación del MVP.

Contexto. Cada jugador usa su dispositivo y necesita ver las jugadas de los demás en cuanto se procesan. El prototipo consulta el estado periódicamente. El MVP reemplazará esas consultas por una conexión WebSocket para enviar actualizaciones directamente a los jugadores.

Decisión. Mantener una conexión WebSocket autenticada por dispositivo para comandos, confirmaciones y eventos. El servidor autoritativo conserva la única versión válida de la partida. C6 registra estado y evento pendiente en un mismo commit; C7 difunde vistas preparadas por C5. Recuperar una instantánea al reconectar o detectar versiones faltantes. No implementar polling ni long polling como alternativa.

Alternativas y justificación. Polling y long polling requieren consultas o solicitudes repetidas. Server-Sent Events envía información del servidor al cliente y necesita otro canal para las acciones del jugador. WebSockets permite enviar acciones y recibir resultados por la misma conexión, por lo que se selecciona para el MVP.

Consecuencias positivas. Los participantes conectados reciben la jugada sin esperar un intervalo de consulta. Los comandos conservan las mismas invariantes e idempotencia del dominio. El canal puede comunicar errores, estado de sala, turnos y liquidación con contratos versionados.

Consecuencias negativas. Es necesario mantener conexiones, limitar colas, autenticar suscripciones, recuperar sesiones y controlar duplicados. WebSocket no resuelve por sí mismo la entrega durante caídas. La outbox aumenta persistencia y operación; el sistema debe monitorizar retraso y pendientes. Un despliegue con varias instancias requerirá distribución entre nodos y un ADR de escalado.

Cumplimiento / Compliance. RF-24–27 y PA-15–16; seis clientes reciben un descarte; no se revelan cartas robadas de otro jugador; no hay peticiones periódicas de estado en la red. Simular caída después del commit, reconexión y mensaje duplicado: se recupera la vista sin repetir puntaje. Medir CA-03 en emisor y receptores; verificar cola acotada y rechazo de una suscripción ajena.

Notas. Drivers: Responsiveness, Data consistency y Security. C7 usa los servicios de C5 y C6. Las reglas de cartas y puntajes permanecen separadas de la comunicación por WebSockets.
