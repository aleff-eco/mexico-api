import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "México - API | Aleff Espinosa Cordova",
    version: "1.0.0",
    description: `API REST para consultar Códigos Postales de México: estados, municipios, ciudades, colonias y códigos postales.

Integración de un endpoint dedicado para obtener códigos postales, así como endpoints para obtener bounding boxes de estados (Latitud y Longitud minima y maxima).


----------------------------------------------------------------------------------------------------------
Todos los endpoints de búsqueda por texto permiten búsqueda por incidencia (no es necesario escribir el nombre completo)
siempre que el término tenga al menos 4 caracteres.

Ejemplo de uso:
\n devuelve todos los estados cuyo nombre contiene “chia” y todos sus municipios y codigos postales.
- GET /api/estado/chia

----------------------------------------------------------------------------------------------------------
Se integra paginación en las respuestas mediante los parámetros opcionales:
- \`page\` (número de página, por defecto 1)
- \`per_page\` (resultados por página, por defecto 50, máximo 200)

Ejemplo de uso:
\n devuelve la primera página de estados cuyo nombre contiene “chia” y todos sus municipios y codigos postales. Con una paginación de 20 elementos por página.
- GET /api/estado/chia?page=1&per_page=20

Ejemplo de uso:
\n devuelve la primera página de estados cuyo nombre contiene “chia” y todos sus municipios y codigos postales. Con una paginación de 50 elementos por página (Por defecto).
- GET /api/estado/chia?page=1 

Ejemplo de uso:
\n devuelve todos los estados cuyo nombre contiene “chia” y todos sus municipios y codigos postales. Con una paginación de 100 elementos por página.
- GET /api/estado/chia?per_page=100
`,
  },
  servers: [
    {
      url: "https://mexico-api.devaleff.com",
      description: "Servidor",
    },
    {
      url: "https://mexico-api.onrender.com",
      description: "Servidor en Render",
    },
    { url: "http://localhost:3000", description: "Servidor local" },
  ],
  paths: {
    "/api/codigo-postal/{cp}": {
      get: {
        summary: "Buscar código postal exacto",
        parameters: [
          {
            name: "cp",
            in: "path",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9]{5}$",
              example: "29000",
              minLength: 5,
              maxLength: 5,
            },
            description: "Código postal de 5 dígitos",
          },
        ],
        responses: {
          200: {
            description: "Datos del código postal (paginado)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_codigo: { type: "string" },
                          d_asenta: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Código postal inválido" },
          404: { description: "Código postal no encontrado" },
        },
      },
    },

    "/api/bbox/{estado}": {
      get: {
        summary: "Obtener bounding box de un estado",
        parameters: [
          {
            name: "estado",
            in: "path",
            required: true,
            schema: { type: "string", example: "aguascalientes" },
            description: "Nombre del estado (sin acentos ni espacios)",
          },
        ],
        responses: {
          200: {
            description: "Coordenadas del bounding box",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    min_lat: { type: "number" },
                    max_lat: { type: "number" },
                    min_lng: { type: "number" },
                    max_lng: { type: "number" },
                  },
                },
              },
            },
          },
          404: { description: "Estado no encontrado" },
        },
      },
    },

    "/api/estado": {
      get: {
        summary: "Listar todos los estados (agrupados)",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de estados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_codigo: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                          D_mnpio: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/estado/{query}": {
      get: {
        summary: "Buscar estados por texto",
        parameters: [
          {
            name: "query",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 4 },
            description: "Término de búsqueda (mínimo 4 caracteres)",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de estados coincidentes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_codigo: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_asenta: { type: "string" },
                          d_tipo_asenta: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Query demasiado corto" },
          404: { description: "Estado no encontrado" },
        },
      },
    },

    "/api/municipio": {
      get: {
        summary: "Listar todos los municipios (agrupados)",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de municipios",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_codigo: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_asenta: { type: "string" },
                          d_tipo_asenta: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/municipio/{query}": {
      get: {
        summary: "Buscar municipios por texto",
        parameters: [
          {
            name: "query",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 4 },
            description: "Término de búsqueda (mínimo 4 caracteres)",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de municipios coincidentes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_codigo: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_asenta: { type: "string" },
                          d_tipo_asenta: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Query demasiado corto" },
          404: { description: "Municipio no encontrado" },
        },
      },
    },

    "/api/ciudad": {
      get: {
        summary: "Listar todas las ciudades (agrupadas)",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de ciudades",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_ciudad: { type: "string" },
                          d_estado: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_codigo: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ciudad/{query}": {
      get: {
        summary: "Buscar ciudades por texto",
        parameters: [
          {
            name: "query",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 4 },
            description: "Término de búsqueda (mínimo 4 caracteres)",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de ciudades coincidentes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_ciudad: { type: "string" },
                          d_estado: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_codigo: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Query demasiado corto" },
          404: { description: "Ciudad no encontrada" },
        },
      },
    },

    "/api/colonia": {
      get: {
        summary: "Listar todas las colonias (agrupadas)",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de colonias",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_asenta: { type: "string" },
                          d_tipo_asenta: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                          d_codigo: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/colonia/{query}": {
      get: {
        summary: "Buscar colonias por texto",
        parameters: [
          {
            name: "query",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 4 },
            description: "Término de búsqueda (mínimo 4 caracteres)",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "Número de página",
          },
          {
            name: "per_page",
            in: "query",
            schema: { type: "integer", default: 50, minimum: 1, maximum: 200 },
            description: "Resultados por página",
          },
        ],
        responses: {
          200: {
            description: "Listado paginado de colonias coincidentes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        per_page: { type: "integer" },
                        total: { type: "integer" },
                        total_pages: { type: "integer" },
                      },
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          d_asenta: { type: "string" },
                          d_tipo_asenta: { type: "string" },
                          D_mnpio: { type: "string" },
                          d_estado: { type: "string" },
                          d_ciudad: { type: "string" },
                          d_codigo: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Query demasiado corto" },
          404: { description: "Colonia no encontrada" },
        },
      },
    },
  },
};

export function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
