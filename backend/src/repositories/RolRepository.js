const Rol = require('../models/Rol');

class RolRepository {

    //Encontrar rol por id
    async findById(id, transaction = null) {
        return await Rol.findByPk(id, {
            attributes: ['id', 'nombre', 'descripcion'], // Incluye los campos que necesites
            transaction
        });
    }

    //Encontrar todos los roles
    async findAll(transaction = null) {
        return await Rol.findAll({
            attributes: ['id', 'nombre', 'descripcion'],
            transaction
        });
    }

    //Crear nuevo rol
    async findOrCreate(nombre, descripcion, transaction = null) {
        const [newRole, created] = await Rol.findOrCreate({
            where: { nombre },
            defaults: { descripcion },
            transaction
        });
        return { newRole, created };
    }

    //Actualizar rol
    async updateRole(id, roleData, transaction = null) {
        const role = await Rol.findByPk(id, { transaction });
        if (!role) return null;
        await role.update(roleData, { transaction });
        return role;
    }

    async deleteRole(id, transaction = null) {
        return await Rol.destroy({ where: { id }, transaction });
    }

}

module.exports = new RolRepository();
