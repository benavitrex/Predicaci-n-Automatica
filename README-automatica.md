<div align="center">

# 🗓️ Predicación · Congregación Curauma

**El armador del programa de predicación: casas y hermanos disponibles, programa mensual por semanas y seguimiento del cumplimiento.**

🔗 **[Abrir el registro](https://benavitrex.github.io/Predicaci-n-Automatica/index.html)**

![Sitio](https://img.shields.io/badge/GitHub%20Pages-publicado-1B382B?style=flat-square)
![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-438260?style=flat-square)
![HTML + JS](https://img.shields.io/badge/hecho%20con-HTML%20%2B%20JS-1B382B?style=flat-square)

</div>

---

## ✨ De qué se trata

Este sitio ayuda a organizar la predicación de la congregación sin armar todo a mano. Tiene dos partes:

| Página | Para qué sirve |
|---|---|
| 📋 **Registro** (`index.html`) | Consultar qué **casas** pueden recibir al grupo y qué **varones** pueden sacar grupo, según el día y el turno. Incluye el mapa de territorios. |
| 🗓️ **Programa** (`programa.html`) | Armar el programa del mes por semanas, imprimirlo o enviarlo, y llevar el seguimiento de quién cumplió. |

> La app **PrediApp** toma de este sitio los datos de la salida de hoy, para mostrarlos en el celular.

---

## 📋 Registro

La página principal responde dos preguntas rápidas:

**🏠 Casas disponibles**
Elige el **día** y el **turno** y ves qué casas pueden recibir el grupo.

**👥 Varones disponibles**
Muestra quién puede sacar grupo, según:
- Grupo
- Rango (ancianos, siervos ministeriales, precursores y publicadores)
- Día
- Turno

Los días en que el hermano puede salir aparecen **resaltados en verde**.

También tiene el **mapa de territorios** de la congregación embebido.

---

## 🗓️ Programa

Un armador de programa mensual:

- **Semanas del mes:** semana 1 (1–7), 2 (8–14), 3 (15–21) y 4 (22 al fin de mes).
- **Cada salida** lleva fecha, hora, encargado, lugar de encuentro y territorios.
- **Generar** agrega las salidas que falten sin tocar lo que ya editaste. **Regenerar todo el mes** parte de cero.
- **Horarios por día:** la tarde se puede marcar en cualquier día.
- **Festivos** marcados automáticamente en el programa.
- **Sin repetir:** el mes anterior se usa para no repetir asignaciones.
- **Enviar y PDF** por semana, listos para compartir o imprimir.
- **Historial** de programas guardados, mes a mes.

### ✅ Seguimiento del cumplimiento

- Elige un mes y una **semana** (así no se ve todo junto).
- Marca si cada hermano **cumplió** o **no cumplió**, y si falló, quién lo **reemplazó** y una nota.
- **Marcar pendientes como cumplidos** para cerrar la semana de una vez.

### 📊 Estadísticas

- **Cumplimiento por mes** en una lista simple con su porcentaje.
- Al tocar un mes: **quiénes cumplieron más** y **quiénes fallaron más**.
- **Ficha por hermano** con todo su historial de cumplimiento.

---

## 🔐 Modo edición

Ver el sitio es libre. Para **editar, guardar y marcar el cumplimiento** hace falta habilitar el modo edición con un **token de GitHub**:

1. En GitHub: *Settings → Developer settings → Personal access tokens (fine-grained)*.
2. Dale acceso **solo a este repositorio**.
3. Permiso: **Contents → Read and write**.
4. Pega el token en el sitio. Se guarda **solo en ese dispositivo**.

Sin token, el sitio queda en **solo lectura** (🔒).

---

## 📁 Archivos

```
├── index.html      ← Registro: casas y varones disponibles + mapa
├── programa.html   ← Armador del programa, seguimiento y estadísticas
├── app.js          ← Lógica compartida
└── data.json       ← Datos de la congregación
```

---

## 🚀 Publicación

El sitio funciona con **GitHub Pages**:

1. **Settings → Pages**.
2. *Deploy from a branch* → rama `main` → carpeta `/ (root)`.
3. Queda disponible en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Para actualizarlo, sube los archivos nuevos reemplazando los anteriores.

---

## ⚠️ Privacidad

Este repositorio es **público**: cualquiera que tenga el enlace puede ver las páginas y los datos que contiene (nombres, direcciones, horarios).

- **No subas información que no quieras que se vea.**
- El token de GitHub nunca va en el código, solo en el dispositivo del administrador.
- Si necesitas más privacidad, conviene pasar el contenido a un repositorio privado con inicio de sesión.

---

<div align="center">

Hecho con cariño para la congregación 💚

</div>
