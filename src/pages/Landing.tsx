// src/pages/Landing.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../design/colors";

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📊",
      title: "Real-time Analytics",
      description:
        "Transform your M-PESA transactions into actionable business insights instantly.",
    },
    {
      icon: "🤖",
      title: "AI-Powered Intelligence",
      description:
        "Get personalized financial insights and spending predictions powered by AI.",
      ability: "premium",
    },
    {
      icon: "👥",
      title: "Counterparty Analysis",
      description:
        "Understand your business relationships and transaction patterns.",
      ability: "premium",
    },
    {
      icon: "📈",
      title: "Financial Health Score",
      description:
        "Track your financial wellness with our proprietary scoring algorithm.",
    },
    {
      icon: "🔒",
      title: "Bank-Grade Security",
      description:
        "Your financial data is encrypted and protected with enterprise-grade security.",
    },
    {
      icon: "📱",
      title: "Multi-Platform Support",
      description: "Upload CSV, Excel, or PDF statements from any device.",
    },
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "Upload up to 100 transactions/month",
        "Basic transaction tracking",
        "7-day data retention",
        "Email support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For serious financial management",
      features: [
        "Unlimited transactions",
        "AI-powered insights",
        "Counterparty analysis",
        "Advanced analytics",
        "Export reports (PDF/CSV)",
        "Priority support",
        "Unlimited data retention",
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "primary",
      popular: true,
    },
    {
      name: "Business",
      price: "$99",
      period: "per month",
      description: "For teams and growing businesses",
      features: [
        "Everything in Pro",
        "Multi-user access",
        "Team analytics",
        "API access",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom integrations",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
    },
  ];

  return (
    <div style={{ background: "#020617", minHeight: "100vh" }}>
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "sticky",
          top: 0,
          background: "#020617",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "28px" }}>📊</span>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Edrace
          </span>
          <span
            style={{ fontSize: "12px", color: "#3CE6AE", marginLeft: "8px" }}
          >
            Financial Intelligence
          </span>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              background: "transparent",
              border: `1px solid ${colors.border}`,
              color: colors.text.primary,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",
              border: "none",
              color: "#0f172a",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "100px",
            background: "rgba(60,230,174,0.1)",
            border: "1px solid rgba(60,230,174,0.2)",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#3CE6AE",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ color: "#3CE6AE", fontSize: "13px", fontWeight: 600 }}>
            LIVE FINANCIAL INTELLIGENCE
          </span>
        </div>

        <h1
          style={{
            fontSize: "56px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #FFFFFF 0%, #3CE6AE 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "24px",
            lineHeight: 1.2,
          }}
        >
          Transform Your M-PESA Data
          <br />
          Into Financial Intelligence
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: colors.text.secondary,
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Upload your M-PESA statements and get instant AI-powered insights,
          spending analytics, and financial health scores.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",
              border: "none",
              color: "#0f172a",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start Free Trial
          </button>
          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              background: "transparent",
              border: `1px solid ${colors.border}`,
              color: colors.text.primary,
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "60px",
          padding: "60px 20px",
          flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "36px", fontWeight: "bold", color: "#3CE6AE" }}
          >
            10K+
          </div>
          <div style={{ color: colors.text.secondary, marginTop: "8px" }}>
            Transactions Processed
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "36px", fontWeight: "bold", color: "#3CE6AE" }}
          >
            99.9%
          </div>
          <div style={{ color: colors.text.secondary, marginTop: "8px" }}>
            Accuracy Rate
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "36px", fontWeight: "bold", color: "#3CE6AE" }}
          >
            &lt; 5s
          </div>
          <div style={{ color: colors.text.secondary, marginTop: "8px" }}>
            Processing Time
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "36px", fontWeight: "bold", color: "#3CE6AE" }}
          >
            24/7
          </div>
          <div style={{ color: colors.text.secondary, marginTop: "8px" }}>
            AI Insights
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: "16px",
            }}
          >
            Powerful Features for Financial Intelligence
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: colors.text.secondary,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Everything you need to understand and optimize your financial life
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                padding: "30px",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(60,230,174,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: colors.text.primary,
                  marginBottom: "12px",
                }}
              >
                {feature.title}
                {feature.ability === "premium" && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "10px",
                      background: "#6B7280",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      verticalAlign: "middle",
                    }}
                  >
                    PRO
                  </span>
                )}
              </h3>
              <p style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: "16px",
            }}
          >
            See Your Financial Intelligence Dashboard
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: colors.text.secondary,
              marginBottom: "40px",
            }}
          >
            Upload your statement and get instant insights
          </p>

          {/* Mock Dashboard Preview */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "24px",
              padding: "20px",
              border: "1px solid rgba(60,230,174,0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#0f172a",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Money In
                </div>
                <div
                  style={{
                    color: "#22C55E",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES 25,100
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#0f172a",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Money Out
                </div>
                <div
                  style={{
                    color: "#EF4444",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES 15,502
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#0f172a",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Net Flow
                </div>
                <div
                  style={{
                    color: "#3CE6AE",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES 9,598
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#0f172a",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: "#3CE6AE",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                ✨ AI Insight
              </div>
              <div style={{ color: colors.text.primary, fontSize: "14px" }}>
                Your income is stable. You received consistent payments this
                month.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: "16px",
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: "18px", color: colors.text.secondary }}>
            Choose the plan that works for you
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
            alignItems: "stretch",
          }}
        >
          {pricing.map((plan, index) => (
            <div
              key={index}
              style={{
                background: plan.popular
                  ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                  : "rgba(255,255,255,0.03)",
                borderRadius: "24px",
                padding: "32px",
                border: plan.popular
                  ? "1px solid rgba(60,230,174,0.3)"
                  : "1px solid rgba(255,255,255,0.05)",
                position: "relative",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#3CE6AE",
                    color: "#0f172a",
                    padding: "4px 16px",
                    borderRadius: "100px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: colors.text.primary,
                  marginBottom: "8px",
                }}
              >
                {plan.name}
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    fontSize: "48px",
                    fontWeight: 800,
                    color: "#3CE6AE",
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ color: colors.text.secondary }}>
                  /{plan.period}
                </span>
              </div>
              <p
                style={{
                  color: colors.text.secondary,
                  marginBottom: "24px",
                  fontSize: "14px",
                }}
              >
                {plan.description}
              </p>
              <ul
                style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}
              >
                {plan.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    style={{
                      padding: "8px 0",
                      color: colors.text.secondary,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  navigate(plan.name === "Free" ? "/register" : "/register")
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background:
                    plan.buttonVariant === "primary"
                      ? "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)"
                      : "transparent",
                  border:
                    plan.buttonVariant === "primary"
                      ? "none"
                      : `1px solid ${colors.border}`,
                  color:
                    plan.buttonVariant === "primary"
                      ? "#0f172a"
                      : colors.text.primary,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: colors.text.primary,
            marginBottom: "16px",
          }}
        >
          Ready to Take Control of Your Finances?
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: colors.text.secondary,
            marginBottom: "32px",
            maxWidth: "600px",
            margin: "0 auto 32px",
          }}
        >
          Join thousands of users who trust Edrace for their financial
          intelligence
        </p>
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",
            border: "none",
            color: "#0f172a",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "40px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: colors.text.muted,
          fontSize: "12px",
        }}
      >
        <p>© 2026 Edrace Financial Intelligence. All rights reserved.</p>
        <p style={{ marginTop: "8px" }}>
          Built with ❤️ for financial freedom in Africa
        </p>
      </footer>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};
