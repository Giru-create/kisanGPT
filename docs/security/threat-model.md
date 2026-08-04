# KisanGPT Threat Model

## 1. System Boundaries

### In Scope
- Frontend (Next.js application)
- Backend API (FastAPI application)
- AI/LLM integration (Google Gemini)
- Firebase authentication
- File upload processing
- External API integrations (weather, market)

### Out of Scope
- Firebase infrastructure security
- Google Gemini API security
- End-user device security
- Network infrastructure

## 2. Threat Actors

| Actor | Motivation | Capability |
|-------|-----------|------------|
| Malicious User | Abuse AI, extract data | Low-medium |
| Automated Bot | DDos, scraping | Medium |
| Compromised Account | Data access | Medium-high |
| Supply Chain Attacker | Backdoor injection | High |

## 3. Threat Analysis

### 3.1 Prompt Injection

**Description**: Attacker embeds instructions in user messages to manipulate AI behavior.

**Impact**: High - Could bypass restrictions, extract system prompts, or generate harmful content.

**Mitigations**:
- 18+ injection pattern detection
- System prompt isolation with security prefix
- User content wrapping in XML tags
- Output validation before delivery
- Jailbreak detection patterns

### 3.2 Authentication Bypass

**Description**: Attempt to access protected resources without valid credentials.

**Impact**: High - Unauthorized data access.

**Mitigations**:
- Firebase token verification on every request
- Token expiration validation
- Structured auth error handling
- Security event logging

### 3.3 File Upload Abuse

**Description**: Upload malicious or oversized files to cause harm.

**Impact**: Medium - Resource exhaustion, potential code execution.

**Mitigations**:
- 50MB size limit with streaming validation
- Content-Type validation
- Secure file read with size tracking
- No file execution

### 3.4 API Abuse (DDoS)

**Description**: Overwhelm API with excessive requests.

**Impact**: Medium - Service degradation.

**Mitigations**:
- Sliding-window rate limiting
- Per-user and per-IP tracking
- Configurable limits per endpoint
- HTTP 429 responses

### 3.5 Data Leakage

**Description**: Sensitive data exposed in logs or responses.

**Impact**: High - Privacy violation, credential theft.

**Mitigations**:
- Sensitive data auto-masking in logs
- Output validation filters
- No sensitive data in error messages
- Secure logging practices

### 3.6 Supply Chain Attack

**Description**: Compromised dependency introduced.

**Impact**: Critical - Full system compromise.

**Mitigations**:
- Dependency scanning in CI/CD
- Version pinning with ranges
- SBOM generation
- Regular security updates

### 3.7 XSS (Cross-Site Scripting)

**Description**: Malicious scripts injected into frontend.

**Impact**: Medium - Session hijacking, defacement.

**Mitigations**:
- React's built-in XSS protection
- CSP headers
- SafeLink component for external links
- No dangerouslySetInnerHTML with user data

### 3.8 CSRF (Cross-Site Request Forgery)

**Description**: Unauthorized actions performed via authenticated sessions.

**Impact**: Medium - Unauthorized state changes.

**Mitigations**:
- Bearer token authentication (not cookies)
- Same-origin policy headers
- No credential-based CORS

## 4. Risk Assessment

| Threat | Likelihood | Impact | Risk Level |
|--------|-----------|--------|------------|
| Prompt Injection | High | High | Critical |
| Authentication Bypass | Medium | High | High |
| File Upload Abuse | Medium | Medium | Medium |
| API Abuse | High | Medium | High |
| Data Leakage | Low | High | Medium |
| Supply Chain | Low | Critical | High |
| XSS | Low | Medium | Low |
| CSRF | Low | Medium | Low |

## 5. Security Controls Summary

### Preventive Controls
- Authentication requirement
- Input validation
- Rate limiting
- File size limits
- Prompt injection detection
- CSP headers

### Detective Controls
- Security event logging
- Request logging
- Anomaly detection patterns
- Dependency scanning

### Corrective Controls
- Safe fallback responses
- Error handling
- Rate limit enforcement
- Auth failure handling
