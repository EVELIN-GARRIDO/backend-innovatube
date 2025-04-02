import pool from "../config/db_conn_postgresql.js";
import { verifyPassword, generateToken } from "../middleware/auth.js";

/**
 * @swagger
 * /auth/login-user:
 *   post:
 *     summary: Autenticación de usuario
 *     description: Incio de sesión al sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: ¡Contraseña incorrecta, verifique que los datos sean correctos!
 *       201:
 *         description: ¡Inicio de sesión exitoso!
 *       202:
 *         description: ¡El email o nombre de usuario y contraseña son requeridos!
 *       203:
 *         description: ¡El nombre de usuario o correo no fue encontrado!
 *       500:
 *         description: ¡Error del servidor!
 */
export const loginUser = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(202).json({ message: '¡El email o nombre de usuario y contraseña son requeridos!', status: 202 });
    }

    try {

        const query = "SELECT id, username, email, password_hash FROM users WHERE username = $1 OR email = $1";
        const { rows } = await pool.query(query, [usernameOrEmail]);

        if (rows.length === 0) {
            return res.status(203).json({ message: "¡El nombre de usuario o correo no fue encontrado!", status: 203 });
        }

        const user = rows[0];

        const isPasswordValid = verifyPassword(password, user.password_hash);

        console.log(!isPasswordValid)

        if (!isPasswordValid) {
            return res.status(200).json({ message: "¡Contraseña incorrecta, verifique que los datos sean correctos!", status: 200 });
        }

        const token = generateToken({ id: user.id, username: user.username, email: user.email });

        res.status(201).json({ message: "¡Inicio de sesión exitoso!", token, username: user.username, email: user.email, status: 201 });

    } catch (error) {
        res.status(500).json({ message: "¡Ha ocurrido un error inesperado en el servidor, intente más tarde!" });
    }
};
