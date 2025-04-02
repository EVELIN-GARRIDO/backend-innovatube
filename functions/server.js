import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import userRoutes from './routes/UserRoute.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const __dirname = path.join(process.cwd(), 'functions');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "InnovaTube API",
            version: "1.0.0",
            description: "API documentation for InnovaTube",
        },
    },
    apis: [path.join(__dirname, './controllers/*.js')],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use('/users', userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

