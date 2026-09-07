const prisma = require('../config/database');

function registrarAuditoria(acao, entidade = null) {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user ? req.user.id : null,
              acao,
              entidade,
              entidadeId: req.params.id || null,
              ip: req.ip,
            },
          });
        } catch (err) {
          console.error('Falha ao registrar auditoria:', err.message);
        }
      }
    });
    next();
  };
}

module.exports = { registrarAuditoria };
