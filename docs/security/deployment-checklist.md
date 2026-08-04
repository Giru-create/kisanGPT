# KisanGPT Production Deployment Checklist

## Pre-Deployment

### Environment Configuration
- [ ] `DEBUG=False` in production
- [ ] `GEMINI_API_KEY` set and valid
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` set and valid
- [ ] `ALLOWED_ORIGINS` configured for production domain
- [ ] `TRUSTED_HOSTS` configured
- [ ] `SESSION_COOKIE_SECURE=True`
- [ ] Rate limit values configured appropriately

### Security Headers
- [ ] HSTS enabled (2 year max-age)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy restrictive
- [ ] CSP headers configured

### Authentication
- [ ] Firebase project configured
- [ ] Service account key secured
- [ ] Token verification working
- [ ] Auth error handling tested

### Rate Limiting
- [ ] Rate limiting enabled
- [ ] Limits appropriate for load
- [ ] Rate limit headers working
- [ ] 429 responses formatted correctly

## Deployment

### Container
- [ ] Docker image built with non-root user
- [ ] Health check endpoint responding
- [ ] No secrets in image layers
- [ ] Multi-stage build used
- [ ] Base image up to date

### CI/CD
- [ ] CodeQL analysis passing
- [ ] Trivy scans clean
- [ ] No secrets in code
- [ ] Dependencies reviewed

### Network
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Trusted hosts configured
- [ ] No exposed debug endpoints

## Post-Deployment

### Verification
- [ ] Health check endpoint responds
- [ ] Authentication flow working
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] CSP headers correct

### Monitoring
- [ ] Security event logging active
- [ ] Error tracking configured
- [ ] Rate limit monitoring
- [ ] Auth failure alerts

### Backup
- [ ] Database backups configured
- [ ] Recovery procedure documented
- [ ] Rollback procedure tested

## Security Commands

### Backend Validation
```bash
ruff format --check .
ruff check .
pytest
```

### Frontend Validation
```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Container Security
```bash
# Scan container image
trivy image kisangpt-backend:latest

# Check for secrets
gitleaks detect
```

## Emergency Procedures

### Security Incident
1. Identify affected systems
2. Block malicious IPs if applicable
3. Rotate compromised credentials
4. Review security logs
5. Document incident
6. Deploy fixes

### Rollback
1. Identify last known good version
2. Deploy previous container image
3. Verify services restored
4. Notify stakeholders
