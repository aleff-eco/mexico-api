import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: " México - API | Aleff Espinosa Cordova",
    version: "1.0.0",
    description:
      "API REST para consultar Códigos Postales de México: estados, municipios, ciudades, colonias y códigos postales.",
  },
  servers: [{ url: "https://mexico-api.onrender.com", description: "Servidor en Render" },{ url: "http://localhost:3000", description: "Servidor local" }],
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
            description: "Datos del código postal",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      d_codigo: { type: "string" },
                      d_asenta: { type: "string" },
                      D_mnpio: { type: "string" },
                      d_estado: { type: "string" },
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
        ],
        responses: {
          200: {
            description: "Lista de estados coincidentes",
            content: {
              "application/json": {
                schema: {
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
          400: { description: "Query demasiado corto" },
          404: { description: "Estado no encontrado" },
        },
      },
    },
    "/api/estado": {
      get: {
        summary: "Listar todos los estados",
        responses: {
          200: {
            description: "Listado de nombres de estados",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" },
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
        ],
        responses: {
          200: {
            description: "Lista de municipios coincidentes",
            content: {
              "application/json": {
                schema: {
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
          400: { description: "Query demasiado corto" },
          404: { description: "Municipio no encontrado" },
        },
      },
    },
    "/api/municipio": {
      get: {
        summary: "Listar todos los municipios",
        responses: {
          200: {
            description: "Listado de nombres de municipios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" },
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
        ],
        responses: {
          200: {
            description: "Lista de ciudades coincidentes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      d_ciudad: { type: "string" },
                      c_cve_ciudad: { type: "string" },
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
    "/api/ciudad": {
      get: {
        summary: "Listar todas las ciudades",
        responses: {
          200: {
            description: "Listado de nombres de ciudades",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" },
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
        ],
        responses: {
          200: {
            description: "Lista de colonias coincidentes",
            content: {
              "application/json": {
                schema: {
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
          400: { description: "Query demasiado corto" },
          404: { description: "Colonia no encontrada" },
        },
      },
    },
    "/api/colonia": {
      get: {
        summary: "Listar todas las colonias",
        responses: {
          200: {
            description: "Listado de nombres de colonias",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
