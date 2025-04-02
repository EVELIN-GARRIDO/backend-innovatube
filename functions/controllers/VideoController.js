import axios from "axios";
import pool from "../config/db_conn_postgresql.js";
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
// export const searchVideos = async (req, res) => {
//     const { query } = req.query;
//     let allVideos = [];
//     let nextPageToken = null;

//     if (!query) {
//         return res.status(202).json({ message: "¡Se requiere un parámetro de búsqueda!", status: 202 });
//     }

//     try {
//         const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=casino&key=AIzaSyBvz2uXlcEZ_sf3IRDOFOOvuqM6V7YFfac`;

//         if (nextPageToken) {
//             params.pageToken = nextPageToken;
//         }

//         const results = await ytSearch(query);  
//         const videos = results.videos.slice(0, 10).map(video => ({
//             id: video.videoId,
//             title: video.title,
//             link: video.url,
//             channel: video.author.name,
//             views: video.views,
//             duration: video.timestamp,
//             uploadedAt: video.ago,
//             thumbnail: video.thumbnail
//         }));

//         return res.status(200).json({ videos, status: 200 });

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "¡Ha ocurrido un error inesperado en el servidor, intente más tarde!" });
//     }
// }

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
