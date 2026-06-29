import { useState } from "react";
import { Mail, MapPin, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { contact } from "@/data/navigation";

// The "Contact" page: chapter contact info + a message form.
//
// NOTE: The form is currently a demo — submitting it just shows a thank-you
// message and does NOT actually send an email anywhere. To make it send real
// messages, connect it to a form service (e.g. Formspree, Google Forms) or a
// backend in the handleSubmit function below.
//
// Edit the email / location / social links in src/data/navigation.ts.

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const textFields = [
    { label: "Name", key: "name", type: "text", placeholder: "Your full name" },
    { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
    { label: "Subject", key: "subject", type: "text", placeholder: "What is this regarding?" },
  ] as const;

  return (
    <div className="pt-24">
      <PageHeader section="Contact" title="Get in Touch" />
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Left: contact info */}
          <div>
            <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Info</h2>
            <div className="flex flex-col gap-3 mb-10">
              {[
                { icon: <Mail size={15} />, label: "Email", value: contact.email },
                { icon: <MapPin size={15} />, label: "Location", value: contact.location },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 border border-border hover:border-[#FD652F] transition-all duration-300">
                  <div className="text-[#FD652F] mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</div>
                    <div className="text-sm text-[#001F5B] font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="font-bold text-[#001F5B] mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>Follow Us</h3>
            <div className="flex flex-wrap gap-2">
              {contact.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs font-medium border border-border text-muted-foreground hover:border-[#FD652F] hover:text-[#FD652F] transition-all duration-200">{s.label}</a>
              ))}
            </div>
          </div>

          {/* Right: message form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <CheckCircle size={48} className="text-[#FD652F] mb-4" />
                <h3 className="text-2xl font-bold text-[#001F5B] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Message Sent!</h3>
                <p className="text-muted-foreground text-sm">{"Thanks for reaching out. We'll get back to you within 48 hours."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Send a Message</h2>
                {textFields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-3 border border-border focus:outline-none focus:border-[#FD652F] text-sm transition-colors bg-[#f8f8f7]" required />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Message</label>
                  <textarea rows={5} placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-border focus:outline-none focus:border-[#FD652F] text-sm transition-colors resize-none bg-[#f8f8f7]" required />
                </div>
                <button type="submit" className="py-3 bg-[#FD652F] text-white font-bold hover:bg-[#D33A02] transition-all duration-300">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
