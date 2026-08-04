# KisanGPT Security Headers

## Backend Security Headers (FastAPI)

Applied via `SecurityHeadersMiddleware` on every API response.

### Strict-Transport-Security
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
- Forces HTTPS for 2 years
- Includes all subdomains
- Ready for HSTS preload list

### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
- Prevents MIME-type sniffing
- Forces declared content types

### X-Frame-Options
```
X-Frame-Options: DENY
```
- Prevents clickjacking
- Blocks all iframe embedding

### Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
- Sends full URL for same-origin
- Sends origin only for cross-origin
- No referrer for downgrade

### Permissions-Policy
```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```
- Disables camera access
- Disables microphone access
- Disables geolocation

### Cross-Origin Policies
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```
- Isolates browsing context
- Prevents cross-origin reads
- Enables cross-origin isolation

## Frontend Security Headers (Next.js)

Configured in `next.config.ts`.

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://*.googleapis.com https://*.google.com;
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

### Additional Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

## Header Testing

### Manual Verification
```bash
# Check backend headers
curl -I http://localhost:8000/api/v1/health

# Check frontend headers
curl -I http://localhost:3000
```

### Expected Headers
- All security headers present
- No server version disclosure
- No X-Powered-By header
- Content-Type properly set

## Browser Support

| Header | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| HSTS | 4+ | 4+ | 5+ | 12+ |
| CSP | 25+ | 23+ | 7+ | 14+ |
| X-Frame-Options | 4+ | 3.6+ | 5+ | 12+ |
| Permissions-Policy | 96+ | 101+ | 15.4+ | 96+ |
