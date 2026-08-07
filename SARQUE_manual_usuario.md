# SARQUE

## Sistema Automatizado de Riego — Quinta Estación
### MANUAL DE USUARIO

---

**Versión 1.0 — Cochabamba, Bolivia, 2026**

**Instituto Tecnológico Superior de Sacaba (ITSa)**
**Carrera de Informática Industrial**

**Postulante:** Jose Neyer Arnez Aguilar
**Tutor:** Ing. Ariel Luis Gruich Arratia
**Propietaria del parque:** Sra. Eliana Soria Yapur

---

El sistema SARQUE automatiza el riego del Parque Ecoturístico Quinta Estación mediante 6 controladores de riego Bluetooth K-Rain BL-KR y 22 electroválvulas K-Rain BSPT de 9V DC tipo latching, complementado con una plataforma web de gestión y documentación digital. Los controladores se programan mediante la aplicación móvil oficial **K-RainBL** (iOS y Android) sobre tecnología Bluetooth Smart 4.0 (Low Energy). La plataforma web SARQUE permite consultar el cronograma, gestionar sectores y administrar los datos del sistema.

---

## IMPORTANTE

- **Solo use solenoides 9V DC tipo latching** con los controladores BL-KR.
- **Cada estación se puede asociar a un solo programa** del controlador (A, B o C).
- **Cada modificación al programa en la app K-RainBL debe ser GUARDADA y luego TRANSMITIDA al controlador** desde la pantalla principal.
- **Las baterías 9V de los controladores BL-KR deben revisarse anualmente** y reemplazarse cuando el indicador de la app muestre carga baja.
- **No regar bajo lluvia.** Suspenda los programas desde la app K-RainBL (función ON/OFF) cuando se detecte o pronostique lluvia.

---

## CONTENIDO

1. Componentes del sistema SARQUE
2. Plataforma Web SARQUE
   - 2.1. Acceso al sistema
   - 2.2. Dashboard principal
   - 2.3. Gestión de sectores
   - 2.4. Gestión de controladores y estaciones
   - 2.5. Cronograma semanal de riego
   - 2.6. Gestión de horarios por sector
   - 2.7. Roles de usuario
3. Programación de controladores BL-KR con la app K-RainBL
   - 3.1. Instalar la app
   - 3.2. Instalar la batería 9V en el controlador
   - 3.3. Emparejar el BL-KR con el smartphone
   - 3.4. Programar el cronograma de riego
   - 3.5. Asignar tiempos de riego por estación
   - 3.6. Transmitir la programación al controlador
   - 3.7. Suspender el sistema (ON/OFF)
   - 3.8. Pruebas manuales por estación
4. Mantenimiento
   - 4.1. Reemplazo de baterías 9V
   - 4.2. Inspección de cajas de válvula
   - 4.3. Uso de las llaves de paso manuales de respaldo
5. Solución de problemas
6. Garantía y soporte

---

# 1. COMPONENTES DEL SISTEMA SARQUE

El sistema SARQUE consta de cuatro componentes integrados:

| Componente | Descripción | Ubicación |
|------------|-------------|-----------|
| **Bomba sumergible Grundfos** | 5 HP trifásica, pozo de 50 m, caudal 4.2 L/s | Caseta de máquinas |
| **6 Controladores K-Rain BL-KR** | 2 BL-KR2 + 3 BL-KR4 + 1 BL-KR6 (22 estaciones totales) | Cajas distribuidas en el parque |
| **22 Electroválvulas K-Rain BSPT 9V DC** | Latching, instaladas en cajas de hormigón 40×40×30 cm | A lo largo del recorrido hídrico |
| **Plataforma Web SARQUE** | Interfaz de gestión y documentación digital | Acceso vía navegador desde cualquier dispositivo |

---

# 2. PLATAFORMA WEB SARQUE

La plataforma web SARQUE es la herramienta digital de gestión del sistema. Reemplaza el cronograma de riego en papel y centraliza la documentación del parque.

## 2.1. Acceso al sistema

1. Abra su navegador (Chrome, Edge, Safari, Firefox) en cualquier dispositivo: PC, tablet o smartphone.
2. Ingrese a la dirección web proporcionada por la administración (URL de SARQUE).
3. La pantalla de inicio mostrará el formulario de **Login**.
4. Ingrese su correo electrónico y contraseña.
5. Haga clic en **Iniciar sesión**.

> **Nota:** Si es la primera vez que ingresa, solicite a la administración la creación de su cuenta. Las cuentas se crean desde el panel de administración del sistema.

> **Importante:** La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.

## 2.2. Dashboard principal

Tras iniciar sesión, accederá al **Dashboard** principal, organizado en cuatro secciones:

| Sección | Contenido |
|---------|-----------|
| **Resumen** | Cantidad de sectores activos, controladores registrados y horarios vigentes |
| **Próximo riego programado** | Sector, hora y duración del próximo riego según cronograma |
| **Acceso rápido** | Botones a Sectores, Controladores, Cronograma y Manual |
| **Información del parque** | Datos generales: 5 hectáreas, 22 estaciones, 6 controladores |

## 2.3. Gestión de sectores

El módulo **Sectores** permite registrar cada zona del parque con su información correspondiente.

### Para crear un nuevo sector:

1. En el menú lateral, haga clic en **Sectores**.
2. Haga clic en el botón **+ Nuevo sector**.
3. Complete los datos:
   - **Nombre del sector** (ej. "Laberinto de Wisterias")
   - **Descripción** (vegetación del sector)
   - **Controlador asignado** (selección de los 6 BL-KR existentes)
   - **Número de estación** (1 a 6 según el modelo del controlador)
4. Haga clic en **Guardar**.

### Para editar un sector existente:

1. En la lista de sectores, haga clic en el ícono de lápiz junto al sector deseado.
2. Modifique los campos necesarios.
3. Haga clic en **Guardar cambios**.

### Para eliminar un sector:

1. En la lista de sectores, haga clic en el ícono de basurero.
2. Confirme la eliminación en el cuadro de diálogo.

> **Importante:** Eliminar un sector también elimina los horarios de riego asociados. Use con precaución.

## 2.4. Gestión de controladores y estaciones

El módulo **Controladores** muestra los 6 BL-KR del parque con sus estaciones asignadas.

| Controlador | Modelo | Estaciones | Zona |
|-------------|--------|-----------|------|
| C1 | BL-KR2 | 2 | Zona A |
| C2 | BL-KR2 | 2 | Zona B |
| C3 | BL-KR4 | 4 | Zona C |
| C4 | BL-KR4 | 4 | Zona D |
| C5 | BL-KR4 | 4 | Zona E |
| C6 | BL-KR6 | 6 | Zona F |

Al hacer clic en cada controlador puede ver:
- Cuáles de sus estaciones están asignadas a un sector
- Cuáles están libres
- La ubicación física del controlador

## 2.5. Cronograma semanal de riego

El módulo **Cronograma** presenta una tabla visual con los horarios de riego de toda la semana, organizada por franjas horarias y días.

- Cada celda muestra qué sector debe regarse en cada franja.
- Los colores diferencian los sectores para facilitar la lectura.
- La vista es consultable desde el smartphone del jardinero en cualquier momento.

> **Recomendación:** Imprima el cronograma una vez por semana y publíquelo en un lugar visible de la caseta de máquinas como respaldo físico.

## 2.6. Gestión de horarios por sector

El módulo **Horarios** permite definir cuándo se debe regar cada sector.

### Para crear un nuevo horario:

1. En el menú lateral, haga clic en **Horarios**.
2. Haga clic en **+ Nuevo horario**.
3. Complete:
   - **Sector** (selección del catálogo existente)
   - **Hora de inicio** (0 a 23)
   - **Minuto** (0 a 59)
   - **Duración en minutos** (1 a 120, normalmente 120 = 2 horas)
   - **Días de la semana** (selección múltiple)
4. Haga clic en **Guardar**.
5. **Posteriormente, replique este horario en el controlador BL-KR correspondiente desde la app K-RainBL** (ver Capítulo 3).

### Para desactivar un horario sin eliminarlo:

Útil cuando un sector no debe regarse temporalmente (ej. trasplante reciente, época de lluvias).

1. En la lista, ubique el horario deseado.
2. Haga clic en el interruptor **Activo / Inactivo**.
3. El horario queda guardado pero no se replica al controlador hasta que se reactive.

## 2.7. Roles de usuario

SARQUE define dos roles:

| Rol | Permisos |
|-----|----------|
| **Administrador** | Gestión completa: sectores, controladores, horarios, usuarios |
| **Operador (Jardinero)** | Solo consulta: cronograma, sectores y manual |

> El administrador es responsable de mantener el cronograma sincronizado entre la plataforma SARQUE y los controladores BL-KR físicos en el parque.

---

# 3. PROGRAMACIÓN DE CONTROLADORES BL-KR CON LA APP K-RAINBL

Los controladores K-Rain BL-KR se programan **exclusivamente** mediante la aplicación oficial del fabricante K-Rain Manufacturing Corporation. La plataforma web SARQUE NO programa los controladores directamente; sirve como referencia digital del cronograma que se debe replicar en la app K-RainBL.

## 3.1. Instalar la app

Descargue gratuitamente **K-RainBL** desde:
- **App Store** (iPhone 4s o superior con iOS)
- **Google Play** (Samsung Galaxy S3 o superior con Android)

Para la lista completa de dispositivos compatibles, visite: `www.krain.com/blkrdevicelist`

## 3.2. Instalar la batería 9V en el controlador

1. Desenrosque la tapa de la caja del controlador.
2. Retire el sello protector.
3. Conecte la batería 9V a los terminales (respetando polaridad +/-).
4. Vuelva a colocar el sello y la tapa.
5. Apriete la tapa a mano para garantizar el sellado contra humedad.

> **Importante:** Las baterías no están incluidas con el controlador. Use exclusivamente baterías 9V alcalinas de buena calidad. La autonomía aproximada es de 1 año.

## 3.3. Emparejar el BL-KR con el smartphone

1. Active el **Bluetooth** en su smartphone (Ajustes → Bluetooth → Encendido).
2. Abra la app **K-RainBL**.
3. En la pantalla "**Seleccionar el módulo BL-KR**" verá los controladores cercanos detectados.
4. Cada controlador muestra su **número de serie** y la **intensidad de la señal**.
5. Toque el controlador que desea emparejar.
6. La app indicará que se está conectando.
7. Una vez conectado, puede:
   - Cambiar el nombre del controlador (ej. "BL-KR4 Olivos")
   - Asignar una **clave de seguridad** (contraseña) opcional

### Para añadir más controladores:

En la pantalla **Módulos**, toque el botón **+** en la esquina inferior izquierda y repita los pasos anteriores con cada uno de los 6 controladores del parque.

> **Si olvida la clave de seguridad:** Desconecte la batería, haga contacto entre los terminales con algo metálico durante 10 segundos para hacer un cortocircuito de reseteo, vuelva a conectar la batería y emparéjelo nuevamente.

## 3.4. Programar el cronograma de riego

1. En la pantalla principal, toque el controlador a programar.
2. Toque **Programar**.
3. Seleccione el programa (**A**, **B** o **C**). El programa seleccionado se resalta en azul marino.

### Añadir días de riego:

Opciones disponibles:
- **Personalizada:** seleccione manualmente los días de la semana.
- **Días pares:** las estaciones funcionan en los días pares del mes.
- **Días impares:** las estaciones funcionan en los días impares.
- **Días impares-31:** días impares excluyendo el día 31.
- **Intervalo:** ejecuta cada N días (1 a 31).

### Añadir horas de inicio:

Toque **Añadir hora de inicio** y configure la hora a la que debe comenzar el ciclo de riego. Por cada hora de inicio, todas las estaciones con tiempo de riego asignado se ejecutarán **en secuencia** (estación 1, luego estación 2, etc.).

### Presupuesto de agua (opcional):

El "Presupuesto de Agua" permite reducir el tiempo de riego en un porcentaje global, útil para épocas de menor evapotranspiración (invierno, temporada de lluvias). Por ejemplo, configurar 80 % reducirá todos los tiempos de riego al 80 % de su valor original.

## 3.5. Asignar tiempos de riego por estación

1. Desde la pantalla principal del controlador, seleccione la estación que desea configurar.
2. Toque el campo de **tiempo de riego** y configure la duración (por ejemplo: 120 minutos = 2 horas).
3. Asigne la estación a uno de los programas (A, B o C).
4. Opcionalmente, **renombre la estación** a un nombre intuitivo (ej. "Estación 1 - Laberinto Wisterias").

> **Importante:** Cada estación puede asociarse a un solo programa (A, B o C). No puede asignarse a múltiples programas simultáneamente.

## 3.6. Transmitir la programación al controlador

**Este es el paso más importante.** La programación realizada en la app NO se envía al controlador físico hasta que se transmita.

1. Después de cada cambio, toque el ícono **Guardar** en la esquina superior derecha.
2. Regrese a la pantalla principal del controlador.
3. Toque **Transmitir** (Transmit).
4. El controlador emitirá un sonido **"bing"** confirmando la recepción correcta.

> **Si no escucha el "bing":** la programación no se transmitió. Acérquese al controlador (alcance Bluetooth < 10 m) e intente nuevamente.

## 3.7. Suspender el sistema (ON/OFF)

Para suspender temporalmente el riego (por ejemplo, ante lluvia):

1. Desde la pantalla principal del controlador, ubique el botón **ON/OFF**.
2. Toque **OFF**.
3. El controlador deja de ejecutar los programas indefinidamente hasta que se reactive.
4. Para reanudar, toque **ON**.

> **Recomendación:** En días de lluvia, suspenda los 6 controladores del parque al inicio de la jornada. Reactívelos al día siguiente.

## 3.8. Pruebas manuales por estación

Para verificar el funcionamiento de una electroválvula:

1. En la pantalla principal del controlador, acceda a **Operación Manual**.
2. Opciones disponibles:
   - **Probar todas las estaciones:** ejecuta todas las estaciones activas en secuencia, con la duración que usted determine.
   - **Ejecutar una sola estación:** seleccione la estación y la duración del test.
   - **Ejecutar programa:** ejecuta inmediatamente el programa A, B o C completo.
3. Se debe escuchar la apertura mecánica del solenoide y verificar visualmente la salida de agua.

> **Procedimiento de arranque inicial de solenoides:** Si una válvula viene de fábrica "enganchada" (magnéticamente abierta), realice una **Prueba de todas las estaciones por 2 segundos cada una** para desbloquear los solenoides y cerrar las válvulas correctamente.

---

# 4. MANTENIMIENTO

## 4.1. Reemplazo de baterías 9V

**Frecuencia:** Anual, o cuando la app K-RainBL indique batería baja.

1. Desenrosque la tapa del controlador.
2. Retire la batería usada.
3. Instale una batería 9V alcalina nueva respetando polaridad.
4. Vuelva a colocar el sello y la tapa apretándola a mano.
5. Verifique en la app K-RainBL que el indicador de batería esté en verde.

> **Recomendación:** Anote la fecha de reemplazo en la plataforma SARQUE para llevar un control. Reemplace simultáneamente las 6 baterías de los controladores para facilitar el calendario de mantenimiento.

## 4.2. Inspección de cajas de válvula

**Frecuencia:** Semestral.

1. Abra la tapa de cada caja de hormigón (40 × 40 × 30 cm).
2. Verifique:
   - Ausencia de agua estancada (drenaje correcto)
   - Estado de los empalmes (sin oxidación visible)
   - Estado del solenoide y la electroválvula
   - Funcionamiento de la llave de paso manual de respaldo
3. Limpie con una franela si hay polvo o tierra acumulada.

## 4.3. Uso de las llaves de paso manuales de respaldo

Cada electroválvula tiene en serie una **llave de paso manual de color rojo** que permite:

- **Aislar la electroválvula** para mantenimiento sin interrumpir el resto del sistema.
- **Cerrar manualmente** un sector si la electroválvula falla.
- **Cortar el agua** ante una fuga en la cuellera.

> Mantenga las llaves de paso en posición **ABIERTA** durante la operación normal. Ciérrelas únicamente para mantenimiento.

---

# 5. SOLUCIÓN DE PROBLEMAS

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| La electroválvula no abre en el horario programado | Programación no transmitida al BL-KR | Repita el paso de **Save + Transmit** en la app K-RainBL |
| Una zona se queda permanentemente abierta | Solenoide latching enganchado de fábrica | Ejecute **Probar todas las estaciones por 2 segundos** desde la app |
| El controlador no aparece en la app | Bluetooth desactivado o batería agotada | Active Bluetooth; revise batería del controlador |
| Olvido de la clave de seguridad | — | Cortocircuite los terminales de batería 10 s, reconecte y emparéjelo otra vez |
| Fuga visible cerca de una electroválvula | Empalme deteriorado o cuellera dañada | Cierre la llave de paso roja manual y solicite reparación |
| La plataforma web no carga | Sin conexión a internet o problema temporal de Supabase | Verifique su conexión WiFi/datos y reintente |
| Login rechazado | Email o contraseña incorrectos | Verifique credenciales o solicite reseteo al administrador |

---

# 6. GARANTÍA Y SOPORTE

## Garantía de los controladores K-Rain BL-KR

K-Rain Manufacturing Corporation garantiza al comprador original que los controladores BL-KR no presentarán defectos de material ni de manufactura por un período de **2 años** desde la fecha de compra. Para más información:

```
K-Rain Manufacturing Corp.
1640 Australian Avenue
Riviera Beach, FL 33404, USA
Teléfono: (561) 844-1002
www.krain.com
```

## Soporte de la plataforma SARQUE

Para soporte técnico de la plataforma web SARQUE, contacte a:

- **Administración del Parque Quinta Estación**
- **Postulante:** Jose Neyer Arnez Aguilar
- **Tutor:** Ing. Ariel Luis Gruich Arratia
- **Institución:** Instituto Tecnológico Superior de Sacaba — Carrera de Informática Industrial

---

*Manual de Usuario SARQUE — Versión 1.0*
*Cochabamba, Bolivia — 2026*
