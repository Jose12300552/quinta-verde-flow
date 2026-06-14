# FASES DEL MODELO DE DESARROLLO RÁPIDO DE APLICACIONES (DRA)
## Aplicado al Proyecto SARQUE

---

El **Desarrollo Rápido de Aplicaciones (DRA)**, propuesto por James Martin en 1991, comprende cuatro fases secuenciales que guiaron el desarrollo del sistema SARQUE.

---

## FASE 1 — Planificación de Requisitos

En esta fase se definió el alcance del sistema, se identificó el problema central y se establecieron los requisitos funcionales y no funcionales mediante el contacto directo con el cliente.

**Actividades realizadas:**

| Actividad | Producto generado | Duración |
|-----------|-------------------|----------|
| Entrevista no estructurada a la administración del parque | Identificación del problema central | 2 días |
| Observación directa de jornadas de riego del personal | Diagnóstico operativo documentado | 5 días |
| Relevamiento del plano hídrico del parque | Plano anotado con los 41 puntos de riego y la red de cañerías | 3 días |
| Documentación del cronograma semanal en papel | Tabla de horarios por sector y día | 1 día |
| Análisis de requerimientos funcionales y no funcionales | Listas RF01–RF09 y RNF01–RNF06 | 3 días |

**Acuerdo de alcance del proyecto:**
- Sistema automatizado con 6 controladores BL-KR + 22 electroválvulas.
- Plataforma web complementaria para visualización y reportes.
- Programación de los controladores mediante la app oficial K-RainBL.
- No se requiere infraestructura WiFi adicional ni puente IoT externo.

---

## FASE 2 — Diseño del Usuario

En esta fase se construyeron prototipos visuales de la interfaz web y se validaron con la administración antes de iniciar la codificación, garantizando que el sistema final respondiera a las necesidades reales del cliente.

**Actividades realizadas:**

| Actividad | Producto generado |
|-----------|-------------------|
| Wireframes de las páginas principales | Bocetos del Dashboard, Cronograma, Sectores y Reportes |
| Definición del modelo de datos | Diagrama Entidad-Relación inicial |
| Diseño de la paleta de colores del cronograma | Códigos: amarillo (2 h), verde (1:30 h), azul (1 h) |
| Validación de prototipos con la propietaria del parque | Ajustes iterativos sobre la estructura del cronograma |
| Diseño de la arquitectura del sistema | Diagrama de Componentes |

**Iteraciones de diseño:**
- **Iteración 1:** prototipo de Dashboard con sector activo en tiempo real.
- **Iteración 2:** cronograma editable tipo tabla con colores por duración.
- **Iteración 3:** página de reportes con gráficos de barras y ranking de sectores.

---

## FASE 3 — Construcción Rápida

En esta fase se implementó la plataforma web SARQUE utilizando un stack tecnológico moderno orientado al desarrollo iterativo, con entregas incrementales semanales.

**Stack tecnológico utilizado:**

| Capa | Tecnología | Justificación en el contexto DRA |
|------|-----------|----------------------------------|
| Frontend | React 18 + TypeScript + Vite | Hot Module Reload permite ver cambios al instante |
| UI | Tailwind CSS + shadcn/ui | Componentes accesibles preconstruidos (sin escribir HTML/CSS desde cero) |
| Backend | Supabase (PostgreSQL + Auth + API REST) | Base de datos sin necesidad de programar API: PostgREST genera endpoints automáticamente |
| Gestión de estado | TanStack React Query | Manejo declarativo de datos del servidor con caché automática |
| Validación | Zod | Esquemas tipados reutilizables en frontend y backend |
| Hosting | Lovable.dev | Despliegue continuo (CI/CD) a cada commit |

**Incrementos del desarrollo:**

| Incremento | Funcionalidad entregada | Semana |
|------------|------------------------|--------|
| INC-1 | Autenticación de usuarios y esquema de base de datos | Semana 11 |
| INC-2 | CRUD de Sectores (catálogo del parque) | Semana 11 |
| INC-3 | Cronograma visual editable tipo tabla semanal | Semana 12 |
| INC-4 | Dashboard con sector activo en tiempo real | Semana 13 |
| INC-5 | Reportes simulados con gráficos de consumo | Semana 14 |
| INC-6 | Refactorización (eliminación de login según decisión final del cliente) | Semana 14 |

---

## FASE 4 — Transición e Implementación

En esta última fase se realizó el despliegue del sistema en operación real, la migración de los datos del cronograma de papel al sistema digital y la capacitación del personal del parque.

**Actividades realizadas:**

| Actividad | Resultado |
|-----------|-----------|
| Despliegue de la plataforma web SARQUE en producción | URL accesible desde cualquier dispositivo con internet |
| Migración del cronograma de papel a la plataforma digital | 20 sectores registrados y aproximadamente 28 horarios semanales |
| Programación física de los 6 controladores BL-KR | Cronograma cargado en cada controlador vía app K-RainBL |
| Capacitación a la administración del parque | Manual de Usuario SARQUE entregado y explicado |
| Pruebas de aceptación en campo | Validación de los escenarios principales |

---

## Cronograma General del Proyecto bajo DRA

```
Semana:    1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
─────────────────────────────────────────────────────────────────────
F1 Plan:   ███████████
F2 Diseño:         ███████
F3 Const:                  ███████████████████████
F4 Trans:                                              ████████████
```

---

## Ventajas del DRA observadas en SARQUE

- **Reducción del tiempo total de desarrollo** a aproximadamente 4 semanas para la plataforma web.
- **Retroalimentación temprana del cliente**: los cambios solicitados durante el desarrollo (eliminación del login, eliminación del módulo histórico) se implementaron sin necesidad de reescribir el sistema completo.
- **Calidad visible desde el primer incremento**, lo que aumentó la confianza de la administración del parque en el proyecto.
- **Stack tecnológico moderno** que facilita el mantenimiento futuro sin dependencias obsoletas.

---

*Trabajo Dirigido SARQUE — Instituto Tecnológico Superior de Sacaba (ITSa)*
*Carrera de Informática Industrial — 2026*
*Postulante: Jose Neyer Arnez Aguilar — Tutor: Ing. Ariel Luis Gruich Arratia*
