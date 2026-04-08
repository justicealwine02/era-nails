import { useState, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #F4F7F4; font-family: 'Jost', sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #D9E8D9; }
  ::-webkit-scrollbar-thumb { background: #1B3A2D; border-radius: 3px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  .nav-link { color: #F4F7F4; text-decoration: none; font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.85; transition: opacity 0.2s; cursor: pointer; background: none; border: none; }
  .nav-link:hover { opacity: 1; }
  .section-label { font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: #C8A96E; margin-bottom: 12px; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; color: #0F1F18; line-height: 1.15; margin-bottom: 16px; }
  .section-subtitle { font-family: 'Jost', sans-serif; font-size: 0.95rem; color: #4A6358; font-weight: 300; line-height: 1.7; }
  .btn-primary { background: #1B3A2D; color: #F4F7F4; border: none; padding: 14px 32px; font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; border-radius: 2px; }
  .btn-primary:hover { background: #2A5240; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(27,58,45,0.3); }
  .btn-outline { background: transparent; color: #1B3A2D; border: 1.5px solid #1B3A2D; padding: 13px 32px; font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; border-radius: 2px; }
  .btn-outline:hover { background: #1B3A2D; color: #F4F7F4; }
  .tab-btn { background: none; border: none; font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; padding: 10px 20px; border-radius: 30px; transition: all 0.2s; color: #4A6358; }
  .tab-btn.active { background: #1B3A2D; color: #F4F7F4; }
  .policy-item { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #D9E8D9; align-items: flex-start; }
  .gallery-cell { border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; }
  .gallery-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
  .gallery-cell:hover img { transform: scale(1.05); }
  .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,31,24,0.75), transparent 50%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 16px; }
  .gallery-cell:hover .gallery-overlay { opacity: 1; }
  .star { color: #C8A96E; font-size: 1rem; }
  a { color: #1B3A2D; }
`;

const GALLERY_PHOTOS = [
  { file: "nail%201.jpg", label: "Set 1" },
  { file: "nail%202.jpg", label: "Set 2" },
  { file: "nail%203.jpg", label: "Set 3" },
  { file: "nail%204.jpg", label: "Set 4" },
  { file: "nail%205.jpg", label: "Set 5" },
  { file: "nail%206.jpg", label: "Set 6" },
  { file: "nail%207.jpg", label: "Set 7" },
  { file: "nail%208.jpg", label: "Set 8" },
  { file: "nail%209.jpg", label: "Set 9" },
];

const SERVICES = [
  { cat: "Manicures", items: [
    { name: "Gel Manicure", desc: "Long-lasting chip-free gel polish", price: 45, time: "90 min" },
    { name: "Manicure (No Polish)", desc: "Shape, cuticle care, no polish", price: 30, time: "30 min" },
    { name: "Kids Gel Manicure", desc: "Gel manicure for kids", price: 25, time: "45 min" },
  ]},
  { cat: "Full Sets", items: [
    { name: "Builder Gel Full Set", desc: "Strong, lightweight builder gel", price: 55, time: "120 min" },
    { name: "Gel Extensions Full Set", desc: "Natural-looking gel extensions", price: 55, time: "120 min" },
    { name: "Polygel Full Set", desc: "No harsh smell, feels like acrylic", price: 55, time: "120 min" },
  ]},
  { cat: "Fills", items: [
    { name: "Builder Gel Fill", desc: "2-3 week maintenance fill", price: 50, time: "120 min" },
    { name: "Hard Gel Fill", desc: "2-3 week maintenance fill", price: 50, time: "120 min" },
    { name: "Gel Extension Fill", desc: "2-3 week maintenance fill", price: 50, time: "120 min" },
    { name: "Polygel Fill", desc: "2-3 week maintenance fill", price: 50, time: "120 min" },
  ]},
  { cat: "Pedicures", items: [
    { name: "Basic Pedicure", desc: "Soak, shape, cuticle care & polish", price: 48, time: "45 min" },
    { name: "Signature Pedicure", desc: "Everything in basic plus exfoliation", price: 58, time: "60 min" },
    { name: "Luxury Pedicure", desc: "Full treatment with mask & massage", price: 68, time: "75 min" },
  ]},
  { cat: "Extras", items: [
    { name: "Removal", desc: "Safe soak-off removal", price: 20, time: "60 min" },
    { name: "Nail Art — Tier 1", desc: "Simple designs, 1-2 colors", price: 5, time: "per nail" },
    { name: "Nail Art — Tier 2", desc: "Detailed designs & patterns", price: 10, time: "per nail" },
    { name: "Nail Art — Tier 3", desc: "Complex art, gems & chrome", price: 15, time: "per nail" },
  ]},
];

const REVIEWS = [
  { name: "Lisa", rating: 5, text: "It's been awhile since I've had my nails done and I'm so glad I have started back with Lizzie! She explained everything and did wonderful, can't wait till my next visit!!", service: "Gel Manicure" },
  { name: "Kim Schlatter", rating: 5, text: "Today was my 3rd visit to ERA Nails by Lizzie. I started with the poly gel on my first visit and am loving it! I highly recommend you pay Lizzie a visit and see what she can do for your nails! Also love her homemade cuticle oil!", service: "Polygel Full Set" },
  { name: "Bre C.", rating: 5, text: "I had an amazing experience here! I got the polygel — it does not feel any different than acrylic and minus the harsh smell! Lizzie is amazing, friendly and she makes you feel welcomed! My nails came out amazing. I highly recommend ERA By Lizzie to everyone — this is my new go-to nail salon!", service: "Polygel Full Set" },
  { name: "Rachel", rating: 5, text: "I had a great experience with Lizzie. She did a fantastic job on my nails. She was very gentle. I asked lots of questions, and she was more than welcome to answer all of them. I highly recommend.", service: "Gel Manicure" },
];

const NAV_ITEMS = ["Services", "Gallery", "Book", "Reviews", "Policy"];

function Logo({ size = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, background: "linear-gradient(135deg, #C8A96E, #E8D5A8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(200,169,110,0.4)" }}>
        <span style={{ fontSize: size * 0.45 }}>💅</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: size * 0.58, fontWeight: 300, color: "#F4F7F4", letterSpacing: "0.08em", lineHeight: 1 }}>ERA</div>
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
  const [serviceTab, setServiceTab] = useState("Manicures");
  const [galleryHover, setGalleryHover] = useState(null);
  const topRef = useRef(null);

  const navigate = (s) => {
    setSection(s);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const renderHome = () => (
    <div>
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1B3A2D 0%, #0F2D1F 50%, #081A10 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, top: -120, right: -100, background: "rgba(200,169,110,0.07)", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, bottom: 40, left: -80, background: "rgba(200,169,110,0.05)", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none" }} />
        <nav style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
          <Logo />
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_ITEMS.map(s => <button key={s} className="nav-link" onClick={() => navigate(s.toLowerCase())}>{s}</button>)}
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ background: "#C8A96E", color: "#0F1F18", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book Now</a>
          </div>
        </nav>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px 80px", animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C8A96E", marginBottom: 24 }}>✦ Luxury Nail Studio ✦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(3.5rem, 10vw, 7rem)", lineHeight: 0.95, color: "#F4F7F4", marginBottom: 8 }}>ERA</h1>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1.4rem, 4vw, 2.4rem)", color: "#C8A96E", marginBottom: 6, letterSpacing: "0.1em" }}>NAILS</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "#B8D4B8", marginBottom: 8, opacity: 0.8 }}>by Lizzie</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)", color: "#B8D4B8", marginBottom: 40, opacity: 0.6 }}>Where every set tells a story.</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ background: "#C8A96E", color: "#0F1F18", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book an Appointment</a>
            <button className="btn-outline" style={{ borderColor: "#B8D4B8", color: "#B8D4B8", fontSize: "0.82rem", padding: "16px 40px" }} onClick={() => navigate("services")}>View Services</button>
          </div>
          <div style={{ display: "flex", gap: 48, marginTop: 72, flexWrap: "wrap", justifyContent: "center" }}>
            {[["5★","Rating"],["🖌️","Handpainted Nail Art"],["💎","Builder Gel Specialist"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#C8A96E" }}>{num}</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#B8D4B8", opacity: 0.7, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite", opacity: 0.4, color: "#C8A96E", fontSize: "1.5rem" }}>⌄</div>
      </div>
      <div style={{ background: "#C8A96E", padding: "20px 40px", display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
        {[["📞 Call or Text","260-350-9001"],["📧 Email","eranailss@outlook.com"],["📍 Ashley, Indiana","By appointment only"]].map(([t, s]) => (
          <div key={t} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B3A2D" }}>{t}</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#0F2D1F", marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => {
    const cat = SERVICES.find(s => s.cat === serviceTab);
    return (
      <div style={{ minHeight: "100vh", background: "#F4F7F4", padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="section-label">Menu</div>
          <h2 className="section-title">Services & Pricing</h2>
          <p className="section-subtitle" style={{ marginBottom: 40, maxWidth: 520 }}>Every service is performed with premium products, sanitary tools, and an eye for detail. Prices are starting prices and may vary.</p>
          <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", marginBottom: 36, background: "#D9E8D9", padding: 6, borderRadius: 40 }}>
            {SERVICES.map(s => <button key={s.cat} className={`tab-btn ${serviceTab === s.cat ? "active" : ""}`} onClick={() => setServiceTab(s.cat)}>{s.cat}</button>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: "white", borderRadius: i === 0 ? "12px 12px 0 0" : i === cat.items.length - 1 ? "0 0 12px 12px" : 0, borderBottom: i < cat.items.length - 1 ? "1px solid #D9E8D9" : "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#EEF5EE"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#0F1F18", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#4A6358" }}>{item.desc} · {item.time}</div>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, color: "#1B3A2D" }}>${item.price}{item.time === "per nail" ? "/nail" : ""}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: 20, background: "linear-gradient(135deg, #D9E8D9, white)", borderRadius: 12, borderLeft: "3px solid #C8A96E" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "#4A6358" }}>✦ All prices are starting prices and may vary based on nail length, complexity, and design requests.</div>
          </div>
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#1B3A2D", color: "#F4F7F4", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book a Service</a>
          </div>
        </div>
      </div>
    );
  };

  const renderGallery = () => (
    <div style={{ minHeight: "100vh", background: "#F4F7F4", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="section-label">Portfolio</div>
        <h2 className="section-title">The Work</h2>
        <p className="section-subtitle" style={{ marginBottom: 48, maxWidth: 500 }}>Real sets, real clients, real results from ERA Nails by Lizzie in Ashley, Indiana.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {GALLERY_PHOTOS.map((photo, i) => (
            <div key={i} className="gallery-cell" style={{ aspectRatio: i % 3 === 1 ? "0.8" : "1" }}
              onMouseEnter={() => setGalleryHover(i)} onMouseLeave={() => setGalleryHover(null)}>
              <img src={`/gallery/${photo.file}`} alt={photo.label} onError={e => { e.target.style.background = "#D9E8D9"; e.target.style.minHeight = "200px"; }} />
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
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#4A6358", marginBottom: 16 }}>Follow ERA Nails by Lizzie on Facebook for more looks ✨</p>
          <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "transparent", color: "#1B3A2D", border: "1.5px solid #1B3A2D", padding: "13px 32px", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book Your Set</a>
        </div>
      </div>
    </div>
  );

  const renderBook = () => (
    <div style={{ minHeight: "100vh", background: "#F4F7F4", padding: "80px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div className="section-label">Scheduling</div>
        <h2 className="section-title">Book an Appointment</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>Click below to see Lizzie's real-time availability and book your slot instantly. You'll get an automatic confirmation and reminder sent straight to you.</p>
        <div style={{ background: "white", borderRadius: 20, padding: 48, boxShadow: "0 4px 40px rgba(27,58,45,0.08)", marginBottom: 32 }}>
          <div style={{ fontSize: "3rem", marginBottom: 20 }}>📅</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "#0F1F18", marginBottom: 12 }}>Ready to book?</h3>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "#4A6358", marginBottom: 32, lineHeight: 1.7 }}>Lizzie's calendar is live — pick your service, choose a time that works for you, and you're all set. No back and forth needed.</p>
          <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#C8A96E", color: "#0F1F18", padding: "18px 48px", borderRadius: 2, fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.88rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>View Available Times →</a>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#4A6358", marginTop: 20 }}>You'll receive an automatic confirmation + reminders after booking ✦</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #1B3A2D, #0F2D1F)", borderRadius: 16, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, textAlign: "left" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "white" }}>📞 Prefer to call or text?</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#B8D4B8", marginTop: 6 }}>Reach Lizzie at <strong>260-350-9001</strong> or <strong>eranailss@outlook.com</strong></div>
          </div>
          <a href="tel:2603509001" style={{ background: "#C8A96E", color: "#0F1F18", padding: "14px 28px", borderRadius: 6, fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", whiteSpace: "nowrap" }}>Call Now</a>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div style={{ minHeight: "100vh", background: "#F4F7F4", padding: "80px 40px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="section-label">Client Love</div>
        <h2 className="section-title">What They're Saying</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "5rem", fontWeight: 300, color: "#1B3A2D", lineHeight: 1 }}>5.0</div>
            <Stars n={5} />
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "#4A6358", marginTop: 4 }}>all 5-star reviews</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 20px rgba(27,58,45,0.06)", animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, color: "#0F1F18" }}>{r.name}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#4A6358" }}>{r.service}</div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#0F1F18", lineHeight: 1.6, fontStyle: "italic" }}>"{r.text}"</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, background: "white", borderRadius: 16, padding: 32, boxShadow: "0 2px 20px rgba(27,58,45,0.05)", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#0F1F18", marginBottom: 8 }}>Had a great experience?</div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#4A6358", marginBottom: 20 }}>Leave a review on Facebook and help others find ERA Nails by Lizzie.</p>
          <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#1B3A2D", color: "#F4F7F4", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book Your Visit</a>
        </div>
      </div>
    </div>
  );

  const renderPolicy = () => (
    <div style={{ minHeight: "100vh", background: "#F4F7F4", padding: "80px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="section-label">Important Info</div>
        <h2 className="section-title">Cancellation Policy</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>We respect your time and ask the same in return.</p>
        {[
          { icon: "⏰", title: "48-Hour Cancellation", body: "Cancellations made at least 48 hours before your appointment are fully refunded with no fee. We're happy to reschedule at no charge with proper notice." },
          { icon: "⚠️", title: "Late Cancellations (Under 48 Hours)", body: "Cancellations within 48 hours are subject to a 50% service fee. This helps cover the reserved time that cannot be rebooked on short notice." },
          { icon: "❌", title: "No-Shows", body: "Clients who don't show up without notice will be charged 100% of the service. Repeated no-shows may require prepayment for future bookings." },
          { icon: "🔁", title: "Rescheduling", body: "Happy to reschedule at no charge if done 48+ hours in advance. Same-day reschedules are treated as late cancellations." },
          { icon: "📱", title: "How to Cancel", body: "Cancel or reschedule through your Calendly confirmation email or by calling/texting Lizzie directly at 260-350-9001." },
          { icon: "✦", title: "First-Time Clients", body: "All first-time bookings require a valid phone number for confirmation." },
        ].map((p, i) => (
          <div key={i} className="policy-item">
            <div style={{ fontSize: "1.4rem", minWidth: 32 }}>{p.icon}</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#0F1F18", marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#4A6358", lineHeight: 1.7 }}>{p.body}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 32, background: "linear-gradient(135deg, rgba(27,58,45,0.06), white)", borderRadius: 16, padding: 24, borderLeft: "3px solid #C8A96E" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#1B3A2D", marginBottom: 6 }}>Questions?</div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#4A6358" }}>Call or text Lizzie at <strong>260-350-9001</strong> or email <strong>eranailss@outlook.com</strong></div>
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#1B3A2D", color: "#F4F7F4", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book with Confidence</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7F4" }}>
      <style>{style}</style>
      <div ref={topRef} />
      {section !== "home" && (
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#1B3A2D", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 20px rgba(15,31,24,0.3)" }}>
          <div style={{ cursor: "pointer" }} onClick={() => navigate("home")}><Logo size={30} /></div>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            {NAV_ITEMS.map(s => <button key={s} className={`nav-link ${section === s.toLowerCase() ? "active" : ""}`} onClick={() => navigate(s.toLowerCase())} style={{ fontSize: "0.78rem" }}>{s}</button>)}
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" style={{ background: "#C8A96E", color: "#0F1F18", padding: "9px 20px", fontSize: "0.75rem", fontFamily: "'Jost', sans-serif", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>Book</a>
          </div>
        </nav>
      )}
      {section === "home"     && renderHome()}
      {section === "services" && renderServices()}
      {section === "gallery"  && renderGallery()}
      {section === "book"     && renderBook()}
      {section === "reviews"  && renderReviews()}
      {section === "policy"   && renderPolicy()}
      <footer style={{ background: "#0F1F18", padding: "48px 40px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <Logo size={32} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#4A6358", marginTop: 14, maxWidth: 220, lineHeight: 1.7 }}>Luxury nail studio by Lizzie. Ashley, Indiana.</p>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#C8A96E", marginBottom: 4 }}>📞 260-350-9001</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#C8A96E" }}>📧 eranailss@outlook.com</div>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96E", marginBottom: 14 }}>Navigate</div>
              {NAV_ITEMS.map(l => <div key={l} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "#4A6358", marginBottom: 10, cursor: "pointer" }} onClick={() => navigate(l.toLowerCase())}>{l}</div>)}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#4A6358" }}>© 2025 ERA Nails by Lizzie. All rights reserved.</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#4A6358" }}>Ashley, Indiana ✦ By Appointment Only</div>
          </div>
        </div>
      </footer>
    </div>
  );
}