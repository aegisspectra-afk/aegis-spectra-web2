// Comprehensive testing utilities

// Test data for different scenarios
export const testData = {
  // User data for testing
  users: {
    valid: {
      name: 'דוד כהן',
      email: 'david.cohen@test.com',
      phone: '050-123-4567',
      company: 'טכנולוגיות מתקדמות',
      role: 'מנכ"ל',
    },
    invalid: {
      name: '',
      email: 'invalid-email',
      phone: '123',
      company: '',
      role: '',
    },
    edgeCase: {
      name: 'א'.repeat(100), // Very long name
      email: 'a'.repeat(100) + '@test.com', // Very long email
      phone: '050-123-4567-890', // Invalid phone format
      company: 'א'.repeat(200), // Very long company name
      role: 'א'.repeat(50), // Very long role
    },
  },

  // Product data for testing
  products: {
    homeCam: {
      id: 'home-cam',
      name: 'מצלמת אבטחה ביתית',
      price: 1990,
      description: 'מצלמת אבטחה HD לבית',
      features: ['HD', 'WiFi', 'לילה'],
      inStock: true,
    },
    businessCam: {
      id: 'business-cam',
      name: 'מצלמת אבטחה עסקית',
      price: 3490,
      description: 'מצלמת אבטחה מתקדמת לעסק',
      features: ['4K', 'WiFi', 'לילה', 'זיהוי פנים'],
      inStock: true,
    },
    outOfStock: {
      id: 'out-of-stock',
      name: 'מצלמה לא זמינה',
      price: 1000,
      description: 'מצלמה לא זמינה',
      features: [],
      inStock: false,
    },
  },

  // Form data for testing
  forms: {
    contact: {
      valid: {
        name: 'שרה לוי',
        email: 'sarah.levy@test.com',
        phone: '050-987-6543',
        message: 'אני מעוניינת במערכת אבטחה לבית שלי',
        subject: 'בקשה להצעת מחיר',
      },
      invalid: {
        name: '',
        email: 'invalid',
        phone: '123',
        message: '',
        subject: '',
      },
    },
    demoVisit: {
      valid: {
        name: 'מיכאל רוזן',
        phone: '050-555-1234',
        address: 'רחוב הרצל 123, תל אביב',
        visitType: 'home',
        preferredDate: '2024-02-15',
        preferredTime: 'morning',
      },
      invalid: {
        name: '',
        phone: '123',
        address: '',
        visitType: '',
        preferredDate: '',
        preferredTime: '',
      },
    },
    quote: {
      valid: {
        name: 'רחל גרין',
        email: 'rachel.green@test.com',
        phone: '050-777-8888',
        company: 'מתחם מגורים',
        requirements: 'מערכת אבטחה למתחם של 50 דירות',
        budget: '50000',
        timeline: '3 חודשים',
      },
      invalid: {
        name: '',
        email: 'invalid',
        phone: '123',
        company: '',
        requirements: '',
        budget: '',
        timeline: '',
      },
    },
  },

  // Payment data for testing
  payments: {
    valid: {
      amount: 1990,
      currency: 'ILS',
      description: 'מצלמת אבטחה ביתית',
      customer: {
        name: 'דוד כהן',
        email: 'david.cohen@test.com',
        phone: '050-123-4567',
      },
    },
    invalid: {
      amount: 0,
      currency: '',
      description: '',
      customer: {
        name: '',
        email: 'invalid',
        phone: '123',
      },
    },
    edgeCase: {
      amount: 999999,
      currency: 'ILS',
      description: 'א'.repeat(1000),
      customer: {
        name: 'א'.repeat(100),
        email: 'a'.repeat(100) + '@test.com',
        phone: '050-123-4567-890',
      },
    },
  },
};

// Test scenarios
export const testScenarios = {
  // User journey tests
  userJourneys: {
    homePageToContact: [
      'Visit home page',
      'Click contact button',
      'Fill contact form',
      'Submit form',
      'Verify success message',
    ],
    productSelectionToCheckout: [
      'Visit products page',
      'Select product',
      'Add to cart',
      'Proceed to checkout',
      'Fill payment details',
      'Complete purchase',
    ],
    demoRequestFlow: [
      'Visit demo-visit page',
      'Fill demo request form',
      'Submit form',
      'Verify confirmation',
    ],
  },

  // Error scenarios
  errorScenarios: {
    formValidation: [
      'Submit empty form',
      'Submit form with invalid email',
      'Submit form with invalid phone',
      'Submit form with missing required fields',
    ],
    paymentErrors: [
      'Submit payment with invalid amount',
      'Submit payment with invalid customer data',
      'Submit payment with expired card',
      'Submit payment with insufficient funds',
    ],
    networkErrors: [
      'Simulate network timeout',
      'Simulate server error',
      'Simulate connection lost',
    ],
  },

  // Performance tests
  performanceTests: {
    pageLoad: [
      'Measure home page load time',
      'Measure products page load time',
      'Measure contact page load time',
      'Verify load time < 3 seconds',
    ],
    imageOptimization: [
      'Check image lazy loading',
      'Verify WebP format usage',
      'Check image compression',
    ],
    mobilePerformance: [
      'Test on mobile device',
      'Check touch interactions',
      'Verify responsive design',
    ],
  },

  // Security tests
  securityTests: {
    inputValidation: [
      'Test SQL injection attempts',
      'Test XSS attempts',
      'Test CSRF protection',
      'Test rate limiting',
    ],
    authentication: [
      'Test invalid login attempts',
      'Test password reset flow',
      'Test session management',
    ],
    dataProtection: [
      'Verify sensitive data encryption',
      'Check data transmission security',
      'Verify data storage security',
    ],
  },
};

// Test utilities
export const testUtils = {
  // Generate test data
  generateTestData: (type: string, count: number = 1) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: `${type}-${i + 1}`,
        name: `Test ${type} ${i + 1}`,
        email: `test${i + 1}@test.com`,
        phone: `050-${String(i + 1).padStart(3, '0')}-${String(i + 1).padStart(4, '0')}`,
      });
    }
    return data;
  },

  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone format
  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^05[0-9]-[0-9]{3}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  },

  // Validate required fields
  validateRequired: (data: Record<string, any>, requiredFields: string[]): boolean => {
    return requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
  },

  // Simulate network delay
  simulateNetworkDelay: (ms: number = 1000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Simulate API response
  simulateAPIResponse: (data: any, success: boolean = true, delay: number = 500) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve({ success: true, data });
        } else {
          reject({ success: false, error: 'API Error' });
        }
      }, delay);
    });
  },

  // Test form submission
  testFormSubmission: async (formData: Record<string, any>, endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Test payment processing
  testPaymentProcessing: async (paymentData: any) => {
    try {
      // Simulate PayPal API call
      const response = await fetch('/api/paypal/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Test email sending
  testEmailSending: async (emailData: any) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};

// Test runner
export class TestRunner {
  private tests: Array<{ name: string; fn: () => Promise<boolean> }> = [];
  private results: Array<{ name: string; passed: boolean; error?: string }> = [];

  addTest(name: string, fn: () => Promise<boolean>) {
    this.tests.push({ name, fn });
  }

  async runTests(): Promise<Array<{ name: string; passed: boolean; error?: string }>> {
    this.results = [];
    
    for (const test of this.tests) {
      try {
        const passed = await test.fn();
        this.results.push({ name: test.name, passed });
      } catch (error) {
        this.results.push({ 
          name: test.name, 
          passed: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return this.results;
  }

  getResults(): Array<{ name: string; passed: boolean; error?: string }> {
    return this.results;
  }

  getSummary(): { total: number; passed: number; failed: number; passRate: number } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    
    return { total, passed, failed, passRate };
  }
}

// Predefined test suites
export const testSuites = {
  // Form validation tests
  formValidation: (testRunner: TestRunner) => {
    testRunner.addTest('Contact form validation', async () => {
      const validData = testData.forms.contact.valid;
      const invalidData = testData.forms.contact.invalid;
      
      // Test valid data
      const validResult = await testUtils.testFormSubmission(validData, '/api/contact');
      if (!validResult.success) return false;
      
      // Test invalid data
      const invalidResult = await testUtils.testFormSubmission(invalidData, '/api/contact');
      if (invalidResult.success) return false; // Should fail
      
      return true;
    });

    testRunner.addTest('Demo visit form validation', async () => {
      const validData = testData.forms.demoVisit.valid;
      const invalidData = testData.forms.demoVisit.invalid;
      
      // Test valid data
      const validResult = await testUtils.testFormSubmission(validData, '/api/demo-visit');
      if (!validResult.success) return false;
      
      // Test invalid data
      const invalidResult = await testUtils.testFormSubmission(invalidData, '/api/demo-visit');
      if (invalidResult.success) return false; // Should fail
      
      return true;
    });
  },

  // Payment processing tests
  paymentProcessing: (testRunner: TestRunner) => {
    testRunner.addTest('Valid payment processing', async () => {
      const validPayment = testData.payments.valid;
      const result = await testUtils.testPaymentProcessing(validPayment);
      return result.success;
    });

    testRunner.addTest('Invalid payment handling', async () => {
      const invalidPayment = testData.payments.invalid;
      const result = await testUtils.testPaymentProcessing(invalidPayment);
      return !result.success; // Should fail
    });
  },

  // Email sending tests
  emailSending: (testRunner: TestRunner) => {
    testRunner.addTest('Contact email sending', async () => {
      const emailData = {
        to: 'info@aegisspectra.co.il',
        subject: 'Test Contact Form',
        body: 'This is a test email from the contact form.',
      };
      
      const result = await testUtils.testEmailSending(emailData);
      return result.success;
    });

    testRunner.addTest('Demo request email sending', async () => {
      const emailData = {
        to: 'info@aegisspectra.co.il',
        subject: 'Test Demo Request',
        body: 'This is a test demo request email.',
      };
      
      const result = await testUtils.testEmailSending(emailData);
      return result.success;
    });
  },

  // Performance tests
  performance: (testRunner: TestRunner) => {
    testRunner.addTest('Page load performance', async () => {
      const startTime = performance.now();
      
      // Simulate page load
      await testUtils.simulateNetworkDelay(1000);
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      return loadTime < 3000; // Should load in less than 3 seconds
    });

    testRunner.addTest('Image optimization', async () => {
      // Check if images are optimized
      const images = document.querySelectorAll('img');
      let optimizedCount = 0;
      
      images.forEach(img => {
        if (img.hasAttribute('loading') && img.hasAttribute('decoding')) {
          optimizedCount++;
        }
      });
      
      return optimizedCount > 0;
    });
  },
};

// Export test runner instance
export const testRunner = new TestRunner();
