import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import estadosRoutes from "./routes/estados.js";
import ciudadesRoutes from "./routes/ciudades.js";
import municipiosRoutes from "./routes/municipios.js";
import coloniasRoutes from "./routes/colonias.js";
import codigosRoutes from "./routes/codigos.js";
import path from 'path';

import { setupSwagger } from './swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/estado", estadosRoutes);
app.use("/api/ciudad", ciudadesRoutes);
app.use("/api/municipio", municipiosRoutes);
app.use("/api/colonia", coloniasRoutes);
app.use("/api/codigo-postal", codigosRoutes);


// app.get("/", (req, res) => {
//   res.json({ message: "Mexico API Activa"});
// });

app.use('/', express.static(path.join(process.cwd(), 'public')));

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});



// ALEFF ESPINOSA CORDOVA