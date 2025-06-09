
import { fetchAPI } from './api';

export const checkBackendHealth = async () => {
  try {
    console.log('Checking backend health...');
    
    // Simple health check - try to reach the backend
    const response = await fetch('http://localhost:8000/api/auth/me/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend health check response status:', response.status);
    
    if (response.status === 401) {
      // 401 is expected without authentication - means backend is running
      return { 
        status: 'connected', 
        message: 'Backend is running and accessible' 
      };
    }
    
    if (response.ok) {
      return { 
        status: 'connected', 
        message: 'Backend is running and accessible' 
      };
    }
    
    return { 
      status: 'error', 
      message: `Backend responded with status ${response.status}` 
    };
    
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { 
      status: 'disconnected', 
      message: 'Cannot connect to backend. Make sure Django server is running on http://localhost:8000' 
    };
  }
};

export const testAuthenticatedEndpoint = async (token: string, role: string) => {
  try {
    const response = await fetchAPI('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return {
      status: 'success',
      message: `${role} authentication working correctly`,
      data: response
    };
  } catch (error) {
    return {
      status: 'error',
      message: `${role} authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    };
  }
};
