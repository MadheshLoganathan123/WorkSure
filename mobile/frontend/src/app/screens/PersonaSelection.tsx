import { useNavigate } from "react-router";
import { ProgressBar } from "../components/ProgressBar";
import { Bike, ShoppingBag, Package } from "lucide-react";

export function PersonaSelection() {
  const navigate = useNavigate();

  const personas = [
    {
      id: "food",
      title: "Food Delivery",
      icon: Bike,
      avgEarnings: "₹8,000 - ₹12,000",
      risks: ["Weather delays", "Traffic accidents", "Peak hour stress"],
      color: "from-orange-400 to-red-500",
    },
    {
      id: "grocery",
      title: "Grocery/Q-Commerce",
      icon: ShoppingBag,
      avgEarnings: "₹10,000 - ₹15,000",
      risks: ["Heavy lifting", "Time pressure", "Vehicle wear"],
      color: "from-green-400 to-emerald-500",
    },
    {
      id: "ecommerce",
      title: "E-Commerce",
      icon: Package,
      avgEarnings: "₹12,000 - ₹18,000",
      risks: ["Long distances", "Package damage", "Fuel costs"],
      color: "from-blue-400 to-indigo-500",
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header with Progress */}
      <div className="px-6 pt-6 pb-4">
        <ProgressBar currentStep={1} totalSteps={4} />
        <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
          What do you deliver?
        </h1>
        <p className="text-gray-600">Select your primary work type</p>
      </div>

      {/* Persona Cards */}
      <div className="flex-1 px-6 py-4 space-y-4">
        {personas.map((persona) => {
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              onClick={() => navigate("/profile", { state: { personaId: persona.id } })}
              className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-emerald-500"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {persona.title}
                  </h3>
                  <p className="text-emerald-600 font-semibold mb-3">
                    {persona.avgEarnings}/week
                  </p>

                  {/* Risk Badges */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Common risks
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {persona.risks.map((risk) => (
                        <span
                          key={risk}
                          className="px-2.5 py-1 bg-red-50 text-red-600 text-xs rounded-full border border-red-200"
                        >
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
