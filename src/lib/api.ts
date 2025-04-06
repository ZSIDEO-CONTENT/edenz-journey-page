
// api.ts

// Student functions
export const getStudentRecommendations = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");

  try {
    const response = await fetch(`http://localhost:8000/api/recommendations/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student recommendations");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student recommendations error:", error);
    throw error;
  }
};

export const generateStudentRecommendation = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");

  try {
    const response = await fetch(`http://localhost:8000/api/recommendations/generate/${studentId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate student recommendation");
    }

    return await response.json();
  } catch (error) {
    console.error("Generate student recommendation error:", error);
    throw error;
  }
};

export const getStudentDetails = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");

  try {
    const response = await fetch(`http://localhost:8000/api/student/profile/${studentId}`, {
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

// Student profile
export const getStudentProfile = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

// Student education
export const getStudentEducation = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/student/education/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student education");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student education error:", error);
    throw error;
  }
};

// Student documents
export const getStudentDocuments = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
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

export const getRequiredDocuments = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/documents/required/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch required documents");
    }

    return await response.json();
  } catch (error) {
    console.error("Get required documents error:", error);
    throw error;
  }
};

// Student applications
export const getStudentApplications = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
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

// Student onboarding steps
export const getStudentOnboardingSteps = async (studentId: string) => {
  const token = localStorage.getItem("studentToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/student/onboarding-steps/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch onboarding steps");
    }

    return await response.json();
  } catch (error) {
    console.error("Get onboarding steps error:", error);
    throw error;
  }
};

// Authentication functions
export const isAuthenticated = () => {
  const token = localStorage.getItem("adminToken");
  return !!token;
};

export const isStudentAuthenticated = () => {
  const token = localStorage.getItem("studentToken");
  return !!token;
};

export const isProcessingAuthenticated = () => {
  const token = localStorage.getItem("processingToken");
  return !!token;
};

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const processingLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/processing/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("processingToken", data.token);
    localStorage.setItem("processingUser", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Processing login error:", error);
    throw error;
  }
};

export const studentLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/student/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("studentToken", data.token);
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

// Contact & Consultation
export const submitContactForm = async (formData: any) => {
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
    const response = await fetch("http://localhost:8000/api/consultation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to book consultation");
    }

    return await response.json();
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

export const updateConsultationStatus = async (consultationId: string, status: string) => {
  const token = localStorage.getItem("adminToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/consultations/${consultationId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

// Processing team
export const registerProcessingMember = async (userData: any) => {
  const token = localStorage.getItem("adminToken");
  
  try {
    const response = await fetch("http://localhost:8000/api/auth/processing/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to register processing team member");
    }

    return await response.json();
  } catch (error) {
    console.error("Register processing member error:", error);
    throw error;
  }
};

export const getAllStudents = async () => {
  const token = localStorage.getItem("processingToken");
  
  try {
    const response = await fetch("http://localhost:8000/api/processing/students", {
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

export const createStudentApplication = async (studentId: string, applicationData: any) => {
  const token = localStorage.getItem("processingToken");
  
  try {
    const response = await fetch(`http://localhost:8000/api/processing/students/${studentId}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error("Failed to create student application");
    }

    return await response.json();
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
    const response = await fetch("http://localhost:8000/api/chat/messages", {
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
