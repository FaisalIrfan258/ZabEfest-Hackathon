// Test script for authentication functions
import { loginUser, registerUser, forgotPassword, resetPassword } from './auth';

// Helper function to log results
const logResult = (name: string, result: any) => {
  console.log(`\n----- ${name} Test -----`);
  console.log(JSON.stringify(result, null, 2));
  console.log('-----------------------\n');
};

// Test login
export const testLogin = async () => {
  try {
    const result = await loginUser('admin@example.com', 'Password123');
    logResult('Login', result);
    return result;
  } catch (error) {
    console.error('Login test failed:', error);
    throw error;
  }
};

// Test registration
export const testRegistration = async () => {
  try {
    const userData = {
      name: "John Doe",
      username: "johndoe123",
      email: "john@example.com",
      password: "Password123",
      confirmPassword: "Password123",
      role: "user",
      location: "123 Main Street, Apartment 4B, Karachi, Pakistan",
      cnic: "1234567890123"
    };
    
    const result = await registerUser(userData);
    logResult('Registration', result);
    return result;
  } catch (error) {
    console.error('Registration test failed:', error);
    throw error;
  }
};

// Test forgot password
export const testForgotPassword = async () => {
  try {
    const result = await forgotPassword('1234567890123');
    logResult('Forgot Password', result);
    return result;
  } catch (error) {
    console.error('Forgot password test failed:', error);
    throw error;
  }
};

// Test reset password
export const testResetPassword = async (token: string) => {
  try {
    const result = await resetPassword(
      token,
      'NewPassword123',
      'NewPassword123'
    );
    logResult('Reset Password', result);
    return result;
  } catch (error) {
    console.error('Reset password test failed:', error);
    throw error;
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('Starting authentication tests...');
  
  try {
    // Test registration
    const registrationResult = await testRegistration();
    
    // Test login
    const loginResult = await testLogin();
    
    // Test forgot password
    const forgotPasswordResult = await testForgotPassword();
    
    // Note: Reset password test would require a valid token
    console.log('Tests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
  }
}; 