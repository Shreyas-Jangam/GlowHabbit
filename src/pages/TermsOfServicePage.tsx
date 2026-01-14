import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: January 4, 2026</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using GlowHabit, you agree to be bound by these Terms of Service. If you do not 
                agree to these terms, please do not use our application. These terms apply to all users of the 
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                GlowHabit is a personal growth application that provides habit tracking, routine management, 
                journaling, goal setting, and life balance tools. We reserve the right to modify, suspend, or 
                discontinue any aspect of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you create an account with us, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be at least 13 years of age to use the service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of all content you create within GlowHabit, including habits, journal entries, 
                goals, and other personal data. By using our service, you grant us a limited license to store and 
                process this content solely for the purpose of providing the service to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload malicious code or content</li>
                <li>Violate the rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The GlowHabit application, including its design, features, and content (excluding user content), 
                is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, 
                or create derivative works without our express permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                GlowHabit is provided "as is" and "as available" without warranties of any kind. We do not guarantee 
                that the service will be uninterrupted, secure, or error-free. GlowHabit is a self-improvement tool 
                and is not a substitute for professional medical, psychological, or financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account at any time for violations of these terms. You may also 
                delete your account at any time through the app settings. Upon termination, your right to use the 
                service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes 
                via the app or email. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, without regard to 
                conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@glowhabit.app" className="text-primary hover:underline">
                  legal@glowhabit.app
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
