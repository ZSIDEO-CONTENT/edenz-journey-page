// Authentication functions
export const adminLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    
    // Check if user is an admin
    if (data.user.role !== "admin") {
      throw new Error("Not authorized as admin");
    }
    
    // Store token and user info in localStorage
    localStorage.setItem("adminToken", data.access_token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch("http://localhost:8000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.role === "admin";
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

export const studentLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    
    // Check if user is a student
    if (data.user.role !== "student") {
      throw new Error("Not authorized as student");
    }
    
    // Store token and user info in localStorage
    localStorage.setItem("studentToken", data.access_token);
    localStorage.setItem("studentUser", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Student login error:", error);
    throw error;
  }
};

export const isStudentAuthenticated = async () => {
  const token = localStorage.getItem("studentToken");
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch("http://localhost:8000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.role === "student";
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const logoutStudent = () => {
  localStorage.removeItem("studentToken");
  localStorage.removeItem("studentUser");
};

export const processingLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    
    // Check if user is a processing team member
    if (data.user.role !== "processing") {
      throw new Error("Not authorized as processing team member");
    }
    
    // Store token and user info in localStorage
    localStorage.setItem("processingToken", data.access_token);
    localStorage.setItem("processingUser", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Processing login error:", error);
    throw error;
  }
};

export const isProcessingAuthenticated = async () => {
  const token = localStorage.getItem("processingToken");
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch("http://localhost:8000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.role === "processing";
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const logoutProcessing = () => {
  localStorage.removeItem("processingToken");
  localStorage.removeItem("processingUser");
};

export const registerStudent = async (studentData: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/register/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Student registration error:", error);
    throw error;
  }
};

export const registerProcessingMember = async (
  processingData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    managed_regions?: string[];
  },
  adminToken: string
) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/register/processing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...processingData,
        admin_token: adminToken
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Processing member registration error:", error);
    throw error;
  }
};

// Student API functions
export const getStudentProfile = async (studentId: string) => {
  const token = localStorage.getItem("studentToken") || localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/student/profile/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student profile error:", error);
    throw error;
  }
};

export const updateStudentProfile = async (studentId: string, profileData: any) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/student/profile/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update student profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Update student profile error:", error);
    throw error;
  }
};

// Document API functions
export const getStudentDocuments = async (studentId: string) => {
  const token = localStorage.getItem("studentToken") || localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/documents/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student documents");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student documents error:", error);
    throw error;
  }
};

export const uploadStudentDocument = async (documentData: any) => {
  const token = localStorage.getItem("studentToken") || localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(documentData),
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

// Applications API functions
export const getStudentApplications = async (studentId: string) => {
  const token = localStorage.getItem("studentToken") || localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/student/applications/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student applications error:", error);
    throw error;
  }
};

// Processing Team API functions
export const getAllStudents = async () => {
  const token = localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    return await response.json();
  } catch (error) {
    console.error("Get all students error:", error);
    throw error;
  }
};

export const getStudentDetails = async (studentId: string) => {
  const token = localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student details");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student details error:", error);
    throw error;
  }
};

export const createStudentApplication = async (applicationData: any) => {
  const token = localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error("Failed to create application");
    }

    return await response.json();
  } catch (error) {
    console.error("Create application error:", error);
    throw error;
  }
};

export const updateStudentApplication = async (applicationId: string, updateData: any) => {
  const token = localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/applications/${applicationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update application");
    }

    return await response.json();
  } catch (error) {
    console.error("Update application error:", error);
    throw error;
  }
};

export const getApplicationHistory = async (applicationId: string) => {
  const token = localStorage.getItem("processingToken") || localStorage.getItem("adminToken") || localStorage.getItem("studentToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/applications/${applicationId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch application history");
    }

    return await response.json();
  } catch (error) {
    console.error("Get application history error:", error);
    throw error;
  }
};

export const generateStudentRecommendation = async (studentId: string) => {
  const token = localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/generate-recommendation/${studentId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate recommendation");
    }

    return await response.json();
  } catch (error) {
    console.error("Generate recommendation error:", error);
    throw error;
  }
};

export const getStudentRecommendations = async (studentId: string) => {
  const token = localStorage.getItem("studentToken") || localStorage.getItem("processingToken") || localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/recommendations/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    return await response.json();
  } catch (error) {
    console.error("Get recommendations error:", error);
    throw error;
  }
};

// Interface definitions
export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ConsultationBookingData {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  service: string;
  destination?: string;
  message?: string;
}

export interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
}

// Consultation API functions
export const getConsultations = async (): Promise<Consultation[]> => {
  const token = localStorage.getItem("adminToken");
  
  try {
    const response = await fetch("http://localhost:8000/api/consultations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch consultations");
    }

    return await response.json();
  } catch (error) {
    console.error("Get consultations error:", error);
    throw error;
  }
};

export const updateConsultationStatus = async (consultationId: string, status: string): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/consultations/${consultationId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update consultation status");
    }

    return await response.json();
  } catch (error) {
    console.error("Update consultation status error:", error);
    throw error;
  }
};

export const submitConsultationBooking = async (bookingData: ConsultationBookingData) => {
  try {
    const response = await fetch("http://localhost:8000/api/consultations/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bookingData,
        preferredDate: bookingData.preferredDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to book consultation");
    }

    return await response.json();
  } catch (error) {
    console.error("Consultation booking error:", error);
    throw error;
  }
};

// Chat API functions
export const sendChatMessage = async (message: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return await response.json();
  } catch (error) {
    console.error("Send chat message error:", error);
    throw error;
  }
};

// Contact API functions
export const submitContactForm = async (formData: { 
  name: string; 
  email: string; 
  phone?: string; 
  message: string 
}) => {
  try {
    const response = await fetch("http://localhost:8000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit contact form");
    }

    return await response.json();
  } catch (error) {
    console.error("Submit contact form error:", error);
    throw error;
  }
};
