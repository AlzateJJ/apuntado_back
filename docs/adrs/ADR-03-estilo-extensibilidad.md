# ADR-03 Estilo arquitectónico y extensibilidad de reglas

Estado: adoptado para el diseño del Entregable 2. Implementación parcial comprobable en design/src. Responsable: Juan José Alzate Rojas. Fecha de decisión: 27 de octubre de 2026.

## Contexto
La plataforma ofrece Clásica de una ronda y Apuntado de rondas acumulativas. Configurability, Testability y Responsiveness son el Top 3 del Entregable 1. Las reglas cambian con más frecuencia que la coordinación de turno y cierre. Se requiere añadir variantes sin modificar ese núcleo y sostener la entrega con un solo desarrollador.

## Decisión
Mantener un monolito modular organizado por capacidades. CloseRound coordina la transacción a través de RoundStore e invoca Variant mediante VariantCatalog. Las implementaciones classic y apuntado dependen únicamente de contratos y utilidades puras de dominio; no se importan entre sí. bootstrap/catalog.ts es el punto de composición. Añadir una variante requiere implementar Variant, registrarla, publicar un perfil versionado y desplegar el conjunto. No se modifica CloseRound ni se ofrecen plug-ins descargables en ejecución.

## Alternativas y fundamento
Microkernel permite un registro y ciclo de vida de extensiones independientes; implica compatibilidad binaria o de contratos, carga, aislamiento y gestión de fallas de plug-ins. No hay terceros que distribuyan reglas ni necesidad de reemplazarlas en caliente. El monolito modular proporciona el aislamiento necesario mediante interfaces y verificaciones de imports, conservando llamadas locales y una transacción SQL. Un monolito con condicionales dispersos reduce el código inicial, pero dificulta mantener dos modalidades y sus pruebas.

## Consecuencias
Positivas: evaluadores puros, una frontera transaccional, selección por versión y extensión por contrato. Negativas: despliegue conjunto, posible consumo compartido de CPU y necesidad de vigilar los límites. Se admite reiniciar para publicar variantes; las partidas ya iniciadas conservan su perfil. El beneficio de respuesta es una expectativa arquitectónica, no un resultado de una prueba multijugador.

## Compliance
Ejecutar npm run test:architecture: cero dependencias cruzadas entre variantes, cero ciclos y matriz de imports permitidos. FF-05 impide infraestructura en dominio, reglas y aplicación. Ejecutar tests/domain.test.ts: una estrategia sintética se incorpora por inyección sin modificar CloseRound; versión desconocida y registro duplicado se rechazan. Revisar el diff del núcleo al incorporar una nueva variante. Evidencia en docs/evidence/verification.json.

## Notas y revisión
Amplía ADR-01 y ADR-02 del Entregable 1; no los sustituye. Revisar si aparece una necesidad demostrada de instalar reglas por terceros o desplegarlas con independencia. Las configuraciones publicadas son inmutables y requieren otra versión para cambiar.
