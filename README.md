# Atómico ⚛️ — Rastreador de hábitos diarios

Rastreador de hábitos personal, inspirado en *Hábitos Atómicos* y en apps como Grit. Hecho con React + Vite. Todos tus datos se guardan solo en tu navegador (`localStorage`) — no hay backend ni base de datos.

## Funciones

- Agrega, edita y elimina los hábitos que quieras (con ícono/emoji).
- Márcalos como hechos con un botón de "ignición" (con animación de chispa).
- Racha actual y mejor racha por hábito.
- Vista de progreso: últimos 7 días, últimas 4 semanas, mapa de constancia (heatmap) y ranking por hábito.
- Modo claro / oscuro con acento único, diseño responsivo (celular, tablet, escritorio).

## Correr el proyecto localmente

Necesitas [Node.js](https://nodejs.org/) instalado (v18 o más nueva).

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

Para generar la versión de producción:

```bash
npm run build
npm run preview   # para probar el build localmente
```

## Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Primera versión de Atómico"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/atomic-habits.git
git push -u origin main
```

(Crea antes el repositorio vacío en GitHub, sin README, y reemplaza `TU-USUARIO`.)

## Desplegar en Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add new site → Import an existing project**.
3. Elige tu repositorio `atomic-habits`.
4. Netlify va a detectar automáticamente la configuración gracias al archivo `netlify.toml` incluido:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Haz clic en **Deploy site**. Listo — cada vez que hagas `git push`, Netlify recompila y actualiza tu sitio solo.

## Nota sobre tus datos

Como se guardan en `localStorage`, tus hábitos viven únicamente en el navegador/dispositivo donde los uses. Si entras desde otro navegador o computadora, vas a ver la app vacía. Si algún día quieres sincronizar entre dispositivos, se puede agregar una base de datos más adelante (por ejemplo con Supabase o Firebase).
