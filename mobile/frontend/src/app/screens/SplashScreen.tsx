import { useNavigate } from "react-router";
import { Shield, Check, Briefcase } from "lucide-react";
import { Button } from "../components/ui/button";

export function SplashScreen() {
  const navigate = useNavigate();

  const partners = [
    { name: "Zomato", color: "text-red-600" },
    { name: "Swiggy", color: "text-orange-600" },
    { name: "Blinkit", color: "text-yellow-600" },
    { name: "Amazon", color: "text-blue-600" },
    { name: "Zepto", color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Logo and Tagline */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo - Shield with Checkmark and Briefcase fusion */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <div className="relative">
              <Shield className="w-20 h-20 text-white" strokeWidth={2} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
                </div>
              </div>
              <Briefcase className="w-8 h-8 text-emerald-100 absolute -bottom-1 -right-1" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3">WorkSure</h1>
        <p className="text-xl text-gray-600 mb-12">Work More. Worry Less.</p>

        {/* Platform Partner Badges */}
        <div className="mb-12">
          <p className="text-sm text-gray-500 text-center mb-4">Trusted by workers from</p>
          <div className="flex flex-wrap justify-center gap-3">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200"
              >
                <span className={`font-semibold ${partner.color}`}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={() => navigate("/persona")}
          className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200"
        >
          Get Started
        </Button>

        {/* Login Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 border-2 border-gray-200 rounded-xl"
              onClick={() => navigate("/persona")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button
              variant="outline"
              className="h-12 border-2 border-gray-200 rounded-xl"
              onClick={() => navigate("/persona")}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              Phone
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}