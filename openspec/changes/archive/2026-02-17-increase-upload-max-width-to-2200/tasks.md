# Tasks: increase-upload-max-width-to-2200

## 1. Default no BFF (config e código)

- [x] 1.1 Em **backend/bff/appsettings.json**, na secção **Uploads**, alterar **MaxWidth** de `1200` para `2200`.
- [x] 1.2 Em **backend/bff/Controllers/UploadsController.cs**, na chamada `_config.GetValue("Uploads:MaxWidth", 1200)`, alterar o valor default de `1200` para `2200`.

## 2. Documentação de configuração

- [x] 2.1 Em **docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md**, na tabela "Chaves de configuração", alterar o default de **Uploads:MaxWidth** de 1200 para **2200**; na secção "Variáveis de ambiente (BFF)", alterar o exemplo de `1200` para `2200`.

## 3. Documentação de otimização de imagens (opcional)

- [x] 3.1 Em **docs/improvements/IMAGE-OPTIMIZATION.md**, se existir menção a "1200 px" ou "1200px" como largura máxima para capas, atualizar para **2200** (ou referir que o default no BFF é 2200 px).

## 4. Spec delta post-cover-display

- [x] 4.1 Em **openspec/changes/increase-upload-max-width-to-2200/specs/post-cover-display/spec.md**, adicionar um delta (MODIFIED ou ADDED) que indique que a configuração **Uploads:MaxWidth** no BFF tem valor **default 2200** (px) para o redimensionamento de imagens de capa no upload. Cenário: quando o BFF processa um upload de capa com largura superior a 2200 px e não há override de configuração, a imagem é redimensionada para largura máxima 2200 px (proporção mantida).

## 5. Validação

- [x] 5.1 Executar `openspec validate increase-upload-max-width-to-2200 --strict` e corrigir eventuais falhas.
