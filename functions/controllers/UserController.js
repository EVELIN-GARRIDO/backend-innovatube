import pool from "../config/db_conn_postgresql.js";
import { hashPassword } from "../middleware/auth.js";

/**
 * @swagger
 * /users/register-user:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Manuel"
 *               last_name:
 *                 type: string
 *                 example: "López"
 *               username:
 *                 type: string
 *                 example: "manuellopez"
 *               email:
 *                 type: string
 *                 example: "manuellopez001@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: ¡Usuario registrado con éxito!
 *       204:
 *         description: ¡Todos los campos son obligatorios!
 *       500:
 *         description: ¡Error del servidor!
 */
export const registerUser = async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;

    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(204).json({ message: "¡Todos los campos son obligatorios!" });
    }

    try {
        const password_hash = hashPassword(password);

        const query = `
            INSERT INTO users (first_name, last_name, username, email, password_hash, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;
        `;

        const values = [first_name, last_name, username, email, password_hash];
        await pool.query(query, values);

        res.status(201).json({ message: "¡El usuario ha sido registrado con éxito!" });

    } catch (error) {
        res.status(500).json({ message: "¡Ha ocurrido un error inesperado en el servidor, intente más tarde!" });
    }
};
