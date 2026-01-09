const fs = require('fs');
const path = require('path');

console.log("🔑 ENCENDIENDO EL MOTOR DE LA APP...");

// Reescribimos el main.jsx CORRECTAMENTE
const mainCode = `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <--- ESTO FALTABA
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- ESTO ES LO QUE QUITA LA PANTALLA NEGRA */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
`;

// Asegurarnos que existe el archivo index.css para que no falle
const cssCode = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: black;
  color: white;
  margin: 0;
}`;

try {
    fs.writeFileSync(path.join('src', 'main.jsx'), mainCode);
    console.log("✅ src/main.jsx -> Motor de navegación activado.");

    if (!fs.existsSync(path.join('src', 'index.css'))) {
        fs.writeFileSync(path.join('src', 'index.css'), cssCode);
        console.log("✅ src/index.css -> Estilos base creados.");
    }

    console.log("\n🚀 LISTO. Ahora la pantalla ya no estará negra.");
} catch (error) {
    console.error("❌ Error:", error);
}