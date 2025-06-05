
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { logout, getConsultations, updateConsultationStatus } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import BackendHealthCheck from "@/components/BackendHealthCheck";

interface Consultation {
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const data = await getConsultations();
      setConsultations(data || []);
    } catch (error) {
      console.error("Failed to load consultations:", error);
      toast({
        title: "Error",
        description: "Failed to load consultations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleStatusUpdate = async (consultationId: string, newStatus: string) => {
    try {
      await updateConsultationStatus(consultationId, newStatus);
      await loadConsultations(); // Reload data
      toast({
        title: "Success",
        description: "Consultation status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock },
      confirmed: { variant: "default" as const, icon: CheckCircle },
      completed: { variant: "outline" as const, icon: CheckCircle },
      cancelled: { variant: "destructive" as const, icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/register-processing")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Processing Team Member
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="health-check">Backend Health</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{consultations.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {consultations.filter(c => c.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Connect backend to view</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processing Team</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Connect backend to view</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Consultations</CardTitle>
                <CardDescription>
                  Manage and track consultation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading consultations...</div>
                ) : consultations.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No consultations found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium">{consultation.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {consultation.email} • {consultation.phone}
                            </p>
                            <p className="text-sm">
                              {consultation.consultationType} • {consultation.destination}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {consultation.date} at {consultation.time}
                            </p>
                            {consultation.message && (
                              <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                                {consultation.message}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(consultation.status)}
                            <select
                              value={consultation.status}
                              onChange={(e) => handleStatusUpdate(consultation.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health-check" className="space-y-6">
            <BackendHealthCheck />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate("/admin/register-processing")}
                    className="w-full justify-start"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Register Processing Team Member
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    More settings will be available once the backend is fully connected.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
