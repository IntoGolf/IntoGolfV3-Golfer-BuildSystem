/**
 * reCAPTCHA v3 Composable
 * 
 * Provides reusable reCAPTCHA functionality with proper error handling,
 * platform detection, and fallback mechanisms for mobile apps.
 */

import { Platform } from "quasar";
import { getCurrentInstance } from "vue";

export function useRecaptcha() {
  const instance = getCurrentInstance();
  const app = instance?.appContext?.app;

  /**
   * Check if reCAPTCHA is available and should be used
   * @returns {boolean}
   */
  const shouldUseRecaptcha = () => {
    // Only use reCAPTCHA on web platforms (not native mobile apps)
    return !Platform.is.ios && !Platform.is.android && app?.config?.globalProperties?.$recaptchaLoaded;
  };

  /**
   * Execute reCAPTCHA with proper error handling
   * @param {string} action - The action name for reCAPTCHA analytics
   * @param {number} minScore - Minimum score threshold (0.0 to 1.0, defaults to env var)
   * @returns {Promise<string|null>} - reCAPTCHA token or null if not available
   */
  const executeRecaptcha = async (action = 'submit', minScore = null) => {
    // Use environment variable for threshold if not specified
    const threshold = minScore ?? parseFloat(process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD ?? '0.5');
    if (!shouldUseRecaptcha()) {
      console.log(`reCAPTCHA skipped for ${action} - mobile app or not available`);
      return null;
    }

    try {
      // Wait for reCAPTCHA to be loaded
      await app.config.globalProperties.$recaptchaLoaded();
      
      // Execute reCAPTCHA
      const token = await app.config.globalProperties.$recaptcha(action);
      
      console.log(`reCAPTCHA executed successfully for action: ${action} (threshold: ${threshold})`);
      return token;
    } catch (error) {
      console.error(`reCAPTCHA execution failed for action: ${action}`, error);
      
      // In production, you might want to handle this differently
      // For now, we'll allow the action to continue without reCAPTCHA
      return null;
    }
  };

  /**
   * Prepare form data with reCAPTCHA token
   * @param {Object} formData - The form data object
   * @param {string} action - The reCAPTCHA action
   * @param {number} minScore - Minimum score threshold
   * @returns {Promise<Object>} - Form data with captcha token if available
   */
  const withRecaptcha = async (formData, action = 'submit', minScore = 0.5) => {
    const token = await executeRecaptcha(action, minScore);
    
    return {
      ...formData,
      ...(token && { captcha: token })
    };
  };

  /**
   * Check if current platform should use alternative security measures
   * (for mobile apps that don't use reCAPTCHA)
   * @returns {boolean}
   */
  const shouldUseAlternativeAuth = () => {
    return Platform.is.ios || Platform.is.android;
  };

  /**
   * Get platform-specific security info for logging/analytics
   * @returns {Object}
   */
  const getSecurityContext = () => {
    return {
      platform: Platform.is.ios ? 'ios' : Platform.is.android ? 'android' : 'web',
      hasRecaptcha: shouldUseRecaptcha(),
      needsAlternativeAuth: shouldUseAlternativeAuth(),
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
  };

  return {
    shouldUseRecaptcha,
    executeRecaptcha,
    withRecaptcha,
    shouldUseAlternativeAuth,
    getSecurityContext
  };
}