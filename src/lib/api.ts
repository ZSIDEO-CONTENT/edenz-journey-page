
// api.ts - Updated to work with PostgreSQL backend

// API base URL
const API_BASE_URL = "http://localhost:8000/api";

// Define proper types for fetch options
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Helper function for API requests
const fetchAPI = async (endpoint: string, options: FetchOptions = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication functions
export const isAuthenticated = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;
  
  try {
    // Validate the token with the backend
    const data = await fetchAPI("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data && data.role === "admin";
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const isStudentAuthenticated = async () => {
  const token = localStorage.getItem("studentToken");
  if (!token) return false;
  
  try {
    // Validate the token with the backend
    const data = await fetchAPI("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data && data.role === "student";
  } catch (error) {
    console.error("Student auth check error:", error);
    return false;
  }
};

export const isProcessingAuthenticated = async () => {
  const token = localStorage.getItem("processingToken");
  if (!token) return false;
  
  try {
    // Validate the token with the backend
    const data = await fetchAPI("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data && data.role === "processing";
  } catch (error) {
    console.error("Processing auth check error:", error);
    return false;
  }
};

export const adminLogin = async (email: string, password: string) => {
  try {
    console.log("Attempting admin login for:", email);
    
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email, 
        password: password,
        grant_type: 'password'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Admin login failed:", errorData);
      throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    console.log("Login response:", data);
    
    // Check if the user has admin role
    if (!data.user || data.user.role !== "admin") {
      console.error("Not authorized as admin. User role:", data.user?.role);
      throw new Error("Not authorized as admin");
    }
    
    // Save token and user data to localStorage
    localStorage.setItem("adminToken", data.access_token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const registerAdmin = async (userData: any) => {
  try {
    return await fetchAPI("/auth/register/admin", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    throw error;
  }
};

export const processingLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email, 
        password: password,
        grant_type: 'password'
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    
    // Check if the user has processing role
    if (data.user.role !== "processing") {
      throw new Error("Not authorized as processing team member");
    }
    
    localStorage.setItem("processingToken", data.access_token);
    localStorage.setItem("processingUser", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Processing login error:", error);
    throw error;
  }
};

export const studentLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email, 
        password: password,
        grant_type: 'password'
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    
    // Check if the user has student role
    if (data.user.role !== "student") {
      throw new Error("Not authorized as student");
    }
    
    localStorage.setItem("studentToken", data.access_token);
    localStorage.setItem("studentUser", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Student login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

export const logoutProcessing = () => {
  localStorage.removeItem("processingToken");
  localStorage.removeItem("processingUser");
};

export const logoutStudent = () => {
  localStorage.removeItem("studentToken");
  localStorage.removeItem("studentUser");
};

export const registerProcessingMember = async (userData: any) => {
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    throw new Error("Admin authentication required");
  }
  
  try {
    console.log("Registering processing team member:", userData);
    
    return await fetchAPI("/auth/processing/register", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...userData,
        admin_token: token,
      }),
    });
  } catch (error) {
    console.error("Register processing member error:", error);
    throw error;
  }
};

// Student functions
export const getStudentRecommendations = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/recommendations/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get student recommendations error:", error);
    throw error;
  }
};

export const generateStudentRecommendation = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/recommendations/generate/${studentId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Generate student recommendation error:", error);
    throw error;
  }
};

export const getStudentDetails = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/student/profile/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get student details error:", error);
    throw error;
  }
};

// Student profile
export const getStudentProfile = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/student/profile/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get student profile error:", error);
    throw error;
  }
};

export const updateStudentProfile = async (studentId: string, profileData: any) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/student/profile/${studentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  } catch (error) {
    console.error("Update student profile error:", error);
    throw error;
  }
};

// Student education
export const getStudentEducation = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/student/education/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get student education error:", error);
    throw error;
  }
};

// Student documents
export const getStudentDocuments = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/documents/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get student documents error:", error);
    throw error;
  }
};

export const getRequiredDocuments = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/documents/required/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get required documents error:", error);
    throw error;
  }
};

export const uploadDocument = async (formData: FormData) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload document");
    }

    return await response.json();
  } catch (error) {
    console.error("Upload document error:", error);
    throw error;
  }
};

// Student applications
export const getStudentApplications = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/student/applications/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get student applications error:", error);
    throw error;
  }
};

// Student onboarding steps
export const getStudentOnboardingSteps = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    return await fetchAPI(`/student/onboarding-steps/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get onboarding steps error:", error);
    throw error;
  }
};

// Contact & Consultation
export const submitContactForm = async (formData: any) => {
  try {
    return await fetchAPI("/contact", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    throw error;
  }
};

// Updated to match the expected structure in BookConsultation.tsx
export interface ConsultationBookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  consultationType: string;
  destination?: string;
  message?: string;
  // Adding the fields that are used in BookConsultation.tsx
  preferredDate?: Date;
  preferredTime?: string;
  service?: string;
}

export const submitConsultationBooking = async (formData: ConsultationBookingData) => {
  try {
    return await fetchAPI("/consultation", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Consultation booking error:", error);
    throw error;
  }
};

// Updated to match actual properties used in AdminDashboard
export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  consultationType: string;
  destination: string;
  notes: string;
  status: string;
  createdAt: string;
  message?: string;
  created_at?: string;
}

export const getConsultations = async () => {
  const token = localStorage.getItem("adminToken");
  
  try {
    return await fetchAPI("/consultations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get consultations error:", error);
    throw error;
  }
};

export const updateConsultationStatus = async (consultationId: string, status: string) => {
  const token = localStorage.getItem("adminToken");
  
  try {
    return await fetchAPI(`/consultations/${consultationId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error("Update consultation status error:", error);
    throw error;
  }
};

export const getAllStudents = async () => {
  const token = localStorage.getItem("processingToken");
  
  try {
    return await fetchAPI("/processing/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Get all students error:", error);
    throw error;
  }
};

export const createStudentApplication = async (studentId: string, applicationData: any) => {
  const token = localStorage.getItem("processingToken");
  
  try {
    return await fetchAPI(`/processing/students/${studentId}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });
  } catch (error) {
    console.error("Create student application error:", error);
    throw error;
  }
};

// Chat
export interface ChatMessage {
  id?: string;
  sender: string;
  message: string;
  timestamp?: string;
  // Adding content field to support Chat.tsx
  content?: string;
}

export const sendChatMessage = async (message: string) => {
  try {
    return await fetchAPI("/chat/messages", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error("Send chat message error:", error);
    throw error;
  }
};
