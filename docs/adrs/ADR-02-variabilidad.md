# ADR-02 Variabilidad con Strategy y perfil versionado

Antecedente conservado del Entregable 1. Su estado corresponde al momento del primer informe.

Estado. Propuesto para el MVP. Las reglas incluyen dos mazos sin jokers, hasta seis jugadores, as bajo y alto, duplicados válidos en grupos y toque sin autoeliminación.

Contexto. El juego necesita cierres 4-3-3, 5-5, pintas y toque con una o dos cartas sobrantes. Tocar exige sumar como máximo cinco puntos y conservar un puntaje mayor que −101. Se necesita mantener separadas estas reglas del flujo de turnos para poder probarlas y ampliarlas.

Decisión. Usar un registro interno de estrategias de ReglaCierre, un particionador común y una PoliticaLiquidacion separada. El perfil inmutable selecciona estrategias y parámetros por versión. Los cambios de configuración soportada no requieren nuevas clases; las nuevas familias de regla se incorporan como implementaciones probadas y se despliegan con el monolito.

Alternativas y justificación. Condicionales dispersos minimizan abstracciones al inicio, pero dificultan cubrir todas las combinaciones y permiten contradicciones. Un microkernel con plug-ins dinámicos ofrece extensiones independientes, a cambio de versionado de contratos, aislamiento, carga, compatibilidad y seguridad de código externo. Strategy ofrece el grado de variabilidad requerido sin introducir ese ciclo de vida de extensiones.

Consecuencias positivas. Las estrategias comparten una interfaz y pueden probarse por separado. Combinaciones y toque reutilizan la revisión de grupos y escaleras. El contexto incluye el puntaje actual para rechazar la autoeliminación, y el resultado conserva los sobrantes que se descontarán. Las reglas se mantienen durante cada partida.

Consecuencias negativas. Cada estrategia requiere pruebas, documentación y compatibilidad con las invariantes. La configuración puede generar combinaciones inválidas si no se valida. Una regla nueva exige despliegue; no se promete instalación dinámica. El catálogo debe evitar parámetros que solo oculten condicionales arbitrarios.

Cumplimiento / Compliance. Probar manos en distinto orden, cartas duplicadas válidas, uso único de cada copia, valores de figuras y sobrantes de 4, 5 y 6 puntos. Verificar que −96 menos 5 rechace el toque y −95 menos 5 lo permita. Guardar la versión de reglas con la partida y evitar lógica de juego en la interfaz o en SQL.

Notas. Drivers: Configurability, Extensibility, Testability y Responsiveness. El microkernel se reconsiderará si se necesitan reglas instalables por terceros o actualizaciones independientes de las extensiones.
