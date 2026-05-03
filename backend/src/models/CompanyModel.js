const db = require("../config/database");

exports.updateLogo = async (logoUrl) => {
  await db.execute(
    `UPDATE emissor SET LogoTipo = ? WHERE Id_emissor = 1`,
    [logoUrl]
  );
};
