import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

const AuthModal = ({ open, onOpenChange, onLoginSuccess }: AuthModalProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  // ✅ Auto-login from session/localStorage
  useEffect(() => {
    const sid = sessionStorage.getItem("fsog_session_id") || localStorage.getItem("fsog_session_id");
    if (sid) {
      const name = sessionStorage.getItem(`user_name_${sid}`) || localStorage.getItem(`user_name_${sid}`);
      const email = sessionStorage.getItem(`user_email_${sid}`) || localStorage.getItem(`user_email_${sid}`);
      if (name && email) onLoginSuccess({ name, email });
    }
  }, [onLoginSuccess]);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: loginEmail, Password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // session or persistent storage
        let sid = sessionStorage.getItem("fsog_session_id") || crypto.randomUUID();
        if (rememberMe) localStorage.setItem("fsog_session_id", sid);
        else sessionStorage.setItem("fsog_session_id", sid);

        const user = { name: data.user?.Name, email: data.user?.Email };

        if (rememberMe) {
          localStorage.setItem(`user_name_${sid}`, user.name);
          localStorage.setItem(`user_email_${sid}`, user.email);
        } else {
          sessionStorage.setItem(`user_name_${sid}`, user.name);
          sessionStorage.setItem(`user_email_${sid}`, user.email);
        }

        onLoginSuccess(user);
        toast({ title: "Welcome back!", description: "You've successfully logged in." });
        onOpenChange(false);
      } else {
        toast({ title: "Login failed", description: data.detail || data.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ title: "Error", description: "Unable to connect to server", variant: "destructive" });
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: registerName, Email: registerEmail, Password: registerPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Success!", description: "Account created successfully. Please login." });
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
      } else {
        toast({ title: "Registration failed", description: data.detail || data.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({ title: "Error", description: "Unable to connect to server", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Fifty Shades Of Gravy 🍛</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="your@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</label>
              </div>
              <button className="text-sm text-primary hover:underline">Forgot password?</button>
            </div>
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">Login</Button>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Full Name</Label>
              <Input id="register-name" placeholder="John Doe" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input id="register-email" type="email" placeholder="your@email.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input id="register-password" type="password" placeholder="••••••••" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
            </div>
            <Button onClick={handleRegister} className="w-full bg-primary hover:bg-primary/90">Create Account</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
