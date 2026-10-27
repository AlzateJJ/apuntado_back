# Apuntado Entregable 2

Diseño detallado, arquitectura de información y gobernanza. Juan José Alzate Rojas, Fundamentos de Arquitectura de Software, Universidad Nacional de Colombia.

Rama académica: [entregable-2](https://github.com/AlzateJJ/apuntado_back/tree/entregable-2).

## Modalidades

- **Clásica / partida única**: el perfil classic@1 admite cierre 4-3-3, termina con el primer ganador y devuelve a la vista principal. Sin puntaje acumulado. Esta es la configuración inicial de diseño para la modalidad de la guía.
- **Apuntado**: rondas acumulativas; 4-3-3, 5-5, pintas y toque. +10 por combinaciones, +25 por pintas, sin premio por toque; eliminación en -101 o menos; victoria en +51 o más o por único activo. El toque exige sobrantes <=5 y conservar un puntaje >-101.

Ambas usan dos mazos sin jokers, identidades físicas distintas, as bajo o alto y valor del as de 10. Los perfiles son inmutables por partida.

## Reproducción

Usar **Node.js 24** y npm. El lockfile fija las versiones.

```sh
git clone --branch entregable-2 https://github.com/AlzateJJ/apuntado_back.git
cd apuntado_back
npm ci --ignore-scripts
npm run verify
```

`verify` ejecuta tipos, 16 pruebas de dominio/aplicación, 9 pruebas de arquitectura, una prueba de esquema SQL, el límite de CC y la extracción de métricas. Los controles negativos son pruebas que deben aprobar al detectar las infracciones; no se espera un pipeline rojo.

Pruebas individuales: `npm run test:domain`, `npm run test:architecture`, `npm run test:schema`, `npm run lint:architecture`, `npm run metrics`.

La prueba `npm run test:postgres` requiere `ARCH_TEST_DATABASE_URL` apuntando a una base **efímera, vacía y exclusiva** PostgreSQL 18. Crea el esquema y datos de prueba; no se debe usar una base del prototipo. El workflow proporciona automáticamente esa base y comprueba bloqueo entre conexiones, respuesta idempotente y rollback del acta, puntos y outbox. Sin la variable, la prueba local se marca omitida expresamente.

## Artefactos

| Contenido | Ruta |
|---|---|
| Informe | `docs/report/` |
| UML de componentes, Barker y UML de entidades | `docs/models/*.drawio`, `*.svg`, `*.pdf`, `*.png` |
| Definición editable de atributos | `docs/models/entities.json` |
| Esquema ejecutable | `database/schema.sql` |
| Decisiones acumuladas | `docs/adrs/ADR-01` a `ADR-05` |
| Antecedentes conservados | `docs/history/` |
| Riesgos individuales | `docs/risk-storming/` |
| Fitness functions | `tests/architecture/fitness.test.ts` |
| Código bajo verificación | `design/src/` |
| Evidencia | `docs/evidence/` y GitHub Actions |

Abrir los `.drawio` en diagrams.net. Los SVG y PDF son vectoriales. Los PNG están exportados a alta resolución para Word. `scripts/build_models.py` permite regenerarlos con Python, reportlab y pypdfium2; `scripts/build_report.py` crea el Word con python-docx y Pillow. El PDF consolidado se exportó con Microsoft Word y se inspeccionó página por página.

## Alcance técnico

La base implementa evaluación y liquidación de cierres, un coordinador con puertos, adaptadores transaccionales de memoria y PostgreSQL, una proyección de privacidad, un despachador de outbox y la decisión de navegación. La prueba de extensión añade una estrategia sintética sin cambiar el núcleo.

Los módulos previstos de sala/reparto/robo/descarte, autenticación del transporte, servidor WebSocket y pantallas completas se integrarán en el MVP. Esta entrega no certifica una partida multijugador completa ni los percentiles de latencia del Entregable 1.

El antiguo directorio `src/` se conserva como antecedente; no lo ejecuta ni lo verifica este pipeline. Su manifiesto original está en `docs/history/package-prototipo.json`. El manifiesto de esta rama contiene únicamente las dependencias necesarias para la base de arquitectura. La rama principal del prototipo permanece separada.

## Risk Storming individual

Este entregable se desarrolla individualmente debido a mi condición de estudiante de prácticas y a las limitaciones para asistir a la mayoría de las clases, situación que comuniqué previamente al profesor Fernan por correo. Por ello, el ejercicio de Risk Storming recoge únicamente mi perspectiva.

La fase de consenso se adapta a una revisión y priorización individual documentada. No hubo votación ni contraste de un equipo. El registro incluye esta limitación como R9.
