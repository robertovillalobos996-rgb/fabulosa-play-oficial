# Fabulosa Play (Web)

Este proyecto es la versión web independiente (sin Base44).  
Consume datos de canales y radios desde un JSON externo en GitHub.

## Requisitos
- Node.js 18+ (recomendado)
- npm

## Instalar
```bash
npm install
```

## Correr local
```bash
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy en Vercel (importar repo)
Framework: Vite  
Build: `npm run build`  
Output: `dist`

Para que React Router funcione, en Vercel agregar rewrite:
- Source: `/(.*)`
- Destination: `/index.html`
