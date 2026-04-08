import { useState, useRef } from "react";

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
  body { background: #FDF6F0; font-family: 'Jost', sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #FDE8ED; }
  ::-webkit-scrollbar-thumb { background: #5C1F3A; border-radius: 3px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  .nav-link { color: #FDF6F0; text-decoration: none; font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.85; transition: opacity 0.2s; cursor: pointer; background: none; border: none; }
  .nav-link:hover { opacity: 1; }
  .section-label { font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: #C8A96E; margin-bottom: 12px; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; color: #1C1118; line-height: 1.15; margin-bottom: 16px; }
  .section-subtitle { font-family: 'Jost', sans-serif; font-size: 0.95rem; color: #8A7080; font-weight: 300; line-height: 1.7; }
  .btn-primary { background: #5C1F3A; color: #FDF6F0; border: none; padding: 14px 32px; font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; border-radius: 2px; }
  .btn-primary:hover { background: #7A2850; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(92,31,58,0.3); }
  .btn-outline { background: transparent; color: #5C1F3A; border: 1.5px solid #5C1F3A; padding: 13px 32px; font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; border-radius: 2px; }
  .btn-outline:hover { background: #5C1F3A; color: #FDF6F0; }
  .tab-btn { background: none; border: none; font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; padding: 10px 20px; border-radius: 30px; transition: all 0.2s; color: #8A7080; }
  .tab-btn.active { background: #5C1F3A; color: #FDF6F0; }
  .day-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; border-radius: 50%; cursor: pointer; transition: all 0.2s; font-family: 'Jost', sans-serif; color: #1C1118; border: 1.5px solid transparent; }
  .day-cell:hover:not(.empty):not(.past) { border-color: #5C1F3A; color: #5C1F3A; }
  .day-cell.selected { background: #5C1F3A; color: white; }
  .day-cell.today { border-color: #C8A96E; color: #C8A96E; font-weight: 600; }
  .day-cell.past { opacity: 0.3; cursor: not-allowed; }
  .day-cell.empty { cursor: default; }
  .time-slot { padding: 9px 16px; border: 1.5px solid #F2C4CE; border-radius: 6px; font-family: 'Jost', sans-serif; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; background: white; color: #1C1118; text-align: center; }
  .time-slot:hover { border-color: #5C1F3A; color: #5C1F3A; }
  .time-slot.selected { background: #5C1F3A; color: white; border-color: #5C1F3A; }
  .time-slot.booked { opacity: 0.35; cursor: not-allowed; background: #FDE8ED; }
  .policy-item { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #FDE8ED; align-items: flex-start; }
  .gallery-cell { border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; }
  .gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
  .gallery-cell:hover img { transform: scale(1.05); }
  .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(28,17,24,0.7), transparent 50%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 16px; }
  .gallery-cell:hover .gallery-overlay { opacity: 1; }
  input, select, textarea { width: 100%; padding: 12px 16px; border: 1.5px solid #F2C4CE; border-radius: 6px; font-family: 'Jost', sans-serif; font-size: 0.9rem; color: #1C1118; background: white; outline: none; transition: border-color 0.2s; }
  input:focus, select:focus, textarea:focus { border-color: #5C1F3A; }
  label { font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7080; margin-bottom: 6px; display: block; }
  .star { color: #C8A96E; font-size: 1rem; }
`;

const GALLERY_PHOTOS = [
  { file: "nail 1.jpg", label: "Set 1" },
  { file: "nail 2.jpg", label: "Set 2" },
  { file: "nail 3.jpg", label: "Set 3" },
  { file: "nail 4.jpg", label: "Set 4" },
  { file: "nail 5.jpg", label: "Set 5" },
  { file: "nail 6.jpg", label: "Set 6" },
  { file: "nail 7.jpg", label: "Set 7" },
  { file: "nail 8.jpg", label: "Set 8" },
  { file: "nail 9.jpg", label: "Set 9" },
];

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
    { name: "Acrylic Fill", desc: "2-3 week maintenance fill", price: 45, time: "60 min" },
    { name: "Dip Powder", desc: "Strong & lightweight dip color", price: 55, time: "60 min" },
    { name: "Press-On Application", desc: "Custom press-on sets applied", price: 40, time: "45 min" },
  ]},
  { cat: "Nail Art", items: [
    { name: "Simple Nail Art", desc: "Per nail designs, 1-2 colors", price: 5, time: "per nail" },
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

const REVIEWS = [
  { name: "Aaliyah M.", rating: 5, text: "Era Nails is absolutely the best. My gel set lasted over 3 weeks without a single chip. The vibe is immaculate.", date: "March 2025", service: "Gel Manicure" },
  { name: "Destiny R.", rating: 5, text: "I drive 40 minutes just to come here. The nail art is unmatched. Stunning.", date: "March 2025", service: "Nail Art" },
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

const NAV_ITEMS = ["Services", "Gallery", "Book", "Reviews", "Policy"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function Logo({ size = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, background: "linear-gradient(135deg, #C8A96E, #E8D5A8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(200,169,110,0.4)" }}>
        <span style={{ fontSize: size * 0.45 }}>💅</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: size * 0.58, fontWeight: 300, color: "#FDF6F0", letterSpacing: "0.08em", lineHeight: 1 }}>ERA</div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: size * 0.28, fontWeight: 500, letterSpacing: "0.32em", color: "#C8A96E", textTransform: "uppercase", lineHeight: 1, marginTop: 2 }}>NAILS</div>
      </div>
    </div>
  );
}

function Stars({ n }) {
  return <span>{Array.from({ length: 5 }, (_, i) => <span key={i} className="star">{i < n ? "★" : "☆"}</span>)}</span>;
}

export default function EraApp() {
  const [section, setSection] = useState("home");
  const [serviceTab, setServiceTab] = useState("Classic");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [bookForm, setBookForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [bookDone, setBookDone] = useState(false);
  const [galleryHover, setGalleryHover] = useState(null);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderDone, setReminderDone] = useState(false);
  const topRef = useRef(null);

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const navigate = (s) => {
    setSection(s);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();

  const isPast = (d) => new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const renderCalendar = () => {
    const days = getDaysInMonth(calMonth, calYear);
    const firstDay = getFirstDay(calMonth, calYear);
    const cells = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#5C1F3A" }}>‹</button>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#1C1118" }}>{MONTH_NAMES[calMonth]} {calYear}</span>
          <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#5C1F3A" }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign: "center", fontSize: "0.7rem", fontFamily: "'Jost', sans-serif", color: "#8A7080", padding: "4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            const isToday = d && d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
            const past = d && isPast(d);
            const sel = selectedDay === d;
            let cls = "day-cell" + (!d ? " empty" : past ? " past" : (isToday ? " today" : "") + (sel ? " selected" : ""));
            return <div key={i} className={cls} onClick={() => { if (d && !past) { setSelectedDay(d); setSelectedTime(null); } }}>{d || ""}</div>;
          })}
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div>
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #5C1F3A 0%, #3A0E25 50%, #1C1118 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 400, height: 400, top: -100, right: -80, background: "rgba(200,169,110,0.08)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, bottom: 50, left: -60, background: "rgba(242,196,206,0.1)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <nav style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
          <Logo />
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_ITEMS.map(s => <button key={s} className="nav-link" onClick={() => navigate(s.toLowerCase())}>{s}</button>)}
            <button className="btn-primary" style={{ padding: "10px 24px" }} onClick={() => navigate("book")}>Book Now</button>
          </div>
        </nav>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px 80px", animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C8A96E", marginBottom: 24 }}>✦ Luxury Nail Studio ✦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(3.5rem, 10vw, 7rem)", lineHeight: 0.95, color: "#FDF6F0", marginBottom: 8 }}>Era Nails</h1>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1.2rem, 3vw, 1.8rem)", color: "#F2C4CE", marginBottom: 32, opacity: 0.85 }}>Where every set tells a story.</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-primary" style={{ fontSize: "0.82rem", padding: "16px 40px" }} onClick={() => navigate("book")}>Book an Appointment</button>
            <button className="btn-outline" style={{ borderColor: "#F2C4CE", color: "#F2C4CE", fontSize: "0.82rem", padding: "16px 40px" }} onClick={() => navigate("services")}>View Services</button>
          </div>
          <div style={{ display: "flex", gap: 48, marginTop: 72, flexWrap: "wrap", justifyContent: "center" }}>
            {[["500+","Happy Clients"],["4.9★","Rating"],["3+","Years Experience"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "#C8A96E" }}>{num}</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#F2C4CE", opacity: 0.7 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite", opacity: 0.5, color: "#F2C4CE", fontSize: "1.5rem" }}>⌄</div>
      </div>
      <div style={{ background: "#C8A96E", padding: "20px 40px", display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
        {[["✦ Online Booking","Book 24/7"],["✦ Appointment Reminders","Never miss a slot"],["✦ Real Photos","See the actual work"]].map(([t, s]) => (
          <div key={t} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5C1F3A" }}>{t}</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#7A2850", opacity: 0.8, marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => {
    const cat = SERVICES.find(s => s.cat === serviceTab);
    return (
      <div style={{ minHeight: "100vh", background: "#FDF6F0", padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="section-label">Menu</div>
          <h2 className="section-title">Services & Pricing</h2>
          <p className="section-subtitle" style={{ marginBottom: 40, maxWidth: 520 }}>Every service is performed with premium products, sanitary tools, and an eye for detail.</p>
          <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", marginBottom: 36, background: "#FDE8ED", padding: 6, borderRadius: 40 }}>
            {SERVICES.map(s => <button key={s.cat} className={`tab-btn ${serviceTab === s.cat ? "active" : ""}`} onClick={() => setServiceTab(s.cat)}>{s.cat}</button>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: "white", borderRadius: i === 0 ? "12px 12px 0 0" : i === cat.items.length - 1 ? "0 0 12px 12px" : 0, borderBottom: i < cat.items.length - 1 ? "1px solid #FDE8ED" : "none", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FDE8ED"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#1C1118", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#8A7080" }}>{item.desc} · {item.time}</div>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, color: "#5C1F3A" }}>${item.price}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: 20, background: "linear-gradient(135deg, #FDE8ED, white)", borderRadius: 12, borderLeft: "3px solid #C8A96E" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "#8A7080" }}>✦ All prices are starting prices and may vary based on nail length, complexity, and design requests.</div>
          </div>
          <div style={{ marginTop: 40, textAlign: "center" }}><button className="btn-primary" onClick={() => navigate("book")}>Book a Service</button></div>
        </div>
      </div>
    );
  };

  const renderGallery = () => (
    <div style={{ minHeight: "100vh", background: "#FDF6F0", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="section-label">Portfolio</div>
        <h2 className="section-title">The Work</h2>
        <p className="section-subtitle" style={{ marginBottom: 48, maxWidth: 500 }}>Real sets, real clients, real results from the Era studio.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {GALLERY_PHOTOS.map((photo, i) => (
            <div key={i} className="gallery-cell" style={{ aspectRatio: i % 3 === 1 ? "0.8" : "1" }}
              onMouseEnter={() => setGalleryHover(i)} onMouseLeave={() => setGalleryHover(null)}>
              <img src={`/gallery/${photo.file}`} alt={photo.label} />
              <div className="gallery-overlay">
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontSize: "1rem" }}>{photo.label}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", color: "#C8A96E", fontSize: "0.7rem", letterSpacing: "0.15em" }}>ERA NAILS</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#8A7080", marginBottom: 16 }}>Follow Era Nails on TikTok & Facebook for daily inspo ✨</p>
          <button className="btn-outline" onClick={() => navigate("book")}>Book Your Set</button>
        </div>
      </div>
    </div>
  );

  const renderBook = () => (
    <div style={{ minHeight: "100vh", background: "#FDF6F0", padding: "80px 40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="section-label">Scheduling</div>
        <h2 className="section-title">Book an Appointment</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>Select your service, choose a time, and we'll confirm everything. Reminders sent 24h & 1h before.</p>
        {bookDone ? (
          <div style={{ background: "white", borderRadius: 20, padding: 60, textAlign: "center", boxShadow: "0 4px 40px rgba(92,31,58,0.08)", animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#1C1118", marginBottom: 12 }}>You're booked, {bookForm.name}!</h3>
            <p style={{ fontFamily: "'Jost', sans-serif", color: "#8A7080", marginBottom: 8 }}>{MONTH_NAMES[calMonth]} {selectedDay}, {calYear} at {selectedTime}</p>
            <p style={{ fontFamily: "'Jost', sans-serif", color: "#8A7080", marginBottom: 8 }}>Service: <strong>{selectedService}</strong></p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#8A7080", marginBottom: 32 }}>📱 A confirmation will be sent to {bookForm.phone}. Reminders will go out 24h and 1h before.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-primary" onClick={() => { setBookDone(false); setSelectedDay(null); setSelectedTime(null); setBookForm({ name: "", phone: "", email: "", notes: "" }); }}>Book Another</button>
              <button className="btn-outline" onClick={() => navigate("policy")}>View Policy</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(92,31,58,0.06)" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#1C1118", marginBottom: 20 }}>Select a Date</div>
              {renderCalendar()}
              {selectedDay && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#1C1118", marginBottom: 14 }}>Available Times — {MONTH_NAMES[calMonth]} {selectedDay}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {TIMES.map(({ t, booked }) => (
                      <div key={t} className={`time-slot ${booked ? "booked" : ""} ${selectedTime === t ? "selected" : ""}`} onClick={() => !booked && setSelectedTime(t)}>{t}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(92,31,58,0.06)" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#1C1118", marginBottom: 20 }}>Your Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label>Service</label>
                  <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                    <option value="">Choose a service…</option>
                    {SERVICES.flatMap(c => c.items).map(s => <option key={s.name} value={s.name}>{s.name} — ${s.price}</option>)}
                  </select>
                </div>
                <div><label>Full Name *</label><input placeholder="Your name" value={bookForm.name} onChange={e => setBookForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label>Phone Number *</label><input placeholder="(555) 000-0000" value={bookForm.phone} onChange={e => setBookForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><label>Email (for reminders)</label><input placeholder="you@email.com" value={bookForm.email} onChange={e => setBookForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div><label>Notes / Inspo</label><textarea rows={3} placeholder="Describe your vision…" value={bookForm.notes} onChange={e => setBookForm(f => ({ ...f, notes: e.target.value }))} /></div>
                {(selectedDay || selectedTime || selectedService) && (
                  <div style={{ background: "#FDE8ED", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", color: "#5C1F3A", textTransform: "uppercase", marginBottom: 8 }}>Your Booking</div>
                    {selectedService && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#1C1118" }}>💅 {selectedService}</div>}
                    {selectedDay && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#1C1118" }}>📅 {MONTH_NAMES[calMonth]} {selectedDay}, {calYear}</div>}
                    {selectedTime && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#1C1118" }}>🕐 {selectedTime}</div>}
                  </div>
                )}
                <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => { if (!bookForm.name || !bookForm.phone) return; setBookDone(true); }} disabled={!selectedDay || !selectedTime || !selectedService || !bookForm.name || !bookForm.phone}>Confirm Appointment</button>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#8A7080", textAlign: "center" }}>By booking you agree to our <span style={{ color: "#5C1F3A", cursor: "pointer" }} onClick={() => navigate("policy")}>cancellation policy</span></p>
              </div>
            </div>
          </div>
        )}
        {!bookDone && (
          <div style={{ marginTop: 32, background: "linear-gradient(135deg, #5C1F3A, #8B2252)", borderRadius: 16, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "white" }}>📱 Get Appointment Reminders</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#F2C4CE", marginTop: 6 }}>Sign up for reminders 24 hours and 1 hour before every appointment.</div>
            </div>
            {reminderDone ? (
              <div style={{ fontFamily: "'Jost', sans-serif", color: "#C8A96E", fontWeight: 500 }}>✓ You're signed up!</div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <input style={{ width: 200, borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white" }} placeholder="your@email.com" value={reminderEmail} onChange={e => setReminderEmail(e.target.value)} />
                <button style={{ background: "#C8A96E", color: "#5C1F3A", border: "none", padding: "12px 20px", borderRadius: 6, fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => reminderEmail && setReminderDone(true)}>Sign Up</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div style={{ minHeight: "100vh", background: "#FDF6F0", padding: "80px 40px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="section-label">Client Love</div>
        <h2 className="section-title">What They're Saying</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "5rem", fontWeight: 300, color: "#5C1F3A", lineHeight: 1 }}>4.9</div>
            <Stars n={5} />
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "#8A7080", marginTop: 4 }}>based on 200+ reviews</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 20px rgba(92,31,58,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, color: "#1C1118" }}>{r.name}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#8A7080" }}>{r.service} · {r.date}</div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#1C1118", lineHeight: 1.6, fontStyle: "italic" }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPolicy = () => (
    <div style={{ minHeight: "100vh", background: "#FDF6F0", padding: "80px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="section-label">Important Info</div>
        <h2 className="section-title">Cancellation Policy</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>We respect your time and ask the same in return.</p>
        {[
          { icon:"⏰", title:"48-Hour Cancellation", body:"Cancellations made at least 48 hours before your appointment are fully refunded with no fee. We're happy to reschedule at no charge with proper notice." },
          { icon:"⚠️", title:"Late Cancellations (Under 48 Hours)", body:"Cancellations within 48 hours are subject to a 50% service fee. This helps cover the reserved time that cannot be rebooked on short notice." },
          { icon:"❌", title:"No-Shows", body:"Clients who don't show up without notice will be charged 100% of the service. Repeated no-shows may require prepayment for future bookings." },
          { icon:"🔁", title:"Rescheduling", body:"Happy to reschedule at no charge if done 48+ hours in advance. Same-day reschedules are treated as late cancellations." },
          { icon:"📱", title:"How to Cancel", body:"Cancel or reschedule by replying to your confirmation text or contacting the studio directly. Social media DMs are not guaranteed to be seen in time." },
          { icon:"✦", title:"First-Time Clients", body:"All first-time bookings require a valid phone number for confirmation." },
        ].map((p, i) => (
          <div key={i} className="policy-item">
            <div style={{ fontSize: "1.4rem", minWidth: 32 }}>{p.icon}</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#1C1118", marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#8A7080", lineHeight: 1.7 }}>{p.body}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 40, textAlign: "center" }}><button className="btn-primary" onClick={() => navigate("book")}>Book with Confidence</button></div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FDF6F0" }}>
      <style>{style}</style>
      <div ref={topRef} />
      {section !== "home" && (
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#5C1F3A", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 20px rgba(28,17,24,0.2)" }}>
          <div style={{ cursor: "pointer" }} onClick={() => navigate("home")}><Logo size={30} /></div>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            {NAV_ITEMS.map(s => <button key={s} className={`nav-link ${section === s.toLowerCase() ? "active" : ""}`} onClick={() => navigate(s.toLowerCase())} style={{ fontSize: "0.78rem" }}>{s}</button>)}
            <button className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.75rem" }} onClick={() => navigate("book")}>Book</button>
          </div>
        </nav>
      )}
      {section === "home"     && renderHome()}
      {section === "services" && renderServices()}
      {section === "gallery"  && renderGallery()}
      {section === "book"     && renderBook()}
      {section === "reviews"  && renderReviews()}
      {section === "policy"   && renderPolicy()}
      <footer style={{ background: "#1C1118", padding: "48px 40px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <Logo size={32} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#8A7080", marginTop: 14, maxWidth: 220, lineHeight: 1.7 }}>Luxury nail studio committed to artistry, quality, and you.</p>
            </div>
            <div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96E", marginBottom: 14 }}>Studio</div>
              {NAV_ITEMS.map(l => <div key={l} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#8A7080", marginBottom: 10, cursor: "pointer" }} onClick={() => navigate(l.toLowerCase())}>{l}</div>)}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#8A7080" }}>© 2025 Era Nails. All rights reserved.</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#8A7080" }}>Era Nails on TikTok & Facebook ✦</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
