-- Migración a login centralizado del Core (SSO).
-- El taller deja de tener login propio: la identidad viene del Core.
-- Se mapea organizacion del Core -> Empresa, y usuario del Core -> Usuario.

ALTER TABLE "empresas" ADD COLUMN "sso_org_id" TEXT;
ALTER TABLE "usuarios" ADD COLUMN "sso_sub" TEXT;

CREATE UNIQUE INDEX "empresas_sso_org_id_key" ON "empresas"("sso_org_id");
CREATE UNIQUE INDEX "usuarios_sso_sub_key" ON "usuarios"("sso_sub");