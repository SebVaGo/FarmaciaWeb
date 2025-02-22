const { createRol  } = require("../typeUser/create.service.js");
const { findAll , findOne } = require("../typeUser/find.service.js");
const { deleteRole } = require("../typeUser/delete.service.js");
const { alterRole } = require("../typeUser/alter.service.js");

module.exports = { createRol , findAll , findOne , deleteRole , alterRole};