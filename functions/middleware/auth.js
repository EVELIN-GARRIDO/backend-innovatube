import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};

export const verifyPassword = (password, hashedPassword) => {
    const hashedInput = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    return hashedInput === hashedPassword;
};

export const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        last_name: user.last_name,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);

    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

export const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token no válido o expirado' });
    }
};