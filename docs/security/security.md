# KisanGPT Security Documentation

## Overview

KisanGPT implements a multi-layered security architecture across the frontend, backend, and infrastructure layers.

## Security Architecture

### 1. Authentication & Authorization
- Firebase Admin SDK for identity verification
- Bearer token-based API authentication
- All data endpoints require valid authentication
- Token expiration and validation on every request

### 2. Input Validation
- Pydantic v2 schemas for all API inputs
- Request size limits (50MB max upload)
- Query parameter validation with bounds
- Regex patterns for enum-like fields

### 3. AI Safety
- Prompt injection detection (18+ patterns)
- Jailbreak detection
- Harmful content filtering
- Output validation before user delivery
- Sensitive data filtering in LLM responses
- Safe fallback responses

### 4. Rate Limiting
- Sliding-window rate limiting per endpoint
- Per-user and per-IP tracking
- Configurable limits via environment variables
- HTTP 429 responses with Retry-After headers

### 5. Security Headers
- HSTS (2 years, includeSubDomains, preload)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (camera, microphone, geolocation disabled)
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin
- Cross-Origin-Embedder-Policy: credentialless

### 6. Content Security Policy
- Strict CSP via Next.js headers
- Script, style, image, connect source restrictions
- Frame ancestors: none
- Upgrade insecure requests

### 7. Secure Logging
- Sensitive data auto-masking in logs
- API keys, tokens, passwords redacted
- JWT tokens truncated
- File contents never logged

### 8. Security Monitoring
- Structured JSON security event logging
- Authentication failure tracking
- Rate limit violation logging
- Injection attempt detection
- Suspicious request identification

### 9. Container Security
- Non-root user in production
- Health checks enabled
- Minimal base images
- Multi-stage builds
- No cache in pip/npm installs

### 10. CI/CD Security
- CodeQL analysis (JavaScript + Python)
- Trivy filesystem and container scanning
- Gitleaks secret scanning
- Dependency review on PRs
- SBOM generation

## Security Controls Matrix

| Control | Status | Implementation |
|---------|--------|----------------|
| Authentication | Implemented | Firebase Admin SDK |
| Authorization | Implemented | Per-endpoint auth dependency |
| Input Validation | Implemented | Pydantic v2 schemas |
| Rate Limiting | Implemented | Sliding window middleware |
| CSP | Implemented | Next.js headers |
| HSTS | Implemented | Both frontend and backend |
| Logging | Implemented | Structured logging with filters |
| Monitoring | Implemented | Security event logger |
| Container Security | Implemented | Non-root, health checks |
| CI/CD | Implemented | CodeQL, Trivy, Gitleaks |

## Threat Model

### External Threats
- Prompt injection attacks on AI endpoints
- Brute force authentication attempts
- File upload abuse
- API abuse (DDoS)
- Supply chain attacks

### Mitigations
- AI guardrails with pattern detection
- Rate limiting per user/IP
- File size and type validation
- Request logging and monitoring
- Dependency scanning in CI/CD

## Incident Response

1. **Detection**: Security monitoring logs all events
2. **Analysis**: Structured JSON enables SIEM ingestion
3. **Response**: Rate limiting and auth blocking
4. **Recovery**: Deployment rollback procedures
5. **Lessons Learned**: Post-incident documentation

## Compliance Considerations

- OWASP Top 10 coverage
- No PII stored beyond Firebase auth
- Data minimization in logs
- Secure defaults in configuration
