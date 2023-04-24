'use strict';

/**
 * proyecto controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::proyecto.proyecto', ({ strapi }) => ({
//     async create(ctx) {
//     const currentUserId = ctx.state.user.id
//     ctx.request.body.data.users = [currentUserId]
//     const { data, meta } = await super.create(ctx);
//     return { data, meta };
//     }
//     }));

    module.exports = createCoreController('api::proyecto.proyecto', ({ strapi }) => ({
        async create(ctx) {
          const currentUserId = ctx.state.user.id;
      
          // Obtener el correo electrónico del usuario que se quiere asignar como creador
          const { userAsigned } = ctx.request.body.data;
      
          // Buscar al usuario en la base de datos por su correo electrónico
        //   const [user] = await strapi.query('user', 'users-permissions').find({ email: userAsigned });
        const entry = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: userAsigned }});
  
          if (!entry) {
            return ctx.badRequest('El usuario especificado no existe en la base de datos');
          }    
          ctx.request.body.data.users = [currentUserId, entry.id];               
          const { data, meta } = await super.create(ctx);
          return { data, meta };
        }
      }));