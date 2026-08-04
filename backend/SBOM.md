# KisanGPT Backend — Software Bill of Materials (SBOM)
# Generated: 2026-08-04
# Format: CycloneDX-style dependency listing

## Production Dependencies

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| fastapi | >=0.115.0 | MIT | Web framework |
| uvicorn[standard] | >=0.34.0 | BSD-3 | ASGI server |
| pydantic | >=2.10.0 | MIT | Data validation |
| pydantic-settings | >=2.7.0 | MIT | Settings management |
| python-multipart | >=0.0.18 | BSD-2 | File upload support |
| firebase-admin | >=7.5.0 | Apache-2.0 | Firebase authentication |
| google-genai | >=1.0.0 | Apache-2.0 | Gemini AI integration |
| httpx | >=0.28.0 | BSD-3 | Async HTTP client |

## Development Dependencies

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| pytest | >=8.3.0 | MIT | Testing framework |
| pytest-asyncio | >=0.24.0 | Apache-2.0 | Async test support |
| httpx | >=0.28.0 | BSD-3 | Test HTTP client |
| ruff | >=0.16.0 | MIT | Linting & formatting |

## Security Notes

- All production dependencies use permissive licenses (MIT, BSD, Apache-2.0)
- No GPL or copyleft dependencies
- Minimum version pinning used (>=) to allow security patches
- Dev dependencies separated via [project.optional-dependencies]
- No unused packages detected
- All packages audited via `pip audit` (run in CI)
