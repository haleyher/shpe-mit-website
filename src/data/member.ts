// ─────────────────────────────────────────────────────────────────────────────
// MEMBER PORTAL — DEMO DATA
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: The Member Portal is currently a *demo / mock-up*. Logging in does
// not check any real password, and the data below is fake sample data used only
// to show what the portal could look like. If you build a real backend later,
// this is the file you'd replace with real per-member data.
// ─────────────────────────────────────────────────────────────────────────────
export const memberData = {
  name: "Alex Rivera",
  points: 245,
  pointsGoal: 300,
  eventsAttended: 8,
  committees: ["Professional Development", "Events Planning"],
  upcomingEvents: [
    { title: "Tech Industry Panel", date: "Oct 17", time: "6:00 PM", location: "Building 32-123" },
    { title: "SHPE Social: Bowling Night", date: "Nov 1", time: "7:00 PM", location: "Lanes & Games" },
    { title: "Community Tutoring Drive", date: "Nov 15", time: "1:00 PM", location: "Cambridge Library" },
  ],
  joinOptions: [
    { committee: "Professional Development", description: "Help organize workshops, panels, and career fairs. Great for building your own professional network.", openSlots: 3 },
    { committee: "CommServ", description: "Lead K-12 outreach and tutoring programs in the Cambridge and Boston communities.", openSlots: 5 },
    { committee: "Marketing & Design", description: "Create visual content, social media posts, and promotional materials for SHPE events.", openSlots: 2 },
    { committee: "Corporate Relations", description: "Build and maintain relationships with SHPE MIT sponsors and corporate partners.", openSlots: 1 },
  ],
};
