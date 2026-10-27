# ADR-04 Persistencia relacional centralizada en PostgreSQL

Estado: adoptado para el diseño del Entregable 2. Responsable: Juan José Alzate Rojas. Fecha: 27 de octubre de 2026.

## Contexto
Una partida acumula rondas, participantes y movimientos. Un cierre aceptado debe registrar juntos acta, penalizaciones, versión, respuesta idempotente y evento pendiente. Dos copias de una carta pueden tener el mismo palo y rango si pertenecen a mazos distintos; una misma copia solo ocupa una ubicación por ronda.

## Decisión
Una instancia PostgreSQL 18 centralizada, accesible desde el adaptador de persistencia del servidor. Modelo relacional en 3FN para datos autoritativos; PK/FK compuestas mantienen pertenencia a partida. El puntaje se deriva de score_movement mediante current_score. processed_operation.response guarda una respuesta JSON de transporte para repetirla, no un documento autoritativo del juego. outbox contiene metadatos de eventos, sin manos privadas.

## Alternativas
SQLite facilita ejecutar un solo proceso, pero limita la concurrencia de escritores y exige revisar el despliegue cuando varios procesos comparten estado. Una base documental permite incrustar una partida y escribirla de forma atómica; el historial creciente, las referencias a jugadores y la duplicación de información exigen reglas adicionales. PostgreSQL coincide con la tecnología del prototipo y ofrece restricciones explícitas para el historial y la liquidación.

## Consecuencias
Positivas: transacciones locales, consultas de historial, claves de pertenencia y acumulados reproducibles. Negativas: servicio de base de datos, migraciones, respaldos y contención por partida. Los bloqueos serializan comandos dentro de una partida; distintas partidas se procesan independientemente. La centralización no ofrece alta disponibilidad por sí sola.

## Compliance
Ejecutar database/schema.sql en una base vacía. tests/schema.test.ts verifica DDL, PK, FK, dos copias de carta, ronda abierta única, inmutabilidad del perfil y suma de movimientos. tests/postgres.test.ts, contra una base efímera, verifica cierres concurrentes con dos conexiones y rollback si falla la outbox. La prueba PGlite local no sustituye la verificación de bloqueos entre conexiones. Revisar migraciones y la correspondencia entre UML, Barker y SQL.

## Notas y revisión
La prueba PostgreSQL requiere ARCH_TEST_DATABASE_URL apuntando a una base exclusiva y vacía; CI proporciona ese servicio. La identidad de sesión permanece fuera del esquema académico del juego y será integrada con autenticación. Revisar topología ante contención sostenida o requisitos de disponibilidad nuevos.
