
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConsultations, updateConsultationStatus, isAuthenticated, logout, Consultation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, Mail, Phone, User } from "lucide-react";

const AdminDashboard = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    // Load consultations
    fetchConsultations();
  }, [navigate]);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const data = await getConsultations();
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error",
        description: "Failed to load consultations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (consultationId: string, status: string) => {
    try {
      await updateConsultationStatus(consultationId, status);
      
      // Update local state
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === consultationId 
            ? { ...consultation, status: status as 'pending' | 'confirmed' | 'completed' | 'cancelled' } 
            : consultation
        )
      );
      
      toast({
        title: "Status updated",
        description: `Consultation status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Edenz Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Consultation Bookings</h2>
          <Button onClick={fetchConsultations} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Loading consultations...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No consultations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden">
                <CardHeader className={`
                  ${consultation.status === 'pending' ? 'bg-yellow-50' : ''}
                  ${consultation.status === 'confirmed' ? 'bg-green-50' : ''}
                  ${consultation.status === 'completed' ? 'bg-blue-50' : ''}
                  ${consultation.status === 'cancelled' ? 'bg-red-50' : ''}
                `}>
                  <CardTitle className="flex justify-between items-center">
                    <span>Consultation</span>
                    <Select
                      defaultValue={consultation.status}
                      onValueChange={(value) => handleStatusChange(consultation.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{consultation.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{consultation.email}</span>
                    </div>
                    {consultation.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{consultation.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(consultation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{consultation.time || "Not specified"}</span>
                    </div>
                    {consultation.message && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">{consultation.message}</p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Booked on: {new Date(consultation.created_at).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
