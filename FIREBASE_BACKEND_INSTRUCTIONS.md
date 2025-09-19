# Firebase Configuratie Backend Instructies

## Overzicht
De frontend app verwacht Firebase configuratie via het endpoint `/api/golfer/firebase-config`. Dit endpoint moet worden geïmplementeerd om push notifications te laten werken.

## Required Endpoint

### Route: `GET /api/golfer/firebase-config`

**Authenticatie:** Bearer token required (zelfde als andere golfer endpoints)

**Response Format:**
```json
{
  "success": true,
  "config": {
    "apiKey": "AIzaSyD7XKwYf0ZZ_dPWs0EtdPaIh-zk7hrMyQ0",
    "authDomain": "golferapp-eda52.firebaseapp.com", 
    "projectId": "golferapp-eda52",
    "storageBucket": "golferapp-eda52.firebasestorage.app",
    "messagingSenderId": "572456838586",
    "appId": "1:572456838586:ios:fef31ac344fdbb846da983",
    "vapidKey": "OPTIONEEL_VOOR_WEB_PUSH"
  }
}
```

## Configuratie Bron

De GoogleService-Info.plist is geplaatst in `storage/firebase/GoogleService-Info.plist` en bevat:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
	<key>API_KEY</key>
	<string>AIzaSyD7XKwYf0ZZ_dPWs0EtdPaIh-zk7hrMyQ0</string>
	<key>GCM_SENDER_ID</key>
	<string>572456838586</string>
	<key>PROJECT_ID</key>
	<string>golferapp-eda52</string>
	<key>STORAGE_BUCKET</key>
	<string>golferapp-eda52.firebasestorage.app</string>
	<key>GOOGLE_APP_ID</key>
	<string>1:572456838586:ios:fef31ac344fdbb846da983</string>
	<key>BUNDLE_ID</key>
	<string>nl.intogolf.dev</string>
</dict>
</plist>
```

## Mapping van plist naar JSON response:

| plist key | JSON key | Value |
|-----------|----------|--------|
| `API_KEY` | `apiKey` | `AIzaSyD7XKwYf0ZZ_dPWs0EtdPaIh-zk7hrMyQ0` |
| `PROJECT_ID` | `projectId` | `golferapp-eda52` |  
| `STORAGE_BUCKET` | `storageBucket` | `golferapp-eda52.firebasestorage.app` |
| `GCM_SENDER_ID` | `messagingSenderId` | `572456838586` |
| `GOOGLE_APP_ID` | `appId` | `1:572456838586:ios:fef31ac344fdbb846da983` |
| - | `authDomain` | `{projectId}.firebaseapp.com` |

## Implementatie Voorbeeld (Laravel)

```php
<?php

namespace App\Http\Controllers\Api\Golfer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FirebaseConfigController extends Controller
{
    public function getConfig(Request $request)
    {
        // Firebase configuratie uit GoogleService-Info.plist
        $config = [
            'apiKey' => 'AIzaSyD7XKwYf0ZZ_dPWs0EtdPaIh-zk7hrMyQ0',
            'authDomain' => 'golferapp-eda52.firebaseapp.com',
            'projectId' => 'golferapp-eda52', 
            'storageBucket' => 'golferapp-eda52.firebasestorage.app',
            'messagingSenderId' => '572456838586',
            'appId' => '1:572456838586:ios:fef31ac344fdbb846da983',
            // vapidKey is optioneel en kan later worden toegevoegd voor web push
            'vapidKey' => env('FIREBASE_VAPID_KEY', '')
        ];

        return response()->json([
            'success' => true,
            'config' => $config
        ]);
    }
}
```

## Route registratie

In `routes/api.php` onder de golfer middleware groep:

```php
Route::middleware(['auth:sanctum', 'golfer'])->group(function () {
    // ... andere golfer routes
    Route::get('/firebase-config', [FirebaseConfigController::class, 'getConfig']);
});
```

## Error Handling

Als er een probleem is, return:

```json
{
  "success": false,
  "message": "Firebase configuration not available",
  "config": null
}
```

## Veiligheid

- **BELANGRIJK**: Deze endpoint bevat gevoelige Firebase configuratie
- Zorg voor proper authenticatie (Bearer token)
- Alleen voor ingelogde golfers beschikbaar
- Overweeg rate limiting

## Testing

Test endpoint met:

```bash
curl -H "Accept: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.dev.intogolf.nl/api/golfer/firebase-config
```

Verwacht response status: `200 OK`

## Volgende Stappen

Na implementatie van dit endpoint:

1. ✅ Frontend app kan Firebase configuratie ophalen
2. ✅ Echte FCM tokens worden gegenereerd  
3. ❗ **APNS configuratie in Firebase Console is nog steeds nodig** voor daadwerkelijke push notification delivery naar iOS devices

## APNS Configuratie Vereist

Voor werkende push notifications moet in Firebase Console nog worden geconfigureerd:
- Project Settings → Cloud Messaging → Apple app configuration
- Upload APNS Authentication Key (.p8) of Certificates (.p12)
- Voor development testing: DEVELOPMENT APNS
- Voor production/TestFlight: PRODUCTION APNS

---

**Priority:** HIGH - Dit endpoint is vereist voordat push notifications kunnen werken op iOS devices.