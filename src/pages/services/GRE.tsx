
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calculator, BookText, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRE = () => {
    return (
        <div className="relative overflow-hidden">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 relative overflow-hidden bg-edenz-light/20">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center mb-10">
                            <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                                Test Preparation
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-edenz-dark">
                                GRE Preparation
                            </h1>
                            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                                Maximize your potential for graduate school admission with our intensive GRE coaching program.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">About the GRE</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    The GRE General Test is the world's most widely accepted admissions test for graduate and professional school, including business and law schools. It features question types that closely reflect the kind of thinking you'll do in today's demanding graduate-level programs.
                                </p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Our program covers Verbal Reasoning, Quantitative Reasoning, and Analytical Writing in depth.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Quantitative Strategy",
                                        "Verbal Mastery",
                                        "Analytical Writing",
                                        "Adaptive Testing Info"
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="font-medium text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px]">
                                <img
                                    src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2070"
                                    alt="GRE Preparation"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Structure Section */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-20">
                            <h2 className="text-3xl font-bold mb-10 text-center">GRE Test Sections</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Analytical Writing",
                                        description: "Measures critical thinking and analytical writing skills. Requires you to articulate and support complex ideas."
                                    },
                                    {
                                        title: "Verbal Reasoning",
                                        description: "Measures ability to analyze and draw conclusions from discourse, understand multiple levels of meaning."
                                    },
                                    {
                                        title: "Quantitative Reasoning",
                                        description: "Measures ability to interpret and analyze quantitative information and solve problems using mathematical models."
                                    }
                                ].map((part, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary">
                                            {idx === 0 ? <PenLine /> : idx === 1 ? <BookText /> : <Calculator />}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{part.title}</h3>
                                        <p className="text-gray-600 text-sm">{part.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center bg-primary rounded-3xl p-12 text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Grad School Ready</h2>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                Prepare with the best resources and expert guidance to achieve your target GRE score.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:+923334228697">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold">
                                        Call Now: +92 333 4228697
                                    </Button>
                                </a>
                                <a href="https://wa.me/923334228697" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                                        WhatsApp Us
                                    </Button>
                                </a>
                            </div>
                            <p className="mt-8 text-sm text-white/70">
                                Note: Standardized test preparation fees are non-refundable. <br />
                                By taking our service you agree with our <Link to="/legal" className="underline hover:text-white">legal policies</Link>.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default GRE;
