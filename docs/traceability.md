# Trazabilidad del Entregable 2

| Requisito | Informe | Fuente editable o evidencia |
|---|---|---|
| Comparar dos estilos frente al Top 3 de E1 | 1.1, p. 2 | ADR-03; Configurability, Testability y Responsiveness |
| Topología, módulos y extensibilidad | 1.2–1.3, pp. 3–5 | `docs/models/uml-componentes.drawio`, `design/src/contracts`, `bootstrap` y `variants` |
| Interfaces provistas/requeridas y puertos | 1.3, p. 4 | Círculos, semicírculos y puertos en el UML de componentes |
| Topología de datos y comparación SQL/NoSQL | 2.1–2.2, p. 6 | ADR-04 y `database/schema.sql` |
| Barker, PK/FK y normalización en 3FN | 2.2, pp. 7–9 | `er-barker-*.drawio`, restricciones SQL y dependencias funcionales |
| Rondas acumulativas 1:N | 2.2–2.4 | `game`, `round`, `round_result`, `score_movement` y vista `current_score` |
| Entidades, tipos y multiplicidades | 2.3, pp. 10–11 | `uml-entidades-*.drawio`, `entities.json`; tablas homónimas SQL |
| Atomicidad, reintentos y concurrencia | 2.4, p. 12 | `design/src/persistence/postgres.ts`, `tests/postgres.test.ts` |
| ADR-03, 04 y 05 con Compliance | 3, pp. 13–15 | `docs/adrs/`; ADR-01 y 02 conservados como antecedentes |
| Matriz 3×3 y zonas 1–2 / 3–4 / 6–9 | 4.1, p. 16 | `matriz-riesgo.drawio` y `docs/risk-storming/risks.json` |
| Tres fases del Risk Storming individual | 4.2, p. 17 | Identificación, revisión individual en lugar de consenso grupal y mitigación |
| Mitigación de riesgos altos | 4.3, pp. 18–19 | R1–R7 y R9: controles, evidencia y riesgo residual estimado |
| Tres reglas mínimas de gobernanza | 5.1, p. 20 | G1 aislamiento, G2 independencia/ciclos, G3 CC; G4–G6 adicionales |
| Fitness functions ejecutables en un stack | 5.2, pp. 21–22 | `tests/architecture/fitness.test.ts`, TypeScript/TSArch |
| CC ≤10 por función y pipeline | 5.3, p. 23 | ESLint, `scripts/complexity-report.ts`, `.github/workflows/architecture.yml` |
| PDF ≤25 páginas y repositorio accesible | Portada y p. 24 | PDF de 24 páginas; rama pública `entregable-2` |

Las evidencias locales están en `docs/evidence/verification.json` y `complexity.json`. GitHub Actions ejecuta además la prueba con PostgreSQL 18 mediante dos conexiones independientes. Los casos deliberadamente inválidos están aislados en `tests/fixtures/invalid` y deben ser detectados por las pruebas.

El código de arquitectura verifica una sección funcional de cierre de ronda. El alcance pendiente de integración multijugador se declara en el informe y el README; no se atribuyen a estas pruebas mediciones de latencia, sesiones WebSocket reales ni una aplicación completa.
