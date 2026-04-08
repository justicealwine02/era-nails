import { useState, useEffect, useRef } from "react";

const COLORS = {
  plum: "#5C1F3A",
  plumLight: "#7A2850",
  blush: "#F2C4CE",
  blushLight: "#FDE8ED",
  gold: "#C8A96E",
  goldLight: "#E8D5A8",
  cream: "#FDF6F0",
  charcoal: "#1C1118",
  muted: "#8A7080",
  white: "#FFFFFF",
};

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${COLORS.cream}; font-family: 'Jost', sans-serif; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.blushLight}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.plum}; border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(92,31,58,0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(92,31,58,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(92,31,58,0); }
  }

  .nav-link {
    color: ${COLORS.cream};
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.85;
    transition: opacity 0.2s;
    cursor: pointer;
    background: none;
    border: none;
  }
  .nav-link:hover, .nav-link.active { opacity: 1; }

  .section-label {
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: ${COLORS.gold};
    margin-bottom: 12px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 300;
    color: ${COLORS.charcoal};
    line-height: 1.15;
    margin-bottom: 16px;
  }
  .section-subtitle {
    font-family: 'Jost', sans-serif;
    font-size: 0.95rem;
    color: ${COLORS.muted};
    font-weight: 300;
    line-height: 1.7;
  }

  .btn-primary {
    background: ${COLORS.plum};
    color: ${COLORS.cream};
    border: none;
    padding: 14px 32px;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    border-radius: 2px;
  }
  .btn-primary:hover {
    background: ${COLORS.plumLight};
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(92,31,58,0.3);
  }
  .btn-outline {
    background: transparent;
    color: ${COLORS.plum};
    border: 1.5px solid ${COLORS.plum};
    padding: 13px 32px;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    border-radius: 2px;
  }
  .btn-outline:hover {
    background: ${COLORS.plum};
    color: ${COLORS.cream};
  }

  .service-card:hover .service-arrow { transform: translateX(4px); }

  .star { color: ${COLORS.gold}; font-size: 1rem; }

  .gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .gallery-cell:hover .gallery-img { transform: scale(1.05); }

  .tab-btn {
    background: none;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 30px;
    transition: all 0.2s;
    color: ${COLORS.muted};
  }
  .tab-btn.active {
    background: ${COLORS.plum};
    color: ${COLORS.cream};
  }

  .day-cell {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    color: ${COLORS.charcoal};
    border: 1.5px solid transparent;
  }
  .day-cell:hover:not(.empty):not(.past) { border-color: ${COLORS.plum}; color: ${COLORS.plum}; }
  .day-cell.selected { background: ${COLORS.plum}; color: white; }
  .day-cell.today { border-color: ${COLORS.gold}; color: ${COLORS.gold}; font-weight: 600; }
  .day-cell.past { opacity: 0.3; cursor: not-allowed; }
  .day-cell.empty { cursor: default; }
  .day-cell.has-booking { position: relative; }
  .day-cell.has-booking::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${COLORS.gold};
  }

  .time-slot {
    padding: 9px 16px;
    border: 1.5px solid ${COLORS.blush};
    border-radius: 6px;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    color: ${COLORS.charcoal};
    text-align: center;
  }
  .time-slot:hover { border-color: ${COLORS.plum}; color: ${COLORS.plum}; }
  .time-slot.selected { background: ${COLORS.plum}; color: white; border-color: ${COLORS.plum}; }
  .time-slot.booked { opacity: 0.35; cursor: not-allowed; background: ${COLORS.blushLight}; }

  .policy-item {
    display: flex;
    gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid ${COLORS.blushLight};
    align-items: flex-start;
  }

  .deal-card {
    background: linear-gradient(135deg, ${COLORS.plum} 0%, #8B2252 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    position: relative;
    overflow: hidden;
  }
  .deal-card::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 100px; height: 100px;
    background: rgba(255,255,255,0.07);
    border-radius: 50%;
  }
  .deal-card::after {
    content: '';
    position: absolute;
    bottom: -20px; left: 20px;
    width: 70px; height: 70px;
    background: rgba(200,169,110,0.15);
    border-radius: 50%;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid ${COLORS.blush};
    border-radius: 6px;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    color: ${COLORS.charcoal};
    background: white;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: ${COLORS.plum}; }
  label {
    font-family: 'Jost', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${COLORS.muted};
    margin-bottom: 6px;
    display: block;
  }
`;

const SERVICES = [
  { cat: "Classic", items: [
    { name: "Classic Manicure", desc: "Shape, cuticle care & polish", price: 35, time: "45 min" },
    { name: "Classic Pedicure", desc: "Soak, shape & polish", price: 50, time: "60 min" },
    { name: "Mani + Pedi Combo", desc: "Full service combo", price: 75, time: "90 min" },
  ]},
  { cat: "Gel", items: [
    { name: "Gel Manicure", desc: "Long-lasting chip-free finish", price: 50, time: "60 min" },
    { name: "Gel Pedicure", desc: "Gel on toes with callus removal", price: 65, time: "75 min" },
    { name: "Gel Removal", desc: "Safe soak-off removal", price: 15, time: "20 min" },
  ]},
  { cat: "Enhancements", items: [
    { name: "Acrylic Full Set", desc: "Full set with your choice of shape", price: 70, time: "90 min" },
    { name: "Acrylic Fill", desc: "2–3 week maintenance fill", price: 45, time: "60 min" },
    { name: "Dip Powder", desc: "Strong & lightweight dip color", price: 55, time: "60 min" },
    { name: "Press-On Application", desc: "Custom press-on sets applied", price: 40, time: "45 min" },
  ]},
  { cat: "Nail Art", items: [
    { name: "Simple Nail Art", desc: "Per nail designs, 1–2 colors", price: 5, time: "per nail" },
    { name: "Detailed Nail Art", desc: "Complex designs, gems & chrome", price: 10, time: "per nail" },
    { name: "French Tips", desc: "Classic or colored French", price: 15, time: "add-on" },
    { name: "Chrome Powder", desc: "Mirror & aurora chrome finishes", price: 20, time: "add-on" },
  ]},
  { cat: "Add-Ons", items: [
    { name: "Paraffin Wax Dip", desc: "Hands or feet", price: 15, time: "add-on" },
    { name: "Callus Removal", desc: "Intensive foot treatment", price: 12, time: "add-on" },
    { name: "Nail Repair", desc: "Single nail fix", price: 8, time: "per nail" },
    { name: "Moisturizing Massage", desc: "Extended hand/foot massage", price: 10, time: "add-on" },
  ]},
];

const GALLERY_COLORS = [
  ["#D4A5B4","#C47B9F"],["#8B2252","#F2C4CE"],["#C8A96E","#FDE8ED"],
  ["#5C1F3A","#D4A5B4"],["#F2C4CE","#8B2252"],["#E8D5A8","#5C1F3A"],
  ["#7A2850","#FDF6F0"],["#C8A96E","#5C1F3A"],["#FDE8ED","#C47B9F"],
];

const GALLERY_LABELS = [
  "Ombre Glam","Vintage Rose","Gold Chrome","Deep Plum Set",
  "Soft Blush Gel","Abstract Art","French Twist","Matte Drama","Floral Gem"
];

const REVIEWS = [
  { name: "Aaliyah M.", rating: 5, text: "Era Nails is absolutely the best. My gel set lasted over 3 weeks without a single chip. The vibe is immaculate.", date: "March 2025", service: "Gel Manicure" },
  { name: "Destiny R.", rating: 5, text: "I drive 40 minutes just to come here. The nail art is unmatched — she did a full floral design freehand. Stunning.", date: "March 2025", service: "Nail Art" },
  { name: "Jasmine T.", rating: 5, text: "The press-on sets Era does are insane. People always think I went somewhere expensive. I'm obsessed.", date: "February 2025", service: "Press-On Application" },
  { name: "Brianna K.", rating: 5, text: "Such a relaxing experience. The mani-pedi combo with the paraffin dip was heaven. Will be back every month!", date: "February 2025", service: "Mani + Pedi Combo" },
  { name: "Simone W.", rating: 5, text: "Best dip powder I've ever had. Perfect application and the color selection is so curated. Era is a gem.", date: "January 2025", service: "Dip Powder" },
  { name: "Tiana P.", rating: 4, text: "Love this place. Fast, talented, and the space is so cute. My go-to for special occasions.", date: "January 2025", service: "Acrylic Full Set" },
];

const TIMES = [
  { t: "9:00 AM", booked: false }, { t: "9:30 AM", booked: true },
  { t: "10:00 AM", booked: false }, { t: "10:30 AM", booked: false },
  { t: "11:00 AM", booked: true }, { t: "11:30 AM", booked: false },
  { t: "12:00 PM", booked: false }, { t: "12:30 PM", booked: true },
  { t: "1:00 PM", booked: false }, { t: "1:30 PM", booked: false },
  { t: "2:00 PM", booked: true }, { t: "2:30 PM", booked: false },
  { t: "3:00 PM", booked: false }, { t: "3:30 PM", booked: false },
  { t: "4:00 PM", booked: true }, { t: "4:30 PM", booked: false },
  { t: "5:00 PM", booked: false },
];

const DEALS = [
  { icon: "💅", title: "New Client Welcome", desc: "20% off your first service, app exclusive", badge: "NEW" },
  { icon: "🌙", title: "Late Night Glow", desc: "Book after 4PM — free nail art upgrade", badge: "HOT" },
  { icon: "👭", title: "Bring a Friend", desc: "Both save $15 when you book together", badge: "SHARE" },
  { icon: "⭐", title: "Loyalty Points", desc: "Earn 1pt per $1. 100pts = $10 off", badge: "EARN" },
];

const NAV_ITEMS = ["Services", "Gallery", "Book", "Reviews", "App", "Policy"];

function Logo({ size = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 12px rgba(200,169,110,0.4)",
      }}>
        <span style={{ fontSize: size * 0.45, filter: "grayscale(0)" }}>💅</span>
      </div>
      <div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: size * 0.58,
          fontWeight: 300,
          color: COLORS.cream,
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}>ERA</div>
        <div style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: size * 0.28,
          fontWeight: 500,
          letterSpacing: "0.32em",
          color: COLORS.gold,
          textTransform: "uppercase",
          lineHeight: 1,
          marginTop: 2,
        }}>NAILS</div>
      </div>
    </div>
  );
}

function Stars({ n }) {
  return <span>{Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="star">{i < n ? "★" : "☆"}</span>
  ))}</span>;
}

export default function EraApp() {
  const [section, setSection] = useState("home");
  const [serviceTab, setServiceTab] = useState("Classic");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [bookStep, setBookStep] = useState(1);
  const [bookForm, setBookForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [bookDone, setBookDone] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [galleryHover, setGalleryHover] = useState(null);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderDone, setReminderDone] = useState(false);
  const topRef = useRef(null);

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const bookedDays = [4, 9, 14, 18, 22, 26];

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();

  const monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  const navigate = (s) => {
    setSection(s);
    setMobileNav(false);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const submitBooking = () => {
    if (!bookForm.name || !bookForm.phone) return;
    setBookDone(true);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(calMonth, calYear);
    const firstDay = getFirstDay(calMonth, calYear);
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);

    const isPast = (d) => {
      const dt = new Date(calYear, calMonth, d);
      return dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => {
            if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
            else setCalMonth(m => m - 1);
          }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: COLORS.plum }}>‹</button>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: COLORS.charcoal }}>
            {monthNames[calMonth]} {calYear}
          </span>
          <button onClick={() => {
            if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
            else setCalMonth(m => m + 1);
          }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: COLORS.plum }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: "0.7rem", fontFamily: "'Jost', sans-serif", fontWeight: 500, letterSpacing: "0.1em", color: COLORS.muted, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            const isToday = d && d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
            const past = d && isPast(d);
            const hasBook = d && bookedDays.includes(d);
            const sel = selectedDay === d;
            let cls = "day-cell";
            if (!d) cls += " empty";
            else if (past) cls += " past";
            else {
              if (isToday) cls += " today";
              if (sel) cls += " selected";
              if (hasBook) cls += " has-booking";
            }
            return (
              <div key={i} className={cls} onClick={() => {
                if (d && !past) { setSelectedDay(d); setSelectedTime(null); }
              }}>
                {d || ""}
              </div>
            );
          })}
        </div>
        {selectedDay && (
          <div style={{ marginTop: 6, fontSize: "0.72rem", fontFamily: "'Jost', sans-serif", color: COLORS.muted, textAlign: "center" }}>
            {bookedDays.includes(selectedDay) ? "⚠ Limited slots on this day" : "✓ Good availability"}
          </div>
        )}
      </div>
    );
  };

  // ── Hero ──────────────────────────────────────────────────────────────────
  const renderHome = () => (
    <div>
      {/* Hero */}
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${COLORS.plum} 0%, #3A0E25 50%, #1C1118 100%)`,
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative orbs */}
        {[
          { w:400, h:400, top:-100, right:-80, bg:"rgba(200,169,110,0.08)", blur:80 },
          { w:300, h:300, bottom:50, left:-60, bg:"rgba(242,196,206,0.1)", blur:60 },
          { w:200, h:200, top:"40%", right:"25%", bg:"rgba(200,169,110,0.06)", blur:40 },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", width: o.w, height: o.h,
            top: o.top, right: o.right, bottom: o.bottom, left: o.left,
            background: o.bg, borderRadius: "50%", filter: `blur(${o.blur}px)`,
            pointerEvents: "none",
          }} />
        ))}

        {/* nav */}
        <nav style={{
          padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "relative", zIndex: 10,
        }}>
          <Logo />
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_ITEMS.map(s => (
              <button key={s} className={`nav-link ${section === s.toLowerCase() ? "active" : ""}`}
                onClick={() => navigate(s.toLowerCase())}>
                {s}
              </button>
            ))}
            <button className="btn-primary" style={{ padding: "10px 24px" }} onClick={() => navigate("book")}>
              Book Now
            </button>
          </div>
        </nav>

        {/* hero content */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", textAlign: "center", padding: "40px 20px 80px",
          animation: "fadeUp 0.8s ease forwards",
        }}>
          <div style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 500,
            letterSpacing: "0.35em", textTransform: "uppercase", color: COLORS.gold,
            marginBottom: 24,
          }}>
            ✦ Luxury Nail Studio ✦
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(3.5rem, 10vw, 7rem)", lineHeight: 0.95,
            color: COLORS.cream, marginBottom: 8,
          }}>
            Era Nails
          </h1>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)", color: COLORS.blush,
            marginBottom: 32, opacity: 0.85,
          }}>
            Where every set tells a story.
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-primary" style={{ fontSize: "0.82rem", padding: "16px 40px" }} onClick={() => navigate("book")}>
              Book an Appointment
            </button>
            <button className="btn-outline" style={{
              borderColor: COLORS.blush, color: COLORS.blush, fontSize: "0.82rem", padding: "16px 40px"
            }} onClick={() => navigate("services")}>
              View Services
            </button>
          </div>

          {/* stats */}
          <div style={{
            display: "flex", gap: 48, marginTop: 72, flexWrap: "wrap", justifyContent: "center",
          }}>
            {[["500+","Happy Clients"], ["4.9★","Rating"], ["3+","Years Experience"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: COLORS.gold }}>{num}</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.blush, opacity: 0.7 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite", opacity: 0.5, color: COLORS.blush, fontSize: "1.5rem" }}>⌄</div>
      </div>

      {/* Quick intro strip */}
      <div style={{ background: COLORS.gold, padding: "20px 40px", display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
        {[["✦ Online Booking", "Book 24/7"], ["✦ Appointment Reminders", "Never miss a slot"], ["✦ App Exclusive Deals", "Download the app"]].map(([t, s]) => (
          <div key={t} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.plum }}>{t}</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: COLORS.plumLight, opacity: 0.8, marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Services ──────────────────────────────────────────────────────────────
  const renderServices = () => {
    const cat = SERVICES.find(s => s.cat === serviceTab);
    return (
      <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="section-label">Menu</div>
          <h2 className="section-title">Services & Pricing</h2>
          <p className="section-subtitle" style={{ marginBottom: 40, maxWidth: 520 }}>
            Every service is performed with premium products, sanitary tools, and an eye for detail.
          </p>

          {/* category tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36, background: COLORS.blushLight, padding: 6, borderRadius: 40, display: "inline-flex" }}>
            {SERVICES.map(s => (
              <button key={s.cat} className={`tab-btn ${serviceTab === s.cat ? "active" : ""}`}
                onClick={() => setServiceTab(s.cat)}>{s.cat}</button>
            ))}
          </div>

          {/* service list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {cat.items.map((item, i) => (
              <div key={i} className="service-card" style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "22px 28px", background: "white", borderRadius: i === 0 ? "12px 12px 0 0" : i === cat.items.length - 1 ? "0 0 12px 12px" : 0,
                borderBottom: i < cat.items.length - 1 ? `1px solid ${COLORS.blushLight}` : "none",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.blushLight}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: COLORS.charcoal, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: COLORS.muted }}>{item.desc} · {item.time}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, color: COLORS.plum }}>
                    ${item.price}{item.time === "per nail" || item.time === "add-on" ? "" : ""}
                  </div>
                  <span className="service-arrow" style={{ color: COLORS.gold, fontSize: "1.2rem", transition: "transform 0.2s" }}>→</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: 20, background: `linear-gradient(135deg, ${COLORS.blushLight}, white)`, borderRadius: 12, borderLeft: `3px solid ${COLORS.gold}` }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: COLORS.muted }}>
              ✦ All prices are starting prices and may vary based on nail length, complexity, and design requests. Consultations are always free.
            </div>
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button className="btn-primary" onClick={() => navigate("book")}>Book a Service</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Gallery ───────────────────────────────────────────────────────────────
  const renderGallery = () => (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "80px 40px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="section-label">Portfolio</div>
        <h2 className="section-title">The Work</h2>
        <p className="section-subtitle" style={{ marginBottom: 48, maxWidth: 500 }}>
          A curated look at recent sets, nail art, and transformations from the Era studio.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {GALLERY_COLORS.map(([c1, c2], i) => (
            <div key={i} className="gallery-cell" style={{
              aspectRatio: i % 3 === 1 ? "0.8" : "1",
              borderRadius: 12, overflow: "hidden", position: "relative",
              cursor: "pointer",
            }}
              onMouseEnter={() => setGalleryHover(i)}
              onMouseLeave={() => setGalleryHover(null)}
            >
              <div style={{
                width: "100%", height: "100%",
                background: `linear-gradient(${135 + i * 20}deg, ${c1}, ${c2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "3rem", position: "relative",
                transition: "transform 0.5s ease",
                transform: galleryHover === i ? "scale(1.05)" : "scale(1)",
              }}>
                💅
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(28,17,24,0.7), transparent 50%)",
                  display: "flex", alignItems: "flex-end", padding: "16px",
                  opacity: galleryHover === i ? 1 : 0, transition: "opacity 0.3s",
                }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontSize: "1rem" }}>{GALLERY_LABELS[i]}</div>
                    <div style={{ fontFamily: "'Jost', sans-serif", color: COLORS.gold, fontSize: "0.7rem", letterSpacing: "0.15em" }}>VIEW</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.muted, marginBottom: 16 }}>
            Follow @eranails on TikTok & Instagram for daily inspo ✨
          </p>
          <button className="btn-outline" onClick={() => navigate("book")}>Book Your Set</button>
        </div>
      </div>
    </div>
  );

  // ── Book ──────────────────────────────────────────────────────────────────
  const renderBook = () => (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "80px 40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="section-label">Scheduling</div>
        <h2 className="section-title">Book an Appointment</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>
          Select your service, choose a time, and we'll confirm everything. Reminders sent 24h & 1h before.
        </p>

        {bookDone ? (
          <div style={{
            background: "white", borderRadius: 20, padding: 60, textAlign: "center",
            boxShadow: "0 4px 40px rgba(92,31,58,0.08)",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 16, animation: "pulse-ring 2s infinite" }}>✅</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: COLORS.charcoal, marginBottom: 12 }}>
              You're booked, {bookForm.name}!
            </h3>
            <p style={{ fontFamily: "'Jost', sans-serif", color: COLORS.muted, marginBottom: 8 }}>
              {monthNames[calMonth]} {selectedDay}, {calYear} at {selectedTime}
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", color: COLORS.muted, marginBottom: 8 }}>
              Service: <strong>{selectedService}</strong>
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: COLORS.muted, marginBottom: 32 }}>
              📱 A confirmation has been sent to {bookForm.phone}. You'll receive a reminder 24 hours and 1 hour before your appointment.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-primary" onClick={() => { setBookDone(false); setBookStep(1); setSelectedDay(null); setSelectedTime(null); setBookForm({ name: "", phone: "", email: "", notes: "" }); }}>
                Book Another
              </button>
              <button className="btn-outline" onClick={() => navigate("policy")}>View Policy</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* Calendar */}
            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(92,31,58,0.06)" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: COLORS.charcoal, marginBottom: 20 }}>
                Select a Date
              </div>
              {renderCalendar()}

              {selectedDay && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: COLORS.charcoal, marginBottom: 14 }}>
                    Available Times — {monthNames[calMonth]} {selectedDay}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {TIMES.map(({ t, booked }) => (
                      <div key={t} className={`time-slot ${booked ? "booked" : ""} ${selectedTime === t ? "selected" : ""}`}
                        onClick={() => !booked && setSelectedTime(t)}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(92,31,58,0.06)" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: COLORS.charcoal, marginBottom: 20 }}>
                Your Details
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label>Service</label>
                  <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                    <option value="">Choose a service…</option>
                    {SERVICES.flatMap(c => c.items).map(s => (
                      <option key={s.name} value={s.name}>{s.name} — ${s.price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Full Name *</label>
                  <input placeholder="Your name" value={bookForm.name} onChange={e => setBookForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label>Phone Number *</label>
                  <input placeholder="(555) 000-0000" value={bookForm.phone} onChange={e => setBookForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label>Email (for reminders)</label>
                  <input placeholder="you@email.com" value={bookForm.email} onChange={e => setBookForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label>Notes / Inspo</label>
                  <textarea rows={3} placeholder="Describe your vision, share inspo…" value={bookForm.notes} onChange={e => setBookForm(f => ({ ...f, notes: e.target.value }))} />
                </div>

                {/* booking summary */}
                {(selectedDay || selectedTime || selectedService) && (
                  <div style={{ background: COLORS.blushLight, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", color: COLORS.plum, textTransform: "uppercase", marginBottom: 8 }}>Your Booking</div>
                    {selectedService && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.charcoal }}>💅 {selectedService}</div>}
                    {selectedDay && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.charcoal }}>📅 {monthNames[calMonth]} {selectedDay}, {calYear}</div>}
                    {selectedTime && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.charcoal }}>🕐 {selectedTime}</div>}
                  </div>
                )}

                <button className="btn-primary" style={{ marginTop: 8 }}
                  onClick={submitBooking}
                  disabled={!selectedDay || !selectedTime || !selectedService || !bookForm.name || !bookForm.phone}>
                  Confirm Appointment
                </button>

                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: COLORS.muted, textAlign: "center" }}>
                  By booking you agree to our <span style={{ color: COLORS.plum, cursor: "pointer" }} onClick={() => navigate("policy")}>cancellation policy</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reminder signup */}
        {!bookDone && (
          <div style={{ marginTop: 32, background: `linear-gradient(135deg, ${COLORS.plum}, #8B2252)`, borderRadius: 16, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "white" }}>📱 Get Appointment Reminders</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: COLORS.blush, marginTop: 6 }}>
                Sign up for text & email reminders — 24 hours and 1 hour before every appointment.
              </div>
            </div>
            {reminderDone ? (
              <div style={{ fontFamily: "'Jost', sans-serif", color: COLORS.gold, fontWeight: 500 }}>✓ You're signed up!</div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <input style={{ width: 200, borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="your@email.com" value={reminderEmail} onChange={e => setReminderEmail(e.target.value)} />
                <button style={{ background: COLORS.gold, color: COLORS.plum, border: "none", padding: "12px 20px", borderRadius: 6, fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" }}
                  onClick={() => reminderEmail && setReminderDone(true)}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Reviews ───────────────────────────────────────────────────────────────
  const renderReviews = () => (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "80px 40px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="section-label">Client Love</div>
        <h2 className="section-title">What They're Saying</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "5rem", fontWeight: 300, color: COLORS.plum, lineHeight: 1 }}>4.9</div>
            <Stars n={5} />
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: COLORS.muted, marginTop: 4 }}>based on 200+ reviews</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[5,4,3,2,1].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: COLORS.muted, width: 16 }}>{n}</span>
                <div style={{ width: 160, height: 6, background: COLORS.blushLight, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: COLORS.gold, width: n === 5 ? "88%" : n === 4 ? "10%" : "2%" }} />
                </div>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: COLORS.muted }}>{n === 5 ? "88%" : n === 4 ? "10%" : "2%"}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 16, padding: 28,
              boxShadow: "0 2px 20px rgba(92,31,58,0.05)",
              animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, color: COLORS.charcoal }}>{r.name}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: COLORS.muted }}>{r.service} · {r.date}</div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: COLORS.charcoal, lineHeight: 1.6, fontStyle: "italic" }}>
                "{r.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Leave a review */}
        <div style={{ marginTop: 48, background: "white", borderRadius: 16, padding: 36, boxShadow: "0 2px 20px rgba(92,31,58,0.05)" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: COLORS.charcoal, marginBottom: 8 }}>Leave a Review</h3>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.muted, marginBottom: 24 }}>Had a great experience? We'd love to hear from you.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div><label>Name</label><input placeholder="Your name" /></div>
            <div><label>Service Received</label><input placeholder="e.g. Gel Manicure" /></div>
          </div>
          <div style={{ marginBottom: 16 }}><label>Your Review</label><textarea rows={4} placeholder="Share your experience…" /></div>
          <div style={{ marginBottom: 20 }}>
            <label>Rating</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} className="star" style={{ fontSize: "1.6rem", cursor: "pointer" }}>★</span>
              ))}
            </div>
          </div>
          <button className="btn-primary">Submit Review</button>
        </div>
      </div>
    </div>
  );

  // ── App ───────────────────────────────────────────────────────────────────
  const renderApp = () => (
    <div style={{ minHeight: "100vh", background: COLORS.charcoal, padding: "80px 40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="section-label" style={{ color: COLORS.gold }}>Era App</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 300, color: COLORS.cream, lineHeight: 1.15, marginBottom: 16 }}>
          Your Nails.<br />Your Perks.
        </h2>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", color: COLORS.muted, fontWeight: 300, lineHeight: 1.7, marginBottom: 56, maxWidth: 480 }}>
          Download the Era Nails app for exclusive in-app deals, faster booking, loyalty rewards, and priority slots that aren't available anywhere else.
        </p>

        {/* Deals */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 48 }}>
          {DEALS.map((d, i) => (
            <div key={i} className="deal-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: "1.8rem" }}>{d.icon}</span>
                <span style={{
                  background: COLORS.gold, color: COLORS.plum,
                  fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", fontWeight: 700,
                  letterSpacing: "0.12em", padding: "3px 8px", borderRadius: 20,
                }}>{d.badge}</span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "white", marginBottom: 6, position: "relative", zIndex: 1 }}>{d.title}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", position: "relative", zIndex: 1 }}>{d.desc}</div>
            </div>
          ))}
        </div>

        {/* App features */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 32, marginBottom: 48, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: COLORS.cream, marginBottom: 24 }}>Everything in the App</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {[
              ["📅","Priority Booking","Skip the wait. App users get first access to new slots."],
              ["🔔","Smart Reminders","Customizable push notifications so you're always ready."],
              ["💰","Exclusive Deals","In-app-only discounts, flash sales & seasonal offers."],
              ["⭐","Loyalty Points","Earn & redeem points every time you book through the app."],
              ["📸","Inspo Gallery","Browse & save looks, share your sets, get featured."],
              ["💬","Direct Messaging","Message the studio directly from the app for questions."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 14, padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 500, color: COLORS.cream, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: COLORS.muted, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download CTAs */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[["🍎","App Store","iPhone & iPad"],["🤖","Google Play","Android"]].map(([icon, store, sub]) => (
            <button key={store} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12, padding: "14px 24px", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
              <span style={{ fontSize: "1.6rem" }}>{icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", color: COLORS.muted, letterSpacing: "0.1em" }}>DOWNLOAD ON THE</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", fontWeight: 500, color: COLORS.cream }}>{store}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Policy ────────────────────────────────────────────────────────────────
  const renderPolicy = () => (
    <div style={{ minHeight: "100vh", background: COLORS.cream, padding: "80px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="section-label">Important Info</div>
        <h2 className="section-title">Cancellation Policy</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>
          We respect your time and ask the same in return. Please review our policies before booking.
        </p>

        {[
          { icon: "⏰", title: "48-Hour Cancellation", body: "Cancellations made at least 48 hours before your appointment are fully refunded with no fee. We understand life happens and are happy to reschedule at no charge with proper notice." },
          { icon: "⚠️", title: "Late Cancellations (Under 48 Hours)", body: "Cancellations made within 48 hours of your appointment are subject to a 50% service fee. This fee helps cover the reserved time that cannot be rebooked on short notice." },
          { icon: "❌", title: "No-Shows", body: "Clients who do not show up without any notice will be charged 100% of the service. Repeated no-shows may be required to prepay for future bookings." },
          { icon: "🔁", title: "Rescheduling", body: "Need to move your appointment? We're happy to reschedule at no charge if done 48+ hours in advance. Same-day reschedules are treated as late cancellations." },
          { icon: "📱", title: "How to Cancel", body: "You can cancel or reschedule through the Era Nails app, by replying to your confirmation text, or by calling/texting the studio directly. Cancellations via DM on social media are not guaranteed to be seen in time." },
          { icon: "✦", title: "First-Time Clients", body: "All first-time bookings require a valid phone number for confirmation. A card on file may be requested to secure the appointment." },
        ].map((p, i) => (
          <div key={i} className="policy-item">
            <div style={{ fontSize: "1.4rem", minWidth: 32 }}>{p.icon}</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: COLORS.charcoal, marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.muted, lineHeight: 1.7 }}>{p.body}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 40, background: `linear-gradient(135deg, ${COLORS.plum}18, ${COLORS.blushLight})`, borderRadius: 16, padding: 28 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: COLORS.plum, marginBottom: 8 }}>Questions?</div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: COLORS.muted, lineHeight: 1.7 }}>
            Reach us at <strong style={{ color: COLORS.plum }}>hello@eranails.com</strong> or text us directly. We're always happy to help work something out.
          </div>
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button className="btn-primary" onClick={() => navigate("book")}>Book with Confidence</button>
        </div>
      </div>
    </div>
  );

  const NAV_BG = section === "home" ? "transparent" : COLORS.plum;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream }}>
      <style>{style}</style>
      <div ref={topRef} />

      {/* Sticky nav for non-home */}
      {section !== "home" && (
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: COLORS.plum, padding: "16px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 2px 20px rgba(28,17,24,0.2)",
        }}>
          <div style={{ cursor: "pointer" }} onClick={() => navigate("home")}><Logo size={30} /></div>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            {NAV_ITEMS.map(s => (
              <button key={s} className={`nav-link ${section === s.toLowerCase() ? "active" : ""}`}
                onClick={() => navigate(s.toLowerCase())} style={{ fontSize: "0.78rem" }}>
                {s}
              </button>
            ))}
            <button className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.75rem" }} onClick={() => navigate("book")}>
              Book
            </button>
          </div>
        </nav>
      )}

      {section === "home" && renderHome()}
      {section === "services" && renderServices()}
      {section === "gallery" && renderGallery()}
      {section === "book" && renderBook()}
      {section === "reviews" && renderReviews()}
      {section === "app" && renderApp()}
      {section === "policy" && renderPolicy()}

      {/* Footer */}
      <footer style={{ background: COLORS.charcoal, padding: "48px 40px 32px", marginTop: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <Logo size={32} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: COLORS.muted, marginTop: 14, maxWidth: 220, lineHeight: 1.7 }}>
                Luxury nail studio committed to artistry, quality, and you.
              </p>
            </div>
            {[
              { label: "Studio", links: ["Services", "Gallery", "Book Now", "Reviews"] },
              { label: "Info", links: ["Cancellation Policy", "App", "Reminders", "Contact"] },
            ].map(col => (
              <div key={col.label}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 14 }}>{col.label}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: COLORS.muted, marginBottom: 10, cursor: "pointer" }}
                    onClick={() => navigate(l.toLowerCase().replace(" ", "").replace("booknow","book").replace("cancellationpolicy","policy"))}>
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: COLORS.muted }}>
              © 2025 Era Nails. All rights reserved.
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: COLORS.muted }}>
              @eranails on TikTok & Instagram ✦
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}