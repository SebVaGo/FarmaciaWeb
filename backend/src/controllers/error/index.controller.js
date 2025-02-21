const errorController = (err, req, res, next) => {
    // Tu lógica de manejo de errores aquí
    res.status(500).json({ error: err.message });
};

module.exports = { errorController };