# 🔐 Backend reCAPTCHA Implementation Guide

## Overview

Dit document beschrijft hoe de backend reCAPTCHA validatie moet implementeren voor de verbeterde frontend implementatie.

## Frontend Changes Made

### ✅ **Implemented Frontend Improvements:**
- 🔧 **Herbruikbare composable** (`src/composables/useRecaptcha.js`)
- 🎯 **Extended to critical flows**: Login, Reservations, Password Reset
- ⚙️ **Configurable thresholds** via environment variables
- 📱 **Mobile detection** with fallback strategy
- 📊 **Better logging** and error handling

### **Frontend Endpoints Now Sending reCAPTCHA:**
```javascript
// These endpoints now include 'captcha' field when on web:
POST /api/golfer/login          // action: "login"
POST /api/golfer/booking        // action: "reservation" 
POST /api/golfer/reset-password // action: "password_reset"
```

## Required Backend Implementation

### **1. reCAPTCHA Validation Middleware**

Create Laravel middleware for reCAPTCHA verification:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerifyRecaptcha
{
    public function handle(Request $request, Closure $next, $action = null)
    {
        // Skip validation for mobile apps (they don't send reCAPTCHA)
        $userAgent = $request->header('User-Agent', '');
        $isMobileApp = $this->isMobileApp($request);
        
        if ($isMobileApp) {
            // Apply alternative rate limiting for mobile
            return $this->handleMobileRateLimit($request, $next, $action);
        }
        
        // Web requests should have reCAPTCHA token
        $captchaToken = $request->input('captcha');
        
        if (!$captchaToken) {
            return response()->json([
                'error' => 'reCAPTCHA verification required',
                'message' => 'Beveiligingsvalidatie vereist'
            ], 400);
        }
        
        if (!$this->verifyRecaptcha($captchaToken, $action, $request->ip())) {
            Log::warning('reCAPTCHA verification failed', [
                'ip' => $request->ip(),
                'action' => $action,
                'user_agent' => $userAgent
            ]);
            
            return response()->json([
                'error' => 'reCAPTCHA verification failed',
                'message' => 'Beveiligingsvalidatie mislukt'
            ], 400);
        }
        
        return $next($request);
    }
    
    private function verifyRecaptcha($token, $expectedAction, $remoteIp)
    {
        $secretKey = config('services.recaptcha.secret_key');
        
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => $remoteIp
        ]);
        
        $result = $response->json();
        
        if (!$result['success']) {
            Log::warning('reCAPTCHA API returned error', [
                'errors' => $result['error-codes'] ?? [],
                'action' => $expectedAction
            ]);
            return false;
        }
        
        // Check score threshold (reCAPTCHA v3)
        $minScore = config('services.recaptcha.min_score', 0.5);
        if (isset($result['score']) && $result['score'] < $minScore) {
            Log::warning('reCAPTCHA score too low', [
                'score' => $result['score'],
                'threshold' => $minScore,
                'action' => $expectedAction
            ]);
            return false;
        }
        
        // Verify action matches (optional but recommended)
        if ($expectedAction && isset($result['action']) && $result['action'] !== $expectedAction) {
            Log::warning('reCAPTCHA action mismatch', [
                'expected' => $expectedAction,
                'received' => $result['action']
            ]);
            return false;
        }
        
        return true;
    }
    
    private function isMobileApp($request)
    {
        // Check for custom header that mobile app sends
        $appIdentifier = $request->header('X-App-Identifier');
        
        return !empty($appIdentifier) && str_starts_with($appIdentifier, 'nl.intogolf.');
    }
    
    private function handleMobileRateLimit($request, $next, $action)
    {
        // Implement stricter rate limiting for mobile apps
        $key = 'mobile_rate_limit:' . $request->ip() . ':' . $action;
        $attempts = cache()->get($key, 0);
        
        $maxAttempts = match($action) {
            'login' => 5,           // 5 login attempts per minute
            'reservation' => 3,      // 3 reservations per minute  
            'password_reset' => 2,   // 2 password resets per minute
            default => 10
        };
        
        if ($attempts >= $maxAttempts) {
            return response()->json([
                'error' => 'Too many attempts',
                'message' => 'Te veel pogingen. Probeer later opnieuw.',
                'retry_after' => 60
            ], 429);
        }
        
        // Increment counter
        cache()->put($key, $attempts + 1, now()->addMinutes(1));
        
        return $next($request);
    }
}
```

### **2. Configuration**

Add to `config/services.php`:

```php
'recaptcha' => [
    'site_key' => env('RECAPTCHA_SITE_KEY'),
    'secret_key' => env('RECAPTCHA_SECRET_KEY'),
    'min_score' => env('RECAPTCHA_MIN_SCORE', 0.5),
],
```

Add to `.env`:
```env
RECAPTCHA_SITE_KEY=6Ld9tF4lAAAAAOsTO9S3a80WqVXnin1I_ajPSMn8
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_MIN_SCORE=0.5
```

### **3. Route Protection**

Apply middleware to protected routes:

```php
// routes/api.php
Route::group(['middleware' => ['api']], function () {
    
    // Login with reCAPTCHA protection
    Route::post('golfer/login', [AuthController::class, 'login'])
        ->middleware('recaptcha:login');
    
    // Reservation with reCAPTCHA protection  
    Route::post('golfer/booking', [BookingController::class, 'store'])
        ->middleware(['auth:api', 'recaptcha:reservation']);
    
    // Password reset with reCAPTCHA protection
    Route::post('golfer/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('recaptcha:password_reset');
        
});
```

### **4. Mobile App Headers**

Ensure mobile apps send identifying headers:

```javascript
// In your axios interceptor (already partially implemented):
if (Platform.is.ios || Platform.is.android) {
    config.headers.common['X-App-Identifier'] = process.env.VUE_APP_ID;
    config.headers.common['X-App-Version'] = process.env.VUE_APP_VERSION;
    config.headers.common['X-Platform'] = Platform.is.ios ? 'ios' : 'android';
}
```

### **5. Logging & Analytics**

Add comprehensive logging for security monitoring:

```php
// In your controllers, log security events
Log::info('Authentication attempt', [
    'email' => $request->email,
    'ip' => $request->ip(),
    'user_agent' => $request->header('User-Agent'),
    'has_recaptcha' => !empty($request->captcha),
    'is_mobile_app' => $this->isMobileApp($request),
    'success' => $success,
    'timestamp' => now()
]);
```

## Testing

### **Manual Testing:**
1. Test web login with reCAPTCHA
2. Test mobile app login without reCAPTCHA
3. Test reservation flow
4. Test rate limiting on mobile
5. Test with low reCAPTCHA scores

### **Automated Testing:**
```php
// Feature test example
public function test_login_requires_recaptcha_on_web()
{
    $response = $this->postJson('/api/golfer/login', [
        'email' => 'test@example.com',
        'password' => 'password'
        // Missing 'captcha' field
    ]);
    
    $response->assertStatus(400)
            ->assertJson(['error' => 'reCAPTCHA verification required']);
}

public function test_mobile_app_login_bypasses_recaptcha()
{
    $response = $this->withHeaders([
        'X-App-Identifier' => 'nl.intogolf.test'
    ])->postJson('/api/golfer/login', [
        'email' => 'test@example.com', 
        'password' => 'password'
        // No captcha needed for mobile
    ]);
    
    $response->assertStatus(200);
}
```

## Security Considerations

1. **Secret Key Security**: Never expose secret key in frontend
2. **Score Thresholds**: Tune based on false positive rates
3. **Rate Limiting**: Different limits for different actions
4. **Logging**: Monitor for abuse patterns
5. **Fallbacks**: Graceful degradation when reCAPTCHA fails

## Monitoring

Set up alerts for:
- High rate limiting hits
- reCAPTCHA verification failures
- Score trends below threshold
- Suspicious IP patterns

## Next Steps

1. ✅ **Implement backend middleware**
2. ✅ **Configure environment variables**  
3. ✅ **Apply to protected routes**
4. ✅ **Test thoroughly**
5. ✅ **Monitor in production**

This implementation provides comprehensive bot protection while maintaining good UX for legitimate users.