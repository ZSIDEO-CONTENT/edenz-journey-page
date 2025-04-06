// api.ts
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
