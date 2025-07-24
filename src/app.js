import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import statesRoutes from "./routes/states.js";
import citiesRoutes from "./routes/cities.js";
import municipalitiesRoutes from "./routes/municipalities.js";
import coloniesRoutes from "./routes/colonies.js";
import codesRoutes from "./routes/codes.js";

import { setupSwagger } from './swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/estado", statesRoutes);
app.use("/api/ciudad", citiesRoutes);
app.use("/api/municipio", municipalitiesRoutes);
app.use("/api/colonia", coloniesRoutes);
app.use("/api/codigo-postal", codesRoutes);


// app.get("/", (req, res) => {
//   res.json({ message: "Mexico API Activa"});
// });

app.use('/', express.static(path.join(process.cwd(), 'public')));

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});



// ALEFF ESPINOSA CORDOVA