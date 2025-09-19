/**
 * Push Notification Service
 *
 * Handles all push notification functionality including:
 * - Device token registration/refresh/unregister
 * - Notification settings management
 * - Deep link handling
 * - Testing functionality
 */

class PushNotificationService {
  constructor(vueInstance, router, axios) {
    this.vueInstance = vueInstance;
    this.store = vueInstance.$store;
    this.router = router;
    this.axios = axios;
    this.isInitialized = false;
    this.currentToken = null;
    this.pushNotifications = null;
  }

  /**
   * Initialize push notifications
   */
  async initialize() {
    console.log('🚀 PushNotificationService.initialize() called');

    if (this.isInitialized) {
      console.log('⚠️ Already initialized, skipping...');
      return;
    }

    try {
      // Get environment variables
      const enablePush = process.env.VUE_APP_ENABLE_PUSH_NOTIFICATIONS || 'false';
      const debugMode = process.env.VUE_APP_PUSH_DEBUG || 'false';

      console.log('🔧 Push config - Enable:', enablePush, 'Debug:', debugMode);

      // Check if push notifications are enabled
      if (enablePush !== 'true') {
        console.log('Push notifications disabled in environment config');
        return false;
      }

      // Only initialize on mobile devices (or in debug mode)
      const isDebugMode = debugMode === 'true';
      const isMobile = this.vueInstance?.$q?.platform?.is?.capacitor;

      if (!isMobile && !isDebugMode) {
        console.log('Push notifications only available on mobile devices');
        return false;
      }

      // For development/simulator testing
      if (isDebugMode && !isMobile) {
        console.log('🔧 DEVELOPMENT MODE: Simulating push notifications');
        await this.initializeSimulation();
        this.isInitialized = true;
        return true;
      }

      // Initialize real push notifications
      console.log('📱 Initializing native push notifications');
      await this.initializeReal();
      this.isInitialized = true;
      return true;

    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Initialize real push notifications (Capacitor)
   */
  async initializeReal() {
    try {
      const deviceInfo = await this.getDeviceInfo();
      const isIOS = deviceInfo.isIOS;
      
      // Import push notifications plugin
      const {PushNotifications} = await import('@capacitor/push-notifications');
      this.pushNotifications = PushNotifications;

      // Request permissions
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') {
        console.warn('Push notification permissions denied');
        throw new Error('Permissions denied');
      }

      // Set up event listeners BEFORE registering
      this.setupEventListeners();

      // Register for push notifications
      console.log('📱 About to call PushNotifications.register()...');
      await PushNotifications.register();
      console.log('📱 PushNotifications.register() completed');

      // Wait a moment for the registration to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to get token immediately after registration
      try {
        const result = await PushNotifications.getDeliveredNotifications();
        console.log('📱 Push result after registration:', result);

        // Check if there's a getToken method
        if (typeof PushNotifications.getToken === 'function') {
          const tokenResult = await PushNotifications.getToken();
          console.log('📱 Token from getToken():', tokenResult);
          if (tokenResult?.token) {
            this.currentToken = tokenResult.token;
            console.log('📱 Token retrieved directly:', tokenResult.token);
          }
        }
      } catch (error) {
        console.log('📱 No direct token method available:', error.message);
      }

      // Additional check: Try to manually trigger registration if no token received
      if (!this.currentToken) {
        console.log('📱 No token received after initial registration, checking status...');
        
        try {
          const status = await PushNotifications.checkPermissions();
          console.log('📱 Push permissions status:', status);
          
          if (status.receive === 'granted') {
            console.log('📱 Permissions granted but no token - this might be expected behavior in iOS Simulator');
            
            // Show specific notification for iOS simulator
            if (this.vueInstance?.$q) {
              this.vueInstance.$q.notify({
                type: 'warning',
                message: '⚠️ iOS Simulator Token Issue',
                caption: 'Push tokens may not generate in iOS Simulator. This is normal.',
                timeout: 6000
              });
            }
          }
        } catch (statusError) {
          console.log('📱 Could not check permissions:', statusError);
        }
      }


      // iOS Simulator fallback: If no token after 3 seconds, try direct registration
      setTimeout(async () => {
        if (!this.currentToken) {
          console.log('🚨 No token received after 3s, trying iOS Simulator fallback...');

          console.log('⚠️ iOS Simulator detected - push tokens may not work in Simulator');

          // Try to get Firebase token directly
          const firebaseToken = await this.getFirebaseToken();
          if (firebaseToken) {
            console.log('🔥 Using Firebase token as fallback');
            this.currentToken = firebaseToken;

            // Register device with backend using Firebase token
            try {
              await this.registerDevice(
                firebaseToken,
                'ios',
                await this.getDeviceInfo()
              );
            } catch (error) {
              console.error('🚨 Firebase token registration failed:', error);
            }
          } else {
            // Final fallback to mock token for development
            const mockToken = 'ios_sim_' + Math.random().toString(36).substring(7);
            console.log('🔧 Using mock token for iOS Simulator:', mockToken);
            this.currentToken = mockToken;


            // Register device with backend using mock token
            try {
              await this.registerDevice(
                mockToken,
                'ios',
                await this.getDeviceInfo()
              );
            } catch (error) {
              console.error('🚨 Mock token registration failed:', error);
            }
          }
        }
      }, 3000);

      // Setup test functions in debug mode
      if (process.env.VUE_APP_PUSH_DEBUG === 'true') {
        this.setupTestFunctions();
      }

    } catch (error) {
      console.error('Failed to initialize real push notifications:', error);
      throw error;
    }
  }

  /**
   * Initialize simulation mode for development
   */
  async initializeSimulation() {
    console.log('📱 Setting up development push notification simulation');

    // First try to get a real FCM token
    const realToken = await this.getFirebaseToken();

    if (realToken) {
      this.currentToken = realToken;
    } else {
      // Fallback to mock token
      const mockToken = 'dev_token_' + Math.random().toString(36).substring(7);
      console.log('🔑 Mock device token (fallback):', mockToken);
      this.currentToken = mockToken;

    }

    // Register device with backend
    try {
      console.log('🔧 SIMULATION: Registering device...');
      await this.registerDevice(this.currentToken, 'ios', await this.getDeviceInfo());
    } catch (error) {
      console.warn('⚠️ Device registration failed:', error);
    }

    // Setup test functions
    this.setupTestFunctions();
    this.setupDevelopmentTriggers();


    console.log('✅ Push notification simulation initialized');
  }

  /**
   * Setup event listeners for push notifications
   */
  setupEventListeners() {
    if (!this.pushNotifications) {
      console.error('🚨 PushNotifications plugin not available for setupEventListeners');
      return;
    }

    console.log('🔧 Setting up push notification event listeners...');

    // Handle successful registration
    console.log('🔧 Adding registration event listener...');
    this.pushNotifications.addListener('registration', async (token) => {
      console.log('🎉 REGISTRATION EVENT FIRED!');
      console.log('📱 Device token received:', token.value);
      console.log('📱 Token type: APNS (native iOS)');


      this.currentToken = token.value;

      // Register device with backend using APNS token
      // The backend will need to handle APNS tokens properly
      try {
        const deviceInfo = await this.getDeviceInfo();
        
        // Create a payload with correct token type based on platform
        const isIOSDevice = deviceInfo.isIOS;
        const registrationPayload = {
          fcm_token: isIOSDevice ? null : token.value, // FCM for Android
          apns_token: isIOSDevice ? token.value : null, // APNS for iOS
          platform: isIOSDevice ? 'ios' : 'android',
          device_model: deviceInfo.model || 'Unknown',
          device_version: deviceInfo.version || 'Unknown',
          app_version: '1.4.11',
          is_simulator: deviceInfo.isSimulator || false,
          token_type: isIOSDevice ? 'APNS' : 'FCM', // Correct token type
          notification_settings: {
            chat_notifications: true,
            teetime_notifications: true,
            general_notifications: true
          }
        };
        
        console.log('📡 Registering device with APNS token:', registrationPayload);
        const response = await this.axios.post('/api/golfer/device/register', registrationPayload);
        console.log('✅ Device successfully registered with backend using APNS token');
        
      } catch (error) {
        console.error('❌ Failed to register device with backend:', error);
        
      }
    });
    console.log('✅ Registration event listener added');

    // Handle registration errors
    console.log('🔧 Adding registrationError event listener...');
    this.pushNotifications.addListener('registrationError', (err) => {
      console.error('🚨 REGISTRATION ERROR EVENT FIRED!');
      console.error('📱 Registration error details:', err);

    });
    console.log('✅ Registration error event listener added');

    // Handle received notifications (when app is in foreground)
    this.pushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('📱 🎉 PUSH NOTIFICATION RECEIVED IN FOREGROUND!');
      console.log('📱 Full notification object:', JSON.stringify(notification, null, 2));
      console.log('📱 Notification ID:', notification.id);
      console.log('📱 Notification title:', notification.title);
      console.log('📱 Notification body:', notification.body);
      console.log('📱 Notification data:', notification.data);

      // Show debug notification
      if (this.vueInstance?.$q) {
        this.vueInstance.$q.notify({
          type: 'positive',
          message: '🎉 PUSH RECEIVED (FOREGROUND)!',
          caption: `${notification.title}: ${notification.body}`,
          timeout: 10000,
          actions: [
            {
              label: 'View Details',
              color: 'white',
              handler: () => {
                console.log('Full notification details:', notification);
                alert(JSON.stringify(notification, null, 2));
              }
            },
            {label: 'OK', color: 'white'}
          ]
        });
      }

      this.handleForegroundNotification(notification);
    });

    // Handle notification tap (when app is in background/closed)
    this.pushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('📱 🎉 PUSH NOTIFICATION TAPPED!');
      console.log('📱 Full tap notification object:', JSON.stringify(notification, null, 2));
      console.log('📱 Action performed on:', notification.actionId);
      console.log('📱 Input text:', notification.inputValue);
      console.log('📱 Notification data:', notification.notification);

      // Show debug notification
      if (this.vueInstance?.$q) {
        this.vueInstance.$q.notify({
          type: 'positive',
          message: '🎉 PUSH TAPPED!',
          caption: `Action: ${notification.actionId || 'tap'}`,
          timeout: 10000,
          actions: [
            {
              label: 'View Details',
              color: 'white',
              handler: () => {
                console.log('Full tap notification details:', notification);
                alert(JSON.stringify(notification, null, 2));
              }
            },
            {label: 'OK', color: 'white'}
          ]
        });
      }

      this.handleNotificationTap(notification);
    });
  }

  /**
   * Register device with backend
   */
  async registerDevice(token, platform, deviceInfo = {}) {
    const payload = {
      fcm_token: token,
      platform: platform,
      device_model: deviceInfo.model || 'Unknown',
      device_version: deviceInfo.version || 'Unknown',
      app_version: '1.4.11',
      is_simulator: deviceInfo.isSimulator || false,
      notification_settings: {
        chat_notifications: true,
        teetime_notifications: true,
        general_notifications: true
      }
    };

    console.log('📡 Registering device with backend:', payload);
    console.log('📡 Device registration URL will be: /api/golfer/device/register');


    // Use the correct endpoint only
    try {
      const response = await this.axios.post('/api/golfer/device/register', payload);
      console.log('✅ Device registered successfully:', response.data);
      
      
      return response.data;

    } catch (error) {
      console.error('❌ Device registration failed:', error.response?.status, error.response?.data);
      console.error('🔍 Full error:', error.message, error.code, error.name);


      throw error;
    }
  }

  /**
   * Refresh device token
   */
  async refreshToken(newToken) {
    try {
      const payload = {
        old_token: this.currentToken,
        new_token: newToken,
        device_info: await this.getDeviceInfo()
      };

      const response = await this.axios.put('/api/golfer/device/refresh', payload);
      console.log('✅ Token refreshed successfully:', response.data);

      this.currentToken = newToken;
      return response.data;

    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      throw error;
    }
  }

  /**
   * Unregister device
   */
  async unregisterDevice() {
    try {
      if (!this.currentToken) {
        console.warn('No token to unregister');
        return;
      }

      await this.axios.delete('/api/golfer/device/unregister', {
        data: {fcm_token: this.currentToken}
      });

      console.log('✅ Device unregistered successfully');
      this.currentToken = null;

    } catch (error) {
      console.error('❌ Failed to unregister device:', error);
      throw error;
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings() {
    try {
      const response = await this.axios.get('/api/golfer/device/notification-settings');
      console.log('📋 Notification settings:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Failed to get notification settings:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings) {
    try {
      const response = await this.axios.put('/api/golfer/device/notification-settings', settings);
      console.log('✅ Notification settings updated:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Failed to update notification settings:', error);
      throw error;
    }
  }

  /**
   * Send test notification
   */
  async sendTestNotification(type = 'general') {
    try {
      console.log('📨 Sending test notification of type:', type);
      const response = await this.axios.post('/api/golfer/device/test-notification', {
        type: type
      });
      console.log('✅ Test notification sent:', response.data);
      
      
      return response.data;

    } catch (error) {
      console.error('❌ Failed to send test notification:', error);
      
      
      throw error;
    }
  }

  /**
   * Handle foreground notification
   */
  handleForegroundNotification(notification) {
    // Show notification using Quasar
    if (this.vueInstance?.$q) {
      this.vueInstance.$q.notify({
        type: 'info',
        message: notification.title,
        caption: notification.body,
        actions: [
          {
            label: 'Open',
            color: 'white',
            handler: () => this.handleNotificationData(notification.data)
          },
          {label: 'OK', color: 'white'}
        ]
      });
    }

    // Handle specific notification types
    this.handleNotificationData(notification.data);
  }

  /**
   * Handle notification tap
   */
  handleNotificationTap(notification) {
    console.log('🔔 Processing notification tap:', notification);

    // Extract notification data (handle nested structure)
    let data = null;
    if (notification.notification?.data) {
      data = notification.notification.data;

      // Handle nested data structure (data.data.*)
      if (data.data) {
        console.log('🔔 Using nested data:', data.data);
        data = data.data;
      }
    }

    if (data) {
      this.handleNotificationData(data);
    }
  }

  /**
   * Handle notification data and routing
   */
  handleNotificationData(data) {
    if (!data || !this.router) return;

    console.log('🔔 Processing notification data:', data);

    // Handle chat notifications
    if (data.type === 'chat' || data.chat_id) {
      this.handleChatNotification(data);
      return;
    }

    // Handle teetime notifications
    if (data.type === 'teetime' || data.deep_link === '/teetimes') {
      this.router.push('/teetimes');
      return;
    }

    // Handle general deep links
    if (data.deep_link) {
      this.router.push(data.deep_link);
      return;
    }

    console.log('🔔 Unknown notification type:', data);
  }

  /**
   * Handle chat notifications
   */
  async handleChatNotification(data) {
    console.log('💬 Handling chat notification:', data);

    // Navigate to chat page
    this.router.push('/chat');

    // Set specific chat if chat_id is provided
    if (data.chat_id && this.store) {
      console.log('💬 Setting specific chat:', data.chat_id);

      setTimeout(async () => {
        try {
          // Find the chat in the list first to get complete chat object
          const chats = this.store.getters['chats/circles'];
          const targetChat = chats.find(chat => chat.chtNr == data.chat_id);

          if (targetChat) {
            console.log('💬 Found target chat:', targetChat);
            await this.store.dispatch('chats/setChat', {
              chtNr: targetChat.chtNr,
              chtName: targetChat.chtName
            });
          } else {
            console.log('💬 Chat not found in list, using ID only:', data.chat_id);
            await this.store.dispatch('chats/setChat', {
              chtNr: data.chat_id,
              chtName: `Chat ${data.chat_id}` // Fallback name
            });
          }
        } catch (error) {
          console.error('💬 Error setting chat:', error);
        }
      }, 1000); // Wait for chat list to load
    }

    // Refresh chat data if we're on chat page
    if (this.router.currentRoute?.name === 'chat' && this.store) {
      await this.store.dispatch('chats/fetchChats');
    }
  }

  /**
   * Setup test functions for development
   */
  setupTestFunctions() {
    // Make test functions globally available
    window.testPushNotification = this.testPushNotification.bind(this);
    window.testChatNotification = this.testChatNotification.bind(this);
    window.sendTestNotification = this.sendTestNotification.bind(this);

    console.log('🧪 Test functions available:');
    console.log('- window.testPushNotification()');
    console.log('- window.testChatNotification(chatId)');
    console.log('- window.sendTestNotification(type)');

  }

  /**
   * Setup development triggers
   */
  setupDevelopmentTriggers() {
    if (!this.store) return;

    // Listen for chat messages via Pusher and simulate push
    this.store.watch(
      (state) => state.chats?.messages,
      (newMessages, oldMessages) => {
        if (newMessages?.length > (oldMessages?.length || 0)) {
          const latestMessage = newMessages[newMessages.length - 1];
          this.simulateIncomingNotification({
            title: 'Nieuw chatbericht',
            body: latestMessage.crmMessage || 'Er is een nieuw bericht',
            data: {chat_id: latestMessage.crmChtNr}
          });
        }
      }
    );
  }

  /**
   * Test functions
   */
  testPushNotification() {
    this.simulateIncomingNotification({
      title: 'Test Notificatie',
      body: 'Dit is een test push notification vanuit development mode',
      data: {type: 'test'}
    });
  }

  testChatNotification(chatId = 1) {
    this.simulateIncomingNotification({
      title: 'Test Chat Bericht',
      body: `Nieuw bericht in chat ${chatId}`,
      data: {chat_id: chatId}
    });
  }

  /**
   * Simulate incoming notification for development
   */
  simulateIncomingNotification(notification) {
    console.log('📨 Simulating incoming push notification:', notification);

    // Show visual notification
    if (this.vueInstance?.$q) {
      this.vueInstance.$q.notify({
        type: 'info',
        message: `📱 PUSH: ${notification.title}`,
        caption: notification.body,
        timeout: 5000,
        actions: [
          {
            label: 'Open',
            color: 'white',
            handler: () => this.handleNotificationData(notification.data)
          },
          {label: 'Dismiss', color: 'grey'}
        ]
      });
    }

    // Handle notification data
    if (notification.data) {
      this.handleNotificationData(notification.data);
    }
  }

  /**
   * Get device information
   */
  async getDeviceInfo() {
    if (this.vueInstance?.$q?.platform) {
      const platform = this.vueInstance.$q.platform;

      // Try to get real device info from Capacitor
      let deviceInfo = null;
      try {
        if (platform.is.capacitor) {
          const {Device} = await import('@capacitor/device');
          deviceInfo = await Device.getInfo();
          console.log('📱 Real device info:', deviceInfo);
        }
      } catch (error) {
        console.log('📱 Capacitor Device not available, using platform info');
      }

      // Improved simulator detection
      let isSimulator = false;

      if (deviceInfo?.isVirtual !== undefined) {
        // If we have deviceInfo, use its isVirtual property
        isSimulator = deviceInfo.isVirtual;
        console.log('📱 Using Capacitor Device.isVirtual:', isSimulator);
      } else {
        // Fallback detection without Capacitor Device plugin
        console.log('📱 Platform details:', {
          name: platform.name,
          userAgent: platform.userAgent,
          is: platform.is
        });

        // For iOS: If we're in Capacitor and NOT in browser, assume real device
        // Simulators typically have 'Simulator' in the name or userAgent
        if (platform.is.ios && platform.is.capacitor) {
          isSimulator = platform.name?.includes('Simulator') ||
            platform.userAgent?.includes('Simulator') ||
            platform.name === 'iOS';  // Generic iOS often means simulator
          console.log('📱 iOS Capacitor device - simulator detection:', isSimulator);
        } else if (platform.is.ios && !platform.is.capacitor) {
          // If iOS but not Capacitor, likely browser/simulator
          isSimulator = true;
          console.log('📱 iOS without Capacitor - assuming simulator');
        } else if (platform.is.android && platform.is.capacitor) {
          // Similar logic for Android
          isSimulator = platform.name?.includes('SDK') ||
            platform.name?.includes('Emulator') ||
            platform.userAgent?.includes('Emulator');
          console.log('📱 Android Capacitor device - simulator detection:', isSimulator);
        }
      }

      console.log('📱 Final device detection result:', {
        model: deviceInfo?.model || platform.name || 'Unknown',
        version: deviceInfo?.osVersion || platform.version || 'Unknown',
        isSimulator: isSimulator,
        isCapacitor: platform.is.capacitor
      });

      return {
        model: deviceInfo?.model || platform.name || 'Unknown',
        version: deviceInfo?.osVersion || platform.version || 'Unknown',
        isIOS: platform.is.ios || false,
        isAndroid: platform.is.android || false,
        isMobile: platform.is.mobile || false,
        isCapacitor: platform.is.capacitor || false,
        isSimulator: isSimulator
      };
    }

    return {
      model: 'Unknown',
      version: 'Unknown',
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isCapacitor: false
    };
  }

  /**
   * Get Firebase FCM Token (disabled - using APNS instead)
   */
  async getFirebaseToken() {
    console.log('🔥 Firebase FCM disabled - using APNS tokens instead');
    return null;
  }

  /**
   * Get Firebase configuration from backend
   */
  async getFirebaseConfig() {
    try {
      console.log('🔧 Fetching Firebase config from backend...');
      console.log('📡 Firebase config URL will be: /api/golfer/firebase-config');

      const response = await this.axios.get('/api/golfer/firebase-config');

      if (response) {
        console.log('✅ Firebase config received from backend');
        return response;
      } else {
        console.warn('⚠️ Invalid Firebase config response:', response);
        return null;
      }

    } catch (error) {
      console.warn('⚠️ Failed to fetch Firebase config from backend:', error.response?.status, error.response?.data);
      console.warn('🔍 Full error details:', error.message, error.code, error.name);

      // Try environment variables as fallback
      const envConfig = this.getFirebaseConfigFromEnv();
      if (envConfig) {
        console.log('🔧 Using Firebase config from environment variables');
        return envConfig;
      }

      return null;
    }
  }

  /**
   * Get Firebase configuration from environment variables (fallback)
   */
  getFirebaseConfigFromEnv() {
    const config = {
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_FIREBASE_APP_ID,
      vapidKey: process.env.VUE_APP_FIREBASE_VAPID_KEY
    };

    // Check if we have the minimum required config
    if (config.apiKey && config.projectId && config.messagingSenderId && config.appId) {
      console.log('🔧 Firebase config loaded from environment variables');
      return config;
    }

    console.warn('⚠️ Incomplete Firebase config in environment variables');
    return null;
  }

  /**
   * Cleanup - call when app is closing
   */
  async cleanup() {
    try {
      if (this.pushNotifications) {
        // Remove event listeners
        await this.pushNotifications.removeAllListeners();
      }

      // Clear test functions
      if (window.testPushNotification) {
        delete window.testPushNotification;
        delete window.testChatNotification;
        delete window.sendTestNotification;
      }

      this.isInitialized = false;
      console.log('🧹 Push notification service cleaned up');

    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export default PushNotificationService;
