# Tasks: validate-cors-and-configurable-origins

## 1. Document CORS validation result

- [x] 1.1 In README.md (e.g. in "Variáveis de ambiente" or a short "CORS" note) or in openspec/project.md under Important Constraints, add a statement that **with same-origin deployment** (frontend and BFF served under the same domain, e.g. Caddy serving the SPA and proxying `/bff` to the BFF), **no CORS domain configuration is required** for the application to work; the browser treats requests to the same origin as same-origin and does not apply CORS. Optionally mention that in local dev (frontend and BFF on different ports), CORS applies and the current BFF policy allows it.

## 2. Optional: configurable CORS origins in BFF

- [x] 2.1 In `backend/bff/Program.cs`, replace the inline `UseCors(policy => policy.AllowAnyOrigin()...)` with a policy that: (a) reads from configuration a value for allowed origins (e.g. `Cors:AllowedOrigins` or `Cors__AllowedOrigins`, semicolon-separated list or single origin); (b) when the value is present and non-empty, use `WithOrigins(origins)` (splitting by `;` and trimming) with `AllowAnyMethod()` and `AllowAnyHeader()`; (c) when absent or empty, use `AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()` as today. Ensure no domain (e.g. blog.1nodado.com.br) is hardcoded in code or in appsettings.json that is committed.
- [x] 2.2 Document the optional config key in README (table of env vars or config): e.g. `Cors__AllowedOrigins` (BFF), description "Optional; semicolon-separated list of allowed origins. If set, only these origins are allowed for CORS; set on the server only (do not commit deployment-specific domains to git). If not set, any origin is allowed."

## 3. Optional: deploy doc note

- [x] 3.1 In DEPLOY-UBUNTU-CADDY.md, add a short note (e.g. in "Resumo rápido" or after Caddy section) that for the same-domain setup described, CORS does not require configuration. If the deployer wishes to restrict CORS to the frontend origin, they can set `Cors__AllowedOrigins` (or equivalent) in the BFF environment to the public URL of the site (e.g. `https://blog.1nodado.com.br`); do not commit that value to the repository. Use a generic placeholder in the doc if needed (e.g. "URL do seu domínio").

## 4. Validation

- [x] 4.1 Run `openspec validate validate-cors-and-configurable-origins --strict` and resolve any issues.
- [x] 4.2 Confirm that no file in the repo (that is committed) contains the literal domain blog.1nodado.com.br in CORS or BFF code; only documentation examples or deploy doc may refer to it as an example on the server, and the proposal says the deploy doc can use a placeholder—prefer placeholder in any committed deploy doc to avoid committing the domain.
