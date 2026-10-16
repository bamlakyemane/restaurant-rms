import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, FormField, Card } from "../components/ui";
import { APP_NAME } from "../utils/constants";

const DEMO = [
  { role: "Admin", email: "admin@rms.dev", pin: "1111" },
  { role: "Waiter", email: "waiter@rms.dev", pin: "2222" },
  { role: "Chef", email: "chef@rms.dev", pin: "3333" },
];

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, pin);
      navigate(from, { replace: true });
    } catch {
      /* toast already shown */
    }
  };

  const quickFill = (d) => {
    setEmail(d.email);
    setPin(d.pin);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-center">
        {/* Left: brand + demo accounts */}
        <div className="hidden md:block">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
          <p className="text-gray-600 mb-6">
            Sign in to manage orders and your team.
          </p>

          <div className="space-y-2">
            {DEMO.map((d) => (
              <button
                key={d.email}
                onClick={() => quickFill(d)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-brand-500 hover:bg-brand-50/40 transition text-left"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">{d.role}</p>
                  <p className="text-xs text-gray-500">
                    {d.email} · PIN {d.pin}
                  </p>
                </div>
                <span className="text-xs text-brand-600 font-medium">
                  Use →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <Card className="p-6 md:p-8">
          <div className="md:hidden text-center mb-4">
            <div className="text-4xl mb-2">🍽️</div>
            <h1 className="text-xl font-bold text-gray-900">{APP_NAME}</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">
            Use your staff credentials.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Email" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@rms.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="PIN" htmlFor="pin" required>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </FormField>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              icon={LogIn}
            >
              Sign in
            </Button>
          </form>

          {/* Mobile demo shortcuts */}
          <div className="md:hidden mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick fill:</p>
            <div className="flex gap-2">
              {DEMO.map((d) => (
                <Button
                  key={d.role}
                  size="sm"
                  variant="secondary"
                  onClick={() => quickFill(d)}
                >
                  {d.role}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
