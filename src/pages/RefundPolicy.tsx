import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const RefundPolicy = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header / Back button */}
              <div className="mb-8">
                <Link to="/">
                  <Button variant="outline" className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                  Refund & Chargeback Policy
                </h1>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  1. Service Nature
                </h2>
                <p className="mb-6">
                  Edenz Consultant provides professional education consultancy
                  and visa guidance services. Our work includes counselling,
                  documentation assistance, application preparation, university
                  submission support, and visa guidance. Because these are
                  advisory / processing services and not physical products, all
                  fees paid are considered service fees.
                </p>
                <p className="mb-6 font-medium text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                  IMPORTANT: Upfront payments are not refundable as we move through with you for more than 3 to 4 months and sometimes year. This fullfills our operational cost. Consultancy prices may vary from place to place.
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  2. Non-Refundable Services
                </h2>
                <p className="mb-6">
                  Once a service has been started — including consultations,
                  profile evaluation, university/college application processing,
                  document review, Statement of Purpose / Study Plan guidance,
                  or visa file preparation — the related fees become
                  <strong> non-refundable</strong>. This applies even if:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    You change your mind or decide not to continue your
                    application.
                  </li>
                  <li>
                    You are not admitted to a particular institution or program.
                  </li>
                  <li>
                    Your visa is delayed, refused, or put under additional
                    review by the embassy/high commission.
                  </li>
                </ul>
                <p className="mb-6">
                  We do not guarantee admission or visa approval. Final
                  decisions are always made by the educational institution and
                  the respective immigration/visa authorities.
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  3. Refund Eligibility (Before Work Begins)
                </h2>
                <p className="mb-6">
                  If you have paid for a service package and <strong>no work
                    has started yet</strong> — meaning no consultation delivered,
                  no documents collected, no application guidance provided —
                  you may request a cancellation. Approval of such a refund is
                  at the discretion of Edenz Consultant and may be subject to
                  an administrative deduction/processing fee.
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  4. Government / Third-Party Fees
                </h2>
                <p className="mb-6">
                  Any payments made for external fees such as:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>University / college application fees</li>
                  <li>Visa application fees / biometric fees</li>
                  <li>Medical exam fees</li>
                  <li>Courier / attestation / translation / notarization costs</li>
                  <li>Courier / attestation / translation / notarization costs</li>
                  <li>Language tests (IELTS, PTE, TOEFL, etc.)</li>
                </ul>
                <p className="mb-6 font-medium text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                  For IELTS, PTE, TOEFL, GRE, and GMAT preparation or booking services, there is a fixed non-refundable fee.
                </p>
                <p className="mb-6">
                  are strictly <strong>non-refundable</strong> because they are
                  paid to third parties, not to Edenz Consultant.
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  5. Chargebacks / Disputes
                </h2>
                <p className="mb-6">
                  By making a payment to Edenz Consultant, you acknowledge and
                  agree to our service-based fee structure. Because services
                  begin immediately (consultation, guidance, application
                  review), attempting to reverse or dispute a legitimate,
                  authorized payment through your bank, card provider, or any
                  other payment channel after services have been delivered is
                  considered an unauthorized chargeback.
                </p>
                <p className="mb-6">
                  In the event of an unauthorized chargeback, Edenz Consultant
                  reserves the right to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Provide evidence of delivered services to the payment provider</li>
                  <li>Suspend all ongoing and future services</li>
                  <li>Initiate recovery actions for outstanding balances</li>
                </ul>

                <h2 className="text-2xl font-bold mb-4">
                  6. Visa Refusal & Outcome Disclaimer
                </h2>
                <p className="mb-6">
                  Visa approval is fully controlled by the respective embassy,
                  consulate, or immigration authority of the destination
                  country. Edenz Consultant cannot influence their decision.
                  Therefore, <strong>no refund</strong> will be issued on the
                  basis of a visa refusal, delay, or additional document
                  request from immigration.
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  7. How to Contact Us
                </h2>
                <p className="mb-2">
                  If you believe there has been an error in billing, or you
                  would like to request a review of your case, please contact:
                </p>
                <p className="mb-6">
                  <strong>Email:</strong> info@edenzconsultant.org
                  <br />
                  <strong>Phone / WhatsApp:</strong> {/* put your office number here */}
                </p>

                <p className="text-sm text-gray-600">
                  We will review your request in good faith and respond with
                  available options based on service progress and documentation
                  status.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
