import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { loginWithEmail, resetPassword } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LogoIcon } from '@/components/brand/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await loginWithEmail(email, password);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Sign in failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    const result = await resetPassword(email);
    setIsResetting(false);

    if (result.success) {
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      });
    } else {
      toast({
        title: "Failed to send reset email",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-calm-lavender/30 via-background to-calm-mist/30 flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-calm-lavender/30 border-t-calm-lavender rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-calm-lavender/30 via-background to-calm-mist/30 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2 px-4 sm:px-6 pt-6 pb-2 sm:pb-4">
            <motion.div 
              className="mx-auto mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <LogoIcon size={48} />
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl font-semibold">Login to Continue</CardTitle>
            <CardDescription className="text-sm">Welcome back! Sign in to continue your journey.</CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-calm-lavender h-11 text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-calm-lavender h-11 text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 touch-target-sm"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="text-sm text-calm-lavender hover:underline disabled:opacity-50 touch-target-sm py-1"
                >
                  {isResetting ? 'Sending...' : 'Forgot Password?'}
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-calm-lavender to-calm-sage hover:opacity-90 text-white h-12 text-base touch-target"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-calm-lavender hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-16 sm:-left-32 w-32 sm:w-64 h-32 sm:h-64 bg-calm-lavender/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-16 sm:-right-32 w-32 sm:w-64 h-32 sm:h-64 bg-calm-sage/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoginPage;
