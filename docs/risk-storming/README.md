# Risk Storming individual

Responsable: Juan José Alzate Rojas. Alcance: dos modalidades, cierre, persistencia, sincronización y evolución estructural.

Este entregable se desarrolla individualmente debido a mi condición de estudiante de prácticas y a las limitaciones para asistir a la mayoría de las clases, situación que comuniqué previamente al profesor Fernan por correo. Por ello, el ejercicio de Risk Storming recoge únicamente mi perspectiva.

## Identificación individual

Se recorren cliente-servidor, coordinación-reglas, aplicación-base de datos y commit-notificación. Se consideran repetición, concurrencia, entradas inválidas, falla parcial y exposición. El resultado es `risks.json`: R1 a R9.

## Consenso adaptado a revisión individual

No se registra una sesión grupal ni votos. Se realiza una revisión argumentada, con una escala común: probabilidad 1 excepcional, 2 plausible, 3 esperable; impacto 1 local recuperable, 2 interrupción o deterioro importante, 3 alteración de puntuación/ganador o privacidad. Producto I×P: bajo 1–2, medio 3–4, alto 6–9. Son estimaciones cualitativas, no frecuencias observadas.

## Mitigación

Las zonas altas se vinculan con mecanismos concretos: transacción, bloqueo por partida, idempotencia, outbox, proyección privada, contratos, perfiles inmutables y gates estáticos. Cada entrada conserva justificación, verificación y estimación residual. El residual presupone mantener el mecanismo; no constituye garantía.

R8 requiere ensayo de carga del MVP. R9 permanece medio porque la revisión sistemática no agrega una segunda perspectiva humana. Se reevalúa el registro cuando cambia una modalidad, contrato, transacción o despliegue, o aparece un fallo nuevo.
