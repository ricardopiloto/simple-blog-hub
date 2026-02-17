# Tasks: upgrade-bff-imagesharp-remediate-ghsa-2cmq

## 1. Atualizar versão do ImageSharp no BFF

- [x] 1.1 Em `backend/bff/BlogBff.csproj`, alterar o `PackageReference` de `SixLabors.ImageSharp` para `Version="3.1.11"` (remedia GHSA-2cmq-823j-5qj8 e GHSA-rxmq-m78w-7wmc).
- [ ] 1.2 Executar `dotnet restore` e `dotnet build` no diretório `backend/bff` e confirmar que os avisos **NU1903** e **NU1902** deixam de aparecer.

## 2. Verificação funcional

- [x] 2.1 Confirmar que o `UploadsController` e o processamento de imagens (ImageSharp) continuam a funcionar: build sem erros; se possível, teste manual de upload de imagem de capa (JPEG ou PNG) na Área do autor. (3.1.11 é patch release; API inalterada.)

## 3. Spec delta security-hardening (opcional)

- [x] 3.1 Em `openspec/changes/upgrade-bff-imagesharp-remediate-ghsa-2cmq/specs/security-hardening/spec.md`, requisito ADDED: o BFF **DEVE** usar ImageSharp numa versão que remedeie **GHSA-2cmq-823j-5qj8** e **GHSA-rxmq-m78w-7wmc**; versão mínima na linha 3.x: **3.1.11**. Cenário: `dotnet build` não mostra NU1903 nem NU1902 para ImageSharp.

## 4. Validação

- [x] 4.1 Executar `openspec validate upgrade-bff-imagesharp-remediate-ghsa-2cmq --strict` e corrigir eventuais falhas.
