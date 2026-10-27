# ADR-01 Particionamiento superior por dominio

Antecedente conservado del Entregable 1. Su estado corresponde al momento del primer informe.

Estado. Propuesto para el MVP.

Contexto. Las reglas de cierre y liquidación cambian con la variante. El prototipo separa archivos técnicos, pero distribuye decisiones entre cliente y servidor, expone mutaciones de cartas y no garantiza una liquidación única. El primer entregable necesita límites lógicos comprensibles y verificables con un costo operativo reducido.

Decisión. Particionar el backend por capacidades del dominio en un monolito modular: Gestionar sala, Conducir partida, Evaluar jugadas, Liquidar ronda, Consultar estado y Sincronizar mesa. La persistencia y el transporte se conectan mediante puertos. Los paquetes pueden tener capas internas, pero estas no son la división superior del sistema. Conducir partida conserva la frontera transaccional de cada comando.

Alternativas y justificación. Una partición superior técnica —controllers, services y models— facilita localizar tecnologías, pero dispersa cada regla entre carpetas y favorece servicios CRUD por entidad. Microservicios por carta, jugador o puntaje añadirían red y coordinación distribuida sin autonomía de negocio suficiente. La opción elegida concentra los cambios por capacidad y mantiene una transacción local para cartas y acta.

Consecuencias positivas. Reglas y casos de uso quedan localizables; C3 y C4 se prueban sin base de datos; una operación de cierre confirma o revierte todo su efecto. La base tecnológica actual puede reutilizarse sin aceptar sus contratos inseguros.

Consecuencias negativas. Los módulos se despliegan juntos y comparten recursos. La disciplina de límites debe mantenerse en código: una base común facilita accesos indebidos si no se imponen puertos y reglas de dependencias. La extracción futura de un servicio no será gratuita.

Cumplimiento / Compliance. Revisión de paquetes y dependencias en CI; cero ciclos en el grafo permitido; dominio sin imports de Express o Sequelize; adaptadores sin acceso directo a manos mutables. Pruebas de concurrencia, idempotencia, rollback y filtrado de vistas. Cada cambio de regla debe mostrar su RF, pruebas y módulo responsable.

Notas. Esta decisión favorece integridad, consistencia, facilidad de pruebas y respuesta. Se revisará si el crecimiento de la aplicación exige desplegar componentes de forma independiente.
