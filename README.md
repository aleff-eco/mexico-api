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
│   ├── CPdescarga.xml       # Catálogo completo en formato XML
│   └── CPdescarga.txt       # Catálogo en TXT para parsear
├── scripts/
│   ├── parse-xml.js         # Convierte XML a JSON
│   ├── parse-txt.js         # Convierte TXT a JSON
│   └── init-db.js           # Genera una base de datos SQLite a partir de data.json
├── src/
│   ├── app.js               # Configuración y arranque de Express
│   ├── lib/
│   │   └── normalize.js     # Función para quitar acentos y normalizar
│   ├── db/
│   │   ├── data.json        # JSON con los registros actualizados a julio 2025
│   │   └── mexico.db        # Base de datos SQLite generada
│   ├── routes/
│   │   ├── estados.js
│   │   ├── municipios.js
│   │   ├── ciudades.js
│   │   ├── colonias.js
│   │   └── codigos.js
│   └── swagger.js           # Configuración de Swagger/OpenAPI
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

# Genera la base de datos SQLite
npm run init-db

# Copia el ejemplo de variables de entorno
cp .env.example .env
```

Define al menos la variable de puerto en tu `.env`:

```ini
PORT=3000
```

---

## 🗄️ Actualizar datos

Para actualizar los datos del catálogo, descarga la última versión de SEPOMEX y coloca los archivos dentro de `./public` como `CPdescarga.xml` o `CPdescarga.txt`. A continuación ejecuta el script correspondiente para generar `src/db/data.json`:

```bash
# Usando XML
npm run parse-xml

# Usando TXT
npm run parse-txt
```


---

## 🛠️ Desarrollo

```bash
npm run dev
```

El servidor escuchará en `http://localhost:${process.env.PORT || 3000}`.

---

## 📡 Endpoints disponibles

- `GET /api/codigo-postal/:cp` → Busca código postal exacto
- `GET /api/bbox/:estado` → Retorna el bounding box (coordenadas geográficas) de un estado.
- `GET /api/estado/` → Lista de estados únicos
- `GET /api/estado/:query` → Busca estados por término. Soporta `?page` y `?per_page` para paginación.
- `GET /api/municipio/` y `/api/municipio/:query` → Busca municipios por término. Soporta `?page` y `?per_page` para paginación.
- `GET /api/ciudad/` y `/api/ciudad/:query` → Busca ciudades por término. Soporta `?page` y `?per_page` para paginación.
- `GET /api/colonia/` y `/api/colonia/:query` → Busca colonias por término. Soporta `?page` y `?per_page` para paginación.
- `GET /docs` → Documentación Swagger UI interactiva

--- 

## Ejemplo de uso
```bash
curl -X GET "http://localhost:3000/api/codigo-postal/29000" # Obtiene información del código postal 29000
curl -X GET "http://localhost:3000/api/estado?page=1&per_page=10" # Lista los primeros 10 estados
curl -X GET "http://localhost:3000/api/municipio/tuxtla" # Busca municipios que contengan "tuxtla"
curl -X GET "http://localhost:3000/api/bbox/Chiapas" # Obtiene el bounding box de Chiapas
```

---

## 📖 Documentación

La documentación interactiva está disponible en `/docs` vía Swagger UI.

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
