// Email service for sending OTP
// This is a mock implementation - replace with your actual email service

interface EmailServiceResponse {
  success: boolean;
  message: string;
}

export const sendOTPEmail = async (email: string, otp: string): Promise<EmailServiceResponse> => {
  try {
    // Mock email sending - replace with actual email service
    console.log(`📧 Sending OTP ${otp} to ${email}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For testing purposes, always return success
    // In production, replace this with actual email service call
    
    /* Example with EmailJS:
    const templateParams = {
      to_email: email,
      otp_code: otp,
      to_name: 'User'
    };
    
    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID', 
      templateParams,
      'YOUR_PUBLIC_KEY'
    );
    
    return { success: true, message: 'OTP sent successfully' };
    */
    
    /* Example with custom backend API:
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    
    if (response.ok) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      return { success: false, message: 'Failed to send OTP' };
    }
    */
    
    // Mock success response
    return { 
      success: true, 
      message: `OTP sent to ${email}` 
    };
    
  } catch (error) {
    console.error('Email service error:', error);
    return { 
      success: false, 
      message: 'Failed to send email' 
    };
  }
};