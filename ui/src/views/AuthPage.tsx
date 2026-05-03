import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Polls from "../components/assets/Polls";

function AuthPage() {
  const location = useLocation();
  const initialTab: "login" | "signup" =
    location.state?.tab === "signup" ? "signup" : "login";
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const justRegistered = location.state?.justRegistered === true;

  // Navigations to /auth from inside the app (e.g. RegisterForm sending the
  // user to the login tab after a successful sign-up) don't unmount this
  // component, so useState's initial value isn't re-evaluated. Sync the tab
  // explicitly when location.state changes.
  useEffect(() => {
    if (location.state?.tab === "signup") setTab("signup");
    else if (location.state?.tab === "login") setTab("login");
  }, [location.state]);

  return (
    <div className="bg-[#02102D] text-[#F4F5F7] min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-6 py-12 gap-10">
        <div className="relative text-center max-w-md">
          <div
            className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] pointer-events-none -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(3,87,238,0.14) 0%, transparent 60%)",
            }}
          />
          <h3 className="inline-block font-mono text-[11px] text-[#7FA8FF] bg-[#0357EE]/15 border border-[#0357EE]/45 px-2.5 py-1 rounded-md tracking-[0.08em] mb-4">
            DREAM VOTE
          </h3>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Let your voice be heard.
          </h1>
          <p className="text-[#9BA9C7]">Nominate. Vote. See results.</p>
        </div>

        <div className="w-full max-w-[400px] bg-[#081A3A] border border-[#1A2D5A] rounded-2xl overflow-hidden">
          <div className="flex gap-1 p-1.5 bg-[#02102D] border-b border-[#1A2D5A]">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                tab === "login"
                  ? "bg-[#0D2145] border border-[#1A2D5A] text-[#F4F5F7]"
                  : "border border-transparent text-[#9BA9C7] hover:text-[#F4F5F7]"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                tab === "signup"
                  ? "bg-[#0D2145] border border-[#1A2D5A] text-[#F4F5F7]"
                  : "border border-transparent text-[#9BA9C7] hover:text-[#F4F5F7]"
              }`}
            >
              Register
            </button>
          </div>
          {justRegistered && tab === "login" && (
            <div className="mx-1.5 mt-2 px-3.5 py-2.5 bg-[rgba(80,200,140,0.10)] border border-[rgba(80,200,140,0.4)] rounded-lg">
              <p className="text-sm text-[#7FE1A8]">
                Account created. Please log in to continue.
              </p>
            </div>
          )}
          {tab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>

      <div className="hidden lg:block border-l border-[#1A2D5A] bg-[#050D24] relative overflow-hidden">
        <Polls
        // preserveAspectRatio="xMidYMid slice"
        // className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

export default AuthPage;
