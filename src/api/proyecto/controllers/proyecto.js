'use strict';

/**
 * proyecto controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::proyecto.proyecto', ({ strapi }) => ({
  async create(ctx) {
    const currentUserId = ctx.state.user.id;

    // Obtener el correo electrónico del usuario que se quiere asignar como creador
    const { userAsigned } = ctx.request.body.data;

    const entry = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: userAsigned } });

    if (!entry) {
      return ctx.badRequest('El usuario especificado no existe en la base de datos');
    }
    ctx.request.body.data.users = [currentUserId, entry.id];
    const { data, meta } = await super.create(ctx);
    return { data, meta };
  },
  async findOne(ctx) {
    const currentUserId = ctx.state.user.id;
    const projectId = ctx.params.id;

    const project = await strapi.query('api::proyecto.proyecto').findOne({ where: { id: projectId, users: currentUserId } });

    if (!project) {
      return ctx.notFound('El proyecto especificado no existe o no está asignado al usuario');
    }

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
}));