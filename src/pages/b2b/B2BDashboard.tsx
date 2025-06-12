
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logoutB2B } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const B2BDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('b2bUser');
    if (userString) {
      setUserData(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    logoutB2B();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the B2B portal",
    });
    navigate('/b2b/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold">B2B Partner Portal</h1>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome, {userData?.name || 'Partner'}!
          </h2>
          <p className="text-gray-600">
            Manage your partnership and track student referrals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Referred Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-gray-600 mt-1">
                Total referrals
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Active Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm text-gray-600 mt-1">
                In progress
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Commission Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$3,200</div>
              <div className="text-sm text-gray-600 mt-1">
                This month
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <CardDescription>
              Latest student referrals and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-gray-600">Canada - University of Toronto</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Approved
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">UK - University of London</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Pending
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                <div>
                  <p className="font-medium">Mike Davis</p>
                  <p className="text-sm text-gray-600">Australia - University of Sydney</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  In Review
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BDashboard;
