import { X, LogIn } from "lucide-react";
import { shpeLogo } from "@/assets/images";
import { contact } from "@/data/navigation";

// The "Member Login" pop-up. Clicking "Sign in with Slack" sends the member to
// Slack to authenticate; the backend brings them back logged in. Only people in
// the SHPE MIT Slack workspace can sign in. See apps-script/ for the backend.

export function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#f8f8f7] w-full max-w-md p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        <div className="mb-6">
          <div className="mb-5">
            <img src={shpeLogo} alt="SHPE MIT" className="h-8 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-[#001F5B] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Member Login</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in with Slack to see your points, history, and more.</p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={onLogin}
            className="flex items-center justify-center gap-2 py-3 bg-[#FD652F] text-white font-bold hover:bg-[#D33A02] transition-all duration-300"
          >
            <LogIn size={16} /> Sign in with Slack
          </button>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Only members of the SHPE MIT Slack can sign in. Need access?{" "}
            <span className="text-[#FD652F]">{contact.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
