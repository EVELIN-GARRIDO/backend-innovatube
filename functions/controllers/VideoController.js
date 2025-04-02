import axios from "axios";
import pool from "../config/db_conn_postgresql.js";
import Video from "../models/Video.js";
import yts from "yt-search";
import dotenv from 'dotenv';

dotenv.config();

/**
 * @swagger
 * /videos/search:
 *   get:
 *     summary: Búsqueda de videos
 *     description: Realiza una búsqueda de videos en YouTube basándose en un término de búsqueda.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda para los videos.
 *     responses:
 *       201:
 *         description: ¡Videos devueltos de la búsqueda realizada!
 *       202:
 *         description: ¡Se requiere un parámetro de búsqueda!
 *       500:
 *         description: ¡Error del servidor!
 */
export const searchVideos = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Se requiere un parámetro de búsqueda." });
        }

        const results = await yts(query);
        const videos = results.videos.slice(0, 10).map(video => ({
            id: video.videoId,
            title: video.title,
            link: video.url,
            channel: video.author.name,
            views: video.views,
            duration: video.timestamp,
            uploadedAt: video.ago,
            thumbnail: video.thumbnail
        }));

        return res.status(200).json({ videos });
    } catch (error) {
        console.error("Error al buscar videos:", error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};


/**
 * @swagger
 * /videos/favorite-video:
 *   post:
 *     summary: Guarda un video como favorito
 *     description: Agrega un video a la base de datos y lo marca como favorito.
 *     parameters:
 *       - in: body
 *         name: video
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             title:
 *               type: string
 *             channelTitle:
 *               type: string
 *             link:
 *               type: string
 *             thumbnail:
 *               type: string
 *     responses:
 *       201:
 *         description: ¡Video guardado como favorito exitosamente!
 *       202:
 *         description: ¡Todos los campos son obligatorios!
 *       500:
 *         description: ¡Error del servidor!
 */
export const saveFavoriteVideo = async (req, res) => {
    try {
        const { id, title, channelTitle, link, thumbnail } = req.body;

        if (!id || !title || !channelTitle || !link || !thumbnail) {
            return res.status(202).json({ message: "¡Todos los campos son obligatorios!", status: 202 });
        }

        const video = new Video(id, title, channelTitle, link, thumbnail, true, false);

        const query = `
            INSERT INTO videos (id, title, channel_title, link, thumbnail, is_favorite, is_shared)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET is_favorite = EXCLUDED.is_favorite
            RETURNING *;
        `;

        const values = [video.id, video.title, video.channelTitle, video.link, video.thumbnail, video.isFavorite, video.isShared];

        const result = await pool.query(query, values);

        return res.status(201).json({ message: "¡Video guardado como favorito exitosamente!", video: result.rows[0], status: 201 });

    } catch (error) {
        res.status(500).json({ message: "¡Ha ocurrido un error inesperado en el servidor, intente más tarde!" });
    }
};
