<img align="right" src="https://visitor-badge.laobi.icu/badge?page_id=aleff-eco.mexico-api" />

# México API | Aleff Espinosa Cordova

API REST para consultar códigos postales de México, basada en el catálogo oficial de SEPOMEX. Permite buscar por estado, municipio, ciudad, colonia y código postal con endpoints optimizados y respuestas en JSON.

**Sobre mí:** [devaleff.com](https://devaleff.com) | [aleff.vercel.app](https://aleff.vercel.app)

---

## 📦 Ejemplo de respuesta

```http
GET /api/codigo-postal/29000
```

```json
[
  {
    "d_codigo": "29000",
    "d_estado": "Chiapas",
    "d_ciudad": "Tuxtla Gutiérrez",
    "d_asenta": "Tuxtla Gutiérrez Centro",
    "D_mnpio": "Tuxtla Gutiérrez",
    "d_tipo_asenta": "Colonia"
  }
]
```

---

## ⚙️ Características

- Búsqueda por incidencia (mínimo 4 caracteres) en:
  - Estados: `/api/estado/:query`
  - Municipios: `/api/municipio/:query`
  - Ciudades: `/api/ciudad/:query`
  - Colonias: `/api/colonia/:query`
- Consulta directa de código postal (exacto de 5 dígitos): `/api/codigo-postal/:cp`
- Devuelve solo las columnas necesarias definidas en cada ruta
- Normalización de texto (sin acentos ni distinción de mayúsculas)
- Scripts para parsear archivos `.xml` y `.txt` a JSON
- Documentación interactiva con Swagger UI en `/docs`

---

## 📁 Estructura del proyecto

```bash
mexico-api/
├── public/
├── ├── files/
│   │   ├── CPdescarga.xml       # Catálogo completo en formato XML
│   │   └── CPdescarga.txt       # Catálogo en TXT para parsear
│   ├── favicon.ico
│   ├── index.html
│   └── og-image.png 
├── scripts/
│   ├── parse-xml.js         # Convierte XML a JSON
│   └── parse-txt.js         # Convierte TXT a JSON
├── src/
│   ├── app.js               # Configuración y arranque de Express
│   ├── lib/
│   │   └── normalize.js     # Función para quitar acentos y normalizar
│   ├── db/
│   │   └── data.json        # JSON con los registros actualizados a julio 2025
│   ├── routes/
│   │   ├── estados.js
│   │   ├── municipios.js
│   │   ├── ciudades.js
│   │   ├── colonias.js
│   │   └── codigos.js
│   └── swagger.js           # Configuración de Swagger/OpenAPI
├── .gitignore
├── .env.example             # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## ⚙️ Prerrequisitos

- [Node.js](https://nodejs.org/) v16 o superior
- [npm](https://npmjs.com)

---

## 🚀 Instalación

```bash
# Clona el repositorio
git clone https://github.com/aleff-eco/mexico-api.git
cd mexico-api

# Instala dependencias
npm install
```

1. Copia `.env.example` a `.env` y define:
   ```ini
   PORT=3000
   ```

---

## 🗄️ Actualizar datos

Busca por actualizaciones directamente en el portal de correos de México.
<https://www.correosdemexico.gob.mx/sslservicios/consultacp/CodigoPostal_Exportar.aspx>
<https://www.portal.correosdemexico.com.mx/portal/index.php/envio/consulta-de-codigo-postal>

Ubica el archivo dentro de la carpeta "./public/files"

```bash
mexico-api/
├── public/
├── ├── files/
│   │   ├── CPdescarga.xml
│   │   └── CPdescarga.txt

. . . 

```

### Usando XML
```bash
npm run parse-xml
```

### Usando TXT
```bash
npm run parse-txt
```

Ambos comandos generan `src/db/data.json` con los registros.

---

## 🛠️ Desarrollo

```bash
npm run dev
```

El servidor escuchará en `http://localhost:${process.env.PORT || 3000}`.

---

## 📡 Endpoints disponibles

- `GET /api/codigo-postal/:cp` → Busca código postal exacto
- `GET /api/estado/` → Lista de estados únicos
- `GET /api/estado/:query` → Busca estados por término
- `GET /api/municipio/` y `/api/municipio/:query`
- `GET /api/ciudad/` y `/api/ciudad/:query`
- `GET /api/colonia/` y `/api/colonia/:query`
- `GET /docs` → Documentación Swagger UI interactiva

---

## 📖 Documentación

La documentación interactiva está disponible en `/docs` via Swagger UI.

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
