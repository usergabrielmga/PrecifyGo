const db = require("../config/database");

exports.updateLogo = async (logoUrl) => {
  await db.query(
    `UPDATE emissor SET logotipo = $1 WHERE id_emissor = 1`,
    [logoUrl]
  );
};