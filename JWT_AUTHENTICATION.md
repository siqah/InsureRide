# JWT Authentication Documentation (Spring Security 6.x & JJWT 0.12.5)

Stateless JWT (JSON Web Token) authentication has been integrated into the InsureRide application utilizing Spring Security 6.x filter chains and the modern JJWT `0.12.5` API.

---

## 1. Authentication Architecture

Requests to the protected endpoints are processed by a standard security filter chain:

```mermaid
graph TD
    A[HTTP Request] --> B[JwtAuthenticationFilter]
    B -->|No Token/Invalid Token| C[Reject/Proceed to next filter]
    B -->|Valid Bearer Token| D[Extract subject & claims]
    D --> E[Load UserDetails from UserDetailsService]
    E --> F[Establish SecurityContextHolder Authentication]
    F --> G[Dispatch to Controller]
```

### Core Components
1. **`JwtService.java`**: Implements helper mechanics for signing and parsing JWT payloads using JJWT `0.12.5` APIs. Uses `Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()`.
2. **`JwtAuthenticationFilter.java`**: A custom `OncePerRequestFilter` that intercepts all requests, extracts standard Bearer tokens from the `Authorization` header, and configures the Spring Security Authentication context.
3. **`HospitalUserDetails.java`**: A custom wrapper class adapting `Hospital` database entities to standard Spring Security `UserDetails`.
4. **`ApplicationConfig.java`**: Instantiates security beans: `UserDetailsService`, `PasswordEncoder` (BCrypt), and `AuthenticationProvider` (DaoAuthenticationProvider).
5. **`SecurityConfiguration.java`**: Enforces a stateless session policy, permits anonymous requests to public routes (worker portals, hospital registration, and login), and configures CORS pre-flight support.

---

## 2. API Flow

### **Hospital Session Exchange (Login)**
- **Endpoint**: `POST /api/hospitals/login`
- **Request Body**:
  ```json
  {
    "apiKey": "TEST-API-KEY-12345"
  }
  ```
- **Response Payload (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJURVNULUFQSS1LRVktMTIzNDUiLCJpYXQiOjE3ODMwNzkwMzEsImV4cCI6MTc4MzE2NTQzMX0.mvzbHlGRDiJEusmNbvCoYKvf8H1bof5BNrKMfz0NDaA"
  }
  ```

---

## 3. Resolving Authentication Context inside Controllers

Endpoints extract details directly from the Spring Security authenticated context rather than parsing headers:

```java
@GetMapping("/me")
public ResponseEntity<HospitalResponseDTO> getHospitalDetails() {
    UsernamePasswordAuthenticationToken authentication = 
            (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

    HospitalUserDetails userDetails = (HospitalUserDetails) authentication.getPrincipal();
    Hospital hospital = userDetails.getHospital();
    
    HospitalResponseDTO response = hospitalService.getHospitalDetailsById(hospital.getId());
    return ResponseEntity.ok(response);
}
```

---

## 4. Security Configuration White-list

- **Public Endpoints**:
  - `/api/hospitals/login` & `/api/hospitals/register`
  - `/api/workers/**` (Worker lookup and coverage details)
  - `/api/payments/**` (Rider premium payment portal)
  - `OPTIONS /**` (Pre-flight CORS options validation)
- **Protected Endpoints**:
  - `/api/claims/**` (Claim verification and logs history)
  - `/api/hospitals/me` (Hospital profile retrieval)
