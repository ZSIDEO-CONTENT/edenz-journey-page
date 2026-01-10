
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Shield, FileText, Lock, CreditCard } from 'lucide-react';

const LegalPolicies = () => {
    return (
        <div className="relative overflow-hidden">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 relative overflow-hidden bg-edenz-light/20">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center mb-10">
                            <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                                Legal Center
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-edenz-dark">
                                Legal Policies & Terms
                            </h1>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Transparency and trust are at the core of our services. Please review our policies to understand your rights and obligations.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Policies Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: <PrivacyIcon />,
                                    title: "Privacy Policy",
                                    description: "Understand how we collect, use, and protect your personal information.",
                                    link: "/privacy-policy"
                                },
                                {
                                    icon: <TermsIcon />,
                                    title: "Terms of Service",
                                    description: "The rules, regulations, and terms concerning the use of our services.",
                                    link: "/terms-of-service"
                                },
                                {
                                    icon: <CookieIcon />,
                                    title: "Cookies Policy",
                                    description: "Information about how we use cookies to improve your user experience.",
                                    link: "/cookies-policy"
                                },
                                {
                                    icon: <RefundIcon />,
                                    title: "Refund Policy",
                                    description: "Details on our refund eligibility, non-refundable fees, and cancellation terms.",
                                    link: "/refund-policy"
                                }
                            ].map((policy, idx) => (
                                <Link to={policy.link} key={idx} className="block group">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group-hover:border-primary/20 h-full">
                                        <div className="bg-primary/5 text-primary rounded-xl p-3 inline-block mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            {policy.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{policy.title}</h3>
                                        <p className="text-gray-600">{policy.description}</p>
                                        <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                            View Policy →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

// Icons components for cleaner JSX
const PrivacyIcon = () => <Lock className="h-6 w-6" />;
const TermsIcon = () => <FileText className="h-6 w-6" />;
const CookieIcon = () => <Shield className="h-6 w-6" />;
const RefundIcon = () => <CreditCard className="h-6 w-6" />;

export default LegalPolicies;
