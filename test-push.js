#!/usr/bin/env node

/**
 * Test script voor het versturen van push notifications
 * Simuliert backend calls naar de IntoGolf API
 */

const axios = require('axios');

// Configuratie
const CONFIG = {
  // Backend URL (pas aan naar je backend)
  BACKEND_URL: process.env.VUE_APP_BASE_URL || 'http://127.0.0.1:8000/',
  
  // Test device token (zou normaal uit de app komen)
  DEVICE_TOKEN: 'test_device_token_123',
  
  // Test user data
  USER_ID: 1,
  CHAT_ID: 5
};

/**
 * Test functie voor het versturen van een algemene push notification
 */
async function sendTestPushNotification() {
  try {
    console.log('🧪 Sending test push notification...');
    
    const response = await axios.post(`${CONFIG.BACKEND_URL}api/push/send`, {
      device_token: CONFIG.DEVICE_TOKEN,
      title: 'Test Golf App',
      body: 'Dit is een test push notification voor de golf app',
      data: {
        type: 'test',
        timestamp: Date.now()
      }
    });
    
    console.log('✅ Push notification sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send push notification:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

/**
 * Test functie voor het versturen van een chat push notification
 */
async function sendTestChatNotification(chatId = CONFIG.CHAT_ID) {
  try {
    console.log(`🧪 Sending test chat notification for chat ${chatId}...`);
    
    const response = await axios.post(`${CONFIG.BACKEND_URL}api/push/chat`, {
      device_token: CONFIG.DEVICE_TOKEN,
      chat_id: chatId,
      title: 'Nieuw Chatbericht',
      body: `Je hebt een nieuw bericht ontvangen in chat ${chatId}`,
      data: {
        type: 'chat',
        chat_id: chatId,
        timestamp: Date.now()
      }
    });
    
    console.log('✅ Chat notification sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send chat notification:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

/**
 * Test functie voor tee time reminder
 */
async function sendTeeTimeReminder() {
  try {
    console.log('🧪 Sending tee time reminder...');
    
    const response = await axios.post(`${CONFIG.BACKEND_URL}api/push/teetime-reminder`, {
      device_token: CONFIG.DEVICE_TOKEN,
      title: 'Tee Time Reminder',
      body: 'Je tee time begint over 15 minuten',
      data: {
        type: 'teetime_reminder',
        teetime_id: 123,
        reminder_minutes: 15,
        timestamp: Date.now()
      }
    });
    
    console.log('✅ Tee time reminder sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send tee time reminder:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

/**
 * Main functie - bepaalt welke test uit te voeren
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'test';
  
  console.log('📱 IntoGolf Push Notification Tester');
  console.log('=====================================');
  console.log(`Backend: ${CONFIG.BACKEND_URL}`);
  console.log(`Device Token: ${CONFIG.DEVICE_TOKEN}`);
  console.log('');
  
  switch (command) {
    case 'test':
    case 'general':
      await sendTestPushNotification();
      break;
      
    case 'chat':
      const chatId = args[1] ? parseInt(args[1]) : CONFIG.CHAT_ID;
      await sendTestChatNotification(chatId);
      break;
      
    case 'teetime':
      await sendTeeTimeReminder();
      break;
      
    case 'all':
      await sendTestPushNotification();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sendTestChatNotification();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sendTeeTimeReminder();
      break;
      
    default:
      console.log('Usage:');
      console.log('  node test-push.js test          - Send general test notification');
      console.log('  node test-push.js chat [id]     - Send chat notification');
      console.log('  node test-push.js teetime       - Send tee time reminder');
      console.log('  node test-push.js all           - Send all test notifications');
      break;
  }
}

// Run het script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  sendTestPushNotification,
  sendTestChatNotification,
  sendTeeTimeReminder
};