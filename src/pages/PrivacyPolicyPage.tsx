import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: January 4, 2026</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to GlowHabit. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our 
                habit tracking and personal growth application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information that you provide directly to us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (email address, display name)</li>
                <li>Habit and routine data you create and track</li>
                <li>Journal entries and mood data</li>
                <li>Goals and life balance preferences</li>
                <li>App preferences and settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Track your habits, routines, and personal growth progress</li>
                <li>Generate personalized insights and analytics</li>
                <li>Send notifications and reminders (with your permission)</li>
                <li>Respond to your comments, questions, and requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Data Storage & Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is stored securely using industry-standard encryption. Journal entries and personal 
                data are private by default and are never shared with third parties. We implement appropriate 
                technical and organizational measures to protect your personal information against unauthorized 
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Your Privacy Controls</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have control over your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Export your data at any time from the settings</li>
                <li>Delete your account and all associated data</li>
                <li>Manage notification preferences</li>
                <li>Enable optional passcode or biometric protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for authentication and analytics. These services have their 
                own privacy policies, and we encourage you to review them. We do not sell your personal 
                information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Cookies & Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use local storage to save your preferences and app state. This data remains on your device 
                and helps provide a seamless experience across sessions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                GlowHabit is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this privacy policy or our practices, please contact us at{' '}
                <a href="mailto:privacy@glowhabit.app" className="text-primary hover:underline">
                  privacy@glowhabit.app
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
