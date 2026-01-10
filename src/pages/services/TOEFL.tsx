
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Globe, Headphones, PenTool, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOEFL = () => {
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
                                TOEFL iBT Preparation
                            </h1>
                            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                                Prepare for the Test of English as a Foreign Language with our comprehensive strategies tailored for academic success.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">About TOEFL iBT</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    The TOEFL iBT test measures your ability to use and understand English at the university level. It evaluates how well you combine your reading, listening, speaking, and writing skills to perform academic tasks.
                                </p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    It is the preferred English test for universities in the United States, France, and Germany, and widely accepted in Canada and the UK.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Academic Focus",
                                        "Integrated Tasks",
                                        "Skill Building",
                                        "Online Practice"
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
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070"
                                    alt="TOEFL Preparation"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Structure Section */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-20">
                            <h2 className="text-3xl font-bold mb-10 text-center">TOEFL iBT Test Structure</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    {
                                        title: "Reading",
                                        duration: "35 Minutes",
                                        description: "Read passages and answer questions."
                                    },
                                    {
                                        title: "Listening",
                                        duration: "36 Minutes",
                                        description: "Answer questions about brief lectures or classroom discussions."
                                    },
                                    {
                                        title: "Speaking",
                                        duration: "16 Minutes",
                                        description: "Talk about a familiar topic and discuss material you read and heard."
                                    },
                                    {
                                        title: "Writing",
                                        duration: "29 Minutes",
                                        description: "Read a passage, listen to a recording, then write your response."
                                    }
                                ].map((part, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary">
                                            {idx === 0 ? <Globe /> : idx === 1 ? <Headphones /> : idx === 2 ? <MessageCircle /> : <PenTool />}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{part.title}</h3>
                                        <p className="text-sm text-primary font-medium mb-2">{part.duration}</p>
                                        <p className="text-gray-600 text-sm">{part.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center bg-primary rounded-3xl p-12 text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your TOEFL Journey</h2>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                We provide the resources and guidance you need to succeed. Book your consultation today.
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

export default TOEFL;
