const { findIdByGuid  } = require("./guidToId.service.js");
const {verificarSesionActiva, verificarRegistroDispositivo, registrarAccesoDispositivo, createNewInformation, updateInformation} = require("./IpInformation.service.js");


module.exports = { 
    findIdByGuid, 
    verificarSesionActiva,
    verificarRegistroDispositivo,
    registrarAccesoDispositivo ,
    createNewInformation,
    updateInformation
};