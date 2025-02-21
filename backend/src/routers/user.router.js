const express = require('express');
const {typeUserController} = require('../controllers/user/index.controller.js');

const userRouter = express.Router();

/**
 * @swagger
 * /api/user/type/create:
 *   post:
 *     summary: Crear un nuevo tipo de usuario
 *     description: Crea un nuevo rol de usuario con un nombre y descripción.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_name
 *               - description
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: "Admin"
 *               description:
 *                 type: string
 *                 example: "Rol de administrador"
 *     responses:
 *       201:
 *         description: Tipo de usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 role_name:
 *                   type: string
 *                   example: "Admin"
 *                 description:
 *                   type: string
 *                   example: "Rol de administrador"
 *       400:
 *         description: Error en los datos enviados
 */

userRouter.post('/type/create', typeUserController);

module.exports = userRouter;