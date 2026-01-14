
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Lock } from 'lucide-react';

const TestPrepCheckout = () => {
    const [searchParams] = useSearchParams();
    const serviceParam = searchParams.get('service');

    const services = [
        { id: 'ielts', name: 'IELTS Preparation', price: 70000 },
        { id: 'pte', name: 'PTE Preparation', price: 60000 },
        { id: 'toefl', name: 'TOEFL Preparation', price: 90000 },
        { id: 'gre', name: 'GRE Preparation', price: 150000 },
        { id: 'gmat', name: 'GMAT Preparation', price: 150000 },
    ];

    const [selectedService, setSelectedService] = useState(services[0].id);

    useEffect(() => {
        if (serviceParam) {
            const found = services.find(s => s.id === serviceParam.toLowerCase());
            if (found) {
                setSelectedService(found.id);
            }
        }
    }, [serviceParam]);

    const currentService = services.find(s => s.id === selectedService) || services[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
                        <p className="text-gray-500">Complete your registration for Test Preparation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="md:col-span-1 md:order-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                    <CardDescription>Review your selected plan</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Select Service</Label>
                                        <Select
                                            value={selectedService}
                                            onValueChange={setSelectedService}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {services.map(service => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{currentService.name}</span>
                                        <span className="font-medium">PKR {currentService.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Processing Fee</span>
                                        <span className="font-medium">PKR 0.00</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">PKR {currentService.price.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-50/50 p-4 border-t">
                                    <div className="flex items-start gap-2 text-xs text-gray-500">
                                        <Lock className="h-3 w-3 mt-0.5" />
                                        <p>Guaranteed safe & secure checkout. All transactions are encrypted.</p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Payment Details */}
                        <div className="md:col-span-2 md:order-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Billing Details</CardTitle>
                                    <CardDescription>Enter your information to process the payment</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+92 300 1234567" />
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <Label>Payment Method</Label>
                                        <div className="border rounded-xl p-4 flex items-center justify-between bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-md shadow-sm">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="font-medium">Credit / Debit Card</span>
                                            </div>
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>

                                    <Button className="w-full btn-primary text-lg py-6 mt-4">
                                        Pay PKR {currentService.price.toLocaleString()} Now
                                    </Button>

                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        By clicking the button above, you agree to our Terms of Service and Refund Policy.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TestPrepCheckout;
