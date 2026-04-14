import { useState, useRef, useEffect, useCallback } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const G = {
  dark: "#0A1A0F", forest: "#1B3A2D", mid: "#2A5240",
  sage: "#4A6358", light: "#B8D4B8", pale: "#D9E8D9", cream: "#F4F7F4",
  gold: "#C8A96E", goldLight: "#E8D5A8", goldDark: "#A07840",
  white: "#FFFFFF", text: "#0F1F18",
};

// ─── ERA Tiers ────────────────────────────────────────────────────────────────
const TIERS = [
  { name: "Bare Era",      min: 0,    max: 149,      icon: "🌱", color: "#8B9E8B", perk: "Early booking access + birthday bonus points",                    desc: "Welcome to your new ERA. Your journey starts here." },
  { name: "Bloom Era",     min: 150,  max: 399,      icon: "🌸", color: "#C8A96E", perk: "5% off every booking",                                             desc: "Finding your style and loving every set." },
  { name: "Glow Era",      min: 400,  max: 799,      icon: "✨", color: "#7EC8A4", perk: "5% off + $20 credit + priority booking slots",                      desc: "Your nails are always giving. Always." },
  { name: "Golden Era",    min: 800,  max: 999,      icon: "👑", color: "#C8A96E", perk: "10% off every booking + free mani/pedi twice a year",               desc: "This is your moment. You've arrived." },
  { name: "Legendary Era", min: 1000, max: Infinity, icon: "💎", color: "#B8D4FF", perk: "10% off + free mani/pedi twice a year + VIP everything",           desc: "An icon. A regular. A legend." },
];

const REWARDS = [
  { pts: 50,  label: "Free Cuticle Oil",        icon: "🌿", desc: "Lizzie's homemade cuticle oil" },
  { pts: 100, label: "$10 Off Any Service",      icon: "💚", desc: "Applied at your next booking" },
  { pts: 150, label: "Free Tier 1 Nail Art",     icon: "🎨", desc: "Simple accent or chrome" },
  { pts: 250, label: "Free Add-On Service",      icon: "💅", desc: "Paraffin, massage, or removal" },
  { pts: 400, label: "$40 Off Any Service",      icon: "✨", desc: "Almost a full set on us" },
  { pts: 600, label: "Free Full Set",            icon: "👑", desc: "On the house, queen" },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  { file: "nail%201.jpg", label: "Set 1" }, { file: "nail%202.jpg", label: "Set 2" },
  { file: "nail%203.jpg", label: "Set 3" }, { file: "nail%204.jpg", label: "Set 4" },
  { file: "nail%205.jpg", label: "Set 5" }, { file: "nail%206.jpg", label: "Set 6" },
  { file: "nail%207.jpg", label: "Set 7" }, { file: "nail%208.jpg", label: "Set 8" },
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
    { name: "Nail Art — Tier 1", desc: "Chrome or single accent finger", price: 5, time: "add-on" },
    { name: "Nail Art — Tier 2", desc: "French tips or multiple nail art", price: 10, time: "add-on" },
    { name: "Nail Art — Tier 3", desc: "Detailed handpainted nail art", price: 15, time: "add-on" },
  ]},
];

const REVIEWS = [
  { name: "Lisa", rating: 5, text: "It's been awhile since I've had my nails done and I'm so glad I have started back with Lizzie! She explained everything and did wonderful, can't wait till my next visit!!", service: "Gel Manicure" },
  { name: "Kim Schlatter", rating: 5, text: "Today was my 3rd visit to ERA Nails by Lizzie. I started with the poly gel on my first visit and am loving it! I highly recommend you pay Lizzie a visit and see what she can do for your nails! Also love her homemade cuticle oil!", service: "Polygel Full Set" },
  { name: "Bre C.", rating: 5, text: "I had an amazing experience here! I got the polygel — it does not feel any different than acrylic and minus the harsh smell! Lizzie is amazing, friendly and she makes you feel welcomed! This is my new go-to nail salon!", service: "Polygel Full Set" },
  { name: "Rachel", rating: 5, text: "I had a great experience with Lizzie. She did a fantastic job on my nails. She was very gentle. I asked lots of questions, and she was more than welcome to answer all of them. I highly recommend.", service: "Gel Manicure" },
];

const FINGERS = ["Thumb","Index","Middle","Ring","Pinky"];
const SIZES = ["XXS","XS","S","M","L","XL","XXL"];
const SHAPES = ["Square","Round","Almond","Coffin","Stiletto"];
const LENGTHS = ["Short","Medium","Long"];
const ART_TIERS = [
  { label: "No Nail Art", price: 0, desc: "Solid color or simple finish" },
  { label: "Tier 1 — Accent", price: 5, desc: "Chrome or single accent per hand" },
  { label: "Tier 2 — Statement", price: 10, desc: "French tips or multiple nail art" },
  { label: "Tier 3 — Detailed", price: 15, desc: "Full handpainted detailed art" },
];

const NAV_ITEMS = ["About","Services","Gallery","Book","Press-Ons","Loyalty","Reviews","Policy"];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { background:${G.cream}; font-family:'Jost',sans-serif; overflow-x:hidden; cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='20'%3E💅%3C/text%3E%3C/svg%3E") 12 12, auto; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:${G.pale}} ::-webkit-scrollbar-thumb{background:${G.forest};border-radius:3px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes sparkle{0%,100%{opacity:0;transform:scale(0) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(180deg)}}
  @keyframes nailGrow{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
  @keyframes pageIn{from{opacity:0;transform:translateY(16px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes glitter{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

  .page-wrap { animation: pageIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }

  .nav-link{color:${G.cream};font-family:'Jost',sans-serif;font-weight:400;font-size:0.78rem;letter-spacing:0.15em;text-transform:uppercase;opacity:0.8;transition:all 0.2s;cursor:pointer;background:none;border:none;}
  .nav-link:hover,.nav-link.active{opacity:1;color:${G.gold};}

  .btn-gold{background:${G.gold};color:${G.dark};border:none;padding:14px 32px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;border-radius:2px;display:inline-block;text-decoration:none;}
  .btn-gold:hover{background:${G.goldLight};transform:translateY(-2px);box-shadow:0 8px 28px rgba(200,169,110,0.4);}
  .btn-dark{background:${G.forest};color:${G.cream};border:none;padding:14px 32px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;border-radius:2px;display:inline-block;text-decoration:none;}
  .btn-dark:hover{background:${G.mid};transform:translateY(-2px);box-shadow:0 8px 24px rgba(27,58,45,0.35);}
  .btn-dark:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .btn-outline{background:transparent;color:${G.forest};border:1.5px solid ${G.forest};padding:13px 32px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;border-radius:2px;}
  .btn-outline:hover{background:${G.forest};color:${G.cream};}

  .section-label{font-family:'Jost',sans-serif;font-size:0.68rem;font-weight:500;letter-spacing:0.28em;text-transform:uppercase;color:${G.gold};margin-bottom:12px;}
  .section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:300;color:${G.text};line-height:1.1;margin-bottom:16px;}
  .section-sub{font-family:'Jost',sans-serif;font-size:0.92rem;color:${G.sage};font-weight:300;line-height:1.75;}

  .tab-btn{background:none;border:none;font-family:'Jost',sans-serif;font-size:0.78rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;padding:10px 20px;border-radius:30px;transition:all 0.2s;color:${G.sage};}
  .tab-btn.active{background:${G.forest};color:${G.cream};}

  .policy-item{display:flex;gap:14px;padding:18px 0;border-bottom:1px solid ${G.pale};align-items:flex-start;}

  .gallery-cell{border-radius:14px;overflow:hidden;position:relative;cursor:pointer;aspect-ratio:1;}
  .gallery-cell img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s cubic-bezier(0.22,1,0.36,1);display:block;}
  .gallery-cell:hover img{transform:scale(1.08);}
  .gallery-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,26,15,0.85),transparent 55%);opacity:0;transition:opacity 0.35s;display:flex;align-items:flex-end;padding:18px;}
  .gallery-cell:hover .gallery-overlay{opacity:1;}
  .gallery-cell:nth-child(3n+2){aspect-ratio:0.78;}

  .lightbox{position:fixed;inset:0;background:rgba(10,26,15,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;backdrop-filter:blur(8px);}
  .lightbox img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:12px;animation:fadeUp 0.35s ease;}
  .lightbox-close{position:absolute;top:24px;right:28px;background:none;border:none;color:${G.gold};font-size:2rem;cursor:pointer;opacity:0.8;transition:opacity 0.2s;}
  .lightbox-close:hover{opacity:1;}

  .star{color:${G.gold};font-size:1rem;}

  input,select,textarea{width:100%;padding:12px 16px;border:1.5px solid ${G.light};border-radius:8px;font-family:'Jost',sans-serif;font-size:0.88rem;color:${G.text};background:white;outline:none;transition:border-color 0.2s;}
  input:focus,select:focus,textarea:focus{border-color:${G.forest};}
  label{font-family:'Jost',sans-serif;font-size:0.72rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:${G.sage};margin-bottom:7px;display:block;}

  .size-btn{padding:7px 13px;border:1.5px solid ${G.light};border-radius:8px;background:white;font-family:'Jost',sans-serif;font-size:0.76rem;cursor:pointer;transition:all 0.2s;color:${G.text};}
  .size-btn.active{background:${G.forest};color:white;border-color:${G.forest};}
  .size-btn:hover:not(.active){border-color:${G.forest};}

  .art-btn{padding:14px 16px;border:1.5px solid ${G.light};border-radius:12px;background:white;font-family:'Jost',sans-serif;font-size:0.8rem;cursor:pointer;transition:all 0.2s;color:${G.text};text-align:center;}
  .art-btn.active{background:${G.forest};color:white;border-color:${G.forest};}
  .art-btn:hover:not(.active){border-color:${G.forest};transform:translateY(-2px);box-shadow:0 6px 20px rgba(27,58,45,0.12);}

  .finger-row{display:grid;grid-template-columns:130px 1fr;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F0F7F0;}

  .order-summary{background:linear-gradient(160deg,${G.forest},${G.dark});border-radius:18px;padding:26px;color:white;position:sticky;top:100px;}

  .tier-card{border-radius:16px;padding:20px;border:1.5px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.3s;position:relative;overflow:hidden;cursor:default;}
  .tier-card:hover{transform:translateY(-3px);border-color:rgba(200,169,110,0.4);}

  .reward-card{background:white;border-radius:14px;padding:20px;border:1.5px solid ${G.pale};transition:all 0.25s;cursor:pointer;position:relative;overflow:hidden;}
  .reward-card::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,169,110,0.08),transparent);transition:left 0.5s;}
  .reward-card:hover::before{left:150%;}
  .reward-card:hover{border-color:${G.gold};transform:translateY(-3px);box-shadow:0 12px 32px rgba(27,58,45,0.12);}
  .reward-card.redeemable{border-color:${G.forest};}

  .upload-area{border:2px dashed ${G.light};border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:all 0.25s;background:white;}
  .upload-area:hover{border-color:${G.forest};background:${G.pale};transform:scale(1.01);}

  .glitter-text{background:linear-gradient(135deg,${G.gold} 0%,${G.goldLight} 30%,${G.gold} 60%,#FFF8E7 80%,${G.gold} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glitter 4s linear infinite;}

  .card-hover{transition:all 0.28s cubic-bezier(0.22,1,0.36,1);}
  .card-hover:hover{transform:translateY(-5px);box-shadow:0 20px 48px rgba(27,58,45,0.14);}

  .floating-nail{position:fixed;pointer-events:none;font-size:1.2rem;animation:float 3s ease-in-out infinite;z-index:0;opacity:0.1;}

  /* Nail page transition overlay */
  .nail-transition{position:fixed;inset:0;z-index:9997;pointer-events:none;display:flex;align-items:center;justify-content:center;overflow:hidden;}
  .nail-transition-bg{position:absolute;inset:0;background:${G.forest};}
  @keyframes wipeIn{0%{transform:scaleX(0);transform-origin:left}100%{transform:scaleX(1);transform-origin:left}}
  @keyframes wipeOut{0%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
  @keyframes nailFall{0%{transform:translateY(-200px) rotate(-20deg);opacity:0}70%{transform:translateY(10px) rotate(5deg);opacity:1}100%{transform:translateY(0) rotate(0);opacity:1}}

  .policy-item{display:flex;gap:14px;padding:18px 12px;border-bottom:1px solid ${G.pale};align-items:flex-start;border-radius:8px;transition:background 0.2s;}
  .policy-item:hover{background:${G.pale};}

  .service-row{position:relative;overflow:hidden;transition:all 0.22s;}
  .service-row:hover{background:${G.pale}!important;}
  .service-row .book-hint{position:absolute;right:-120px;top:50%;transform:translateY(-50%);font-family:'Jost',sans-serif;font-size:0.72rem;color:${G.gold};letter-spacing:0.1em;transition:right 0.25s;white-space:nowrap;}
  .service-row:hover .book-hint{right:20px;}
  .service-row:hover{padding-right:130px!important;}

  .gallery-cell{border-radius:14px;overflow:hidden;position:relative;cursor:pointer;aspect-ratio:1;}
  .gallery-cell img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s cubic-bezier(0.22,1,0.36,1);display:block;}
  .gallery-cell:hover img{transform:scale(1.1);}
  .gallery-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,26,15,0.9),rgba(10,26,15,0.2) 50%,transparent 100%);opacity:0;transition:opacity 0.35s;display:flex;align-items:flex-end;padding:18px;}
  .gallery-cell:hover .gallery-overlay{opacity:1;}
  .gallery-cell:nth-child(3n+2){aspect-ratio:0.78;}

  .lightbox{position:fixed;inset:0;background:rgba(10,26,15,0.97);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;backdrop-filter:blur(12px);}
  .lightbox img{max-width:88vw;max-height:88vh;object-fit:contain;border-radius:16px;animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1);box-shadow:0 32px 80px rgba(0,0,0,0.6);}
  .lightbox-close{position:absolute;top:24px;right:28px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;font-size:1.1rem;cursor:pointer;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
  .lightbox-close:hover{background:rgba(255,255,255,0.2);transform:scale(1.1);}

  .nav-link{color:${G.cream};font-family:'Jost',sans-serif;font-weight:400;font-size:0.78rem;letter-spacing:0.15em;text-transform:uppercase;opacity:0.8;transition:all 0.25s;cursor:pointer;background:none;border:none;position:relative;}
  .nav-link::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1.5px;background:${G.gold};transition:width 0.25s ease;}
  .nav-link:hover::after,.nav-link.active::after{width:100%;}
  .nav-link:hover,.nav-link.active{opacity:1;color:${G.gold};}

  .btn-gold{background:${G.gold};color:${G.dark};border:none;padding:14px 32px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;border-radius:2px;display:inline-block;text-decoration:none;position:relative;overflow:hidden;}
  .btn-gold:hover{background:${G.goldLight};transform:translateY(-2px);box-shadow:0 10px 32px rgba(200,169,110,0.45);}
  .btn-dark{background:${G.forest};color:${G.cream};border:none;padding:14px 32px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;border-radius:2px;display:inline-block;text-decoration:none;position:relative;overflow:hidden;}
  .btn-dark:hover{background:${G.mid};transform:translateY(-2px);box-shadow:0 10px 28px rgba(27,58,45,0.4);}
  .btn-dark:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .btn-outline{background:transparent;color:${G.forest};border:1.5px solid ${G.forest};padding:13px 32px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;border-radius:2px;}
  .btn-outline:hover{background:${G.forest};color:${G.cream};transform:translateY(-1px);}

  .section-label{font-family:'Jost',sans-serif;font-size:0.68rem;font-weight:500;letter-spacing:0.28em;text-transform:uppercase;color:${G.gold};margin-bottom:12px;}
  .section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:300;color:${G.text};line-height:1.1;margin-bottom:16px;}
  .section-sub{font-family:'Jost',sans-serif;font-size:0.92rem;color:${G.sage};font-weight:300;line-height:1.75;}

  .tab-btn{background:none;border:none;font-family:'Jost',sans-serif;font-size:0.78rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;padding:10px 20px;border-radius:30px;transition:all 0.2s;color:${G.sage};}
  .tab-btn.active{background:${G.forest};color:${G.cream};}
  .tab-btn:hover:not(.active){background:${G.pale};color:${G.forest};}

  .star{color:${G.gold};font-size:1rem;}

  input,select,textarea{width:100%;padding:12px 16px;border:1.5px solid ${G.light};border-radius:8px;font-family:'Jost',sans-serif;font-size:0.88rem;color:${G.text};background:white;outline:none;transition:all 0.2s;}
  input:focus,select:focus,textarea:focus{border-color:${G.forest};box-shadow:0 0 0 3px rgba(27,58,45,0.08);}
  label{font-family:'Jost',sans-serif;font-size:0.72rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:${G.sage};margin-bottom:7px;display:block;}

  .size-btn{padding:7px 13px;border:1.5px solid ${G.light};border-radius:8px;background:white;font-family:'Jost',sans-serif;font-size:0.76rem;cursor:pointer;transition:all 0.2s;color:${G.text};}
  .size-btn.active{background:${G.forest};color:white;border-color:${G.forest};transform:scale(1.05);}
  .size-btn:hover:not(.active){border-color:${G.forest};color:${G.forest};transform:scale(1.03);}

  .review-card{background:white;border-radius:16px;padding:28px;box-shadow:0 2px 20px rgba(27,58,45,0.05);transition:all 0.3s;position:relative;overflow:hidden;}
  .review-card::before{content:'"';position:absolute;top:-10px;right:16px;font-family:'Cormorant Garamond',serif;font-size:8rem;color:${G.pale};line-height:1;pointer-events:none;}
  .review-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(27,58,45,0.1);}

  .about-value-card{background:white;border-radius:16px;padding:24px;border:1px solid ${G.pale};text-align:center;transition:all 0.3s;position:relative;overflow:hidden;}
  .about-value-card::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,${G.gold},${G.forest});transform:scaleX(0);transform-origin:left;transition:transform 0.3s;}
  .about-value-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(27,58,45,0.1);}
  .about-value-card:hover::after{transform:scaleX(1);}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Logo({ size = 36, light = true }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:size, height:size, background:"linear-gradient(135deg,#C8A96E,#E8D5A8)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 14px rgba(200,169,110,0.5)", fontSize:size*0.45 }}>💅</div>
      <div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:size*0.58, fontWeight:300, color:light?G.cream:G.text, letterSpacing:"0.08em", lineHeight:1 }}>ERA</div>
        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:size*0.26, fontWeight:500, letterSpacing:"0.32em", color:G.gold, textTransform:"uppercase", lineHeight:1, marginTop:2 }}>NAILS</div>
      </div>
    </div>
  );
}

function Stars({ n }) {
  return <span>{Array.from({length:5},(_,i) => <span key={i} className="star">{i<n?"★":"☆"}</span>)}</span>;
}

// ── Nail Page Transition ──────────────────────────────────────────────────────
const NAIL_EMOJIS = ["💅","✨","💎","🌸","👑","🌿","💚"];
function NailTransition({ active }) {
  const emoji = NAIL_EMOJIS[Math.floor(Math.random() * NAIL_EMOJIS.length)];
  if (!active) return null;
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9997, pointerEvents:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
      overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", inset:0,
        background:`linear-gradient(135deg,${G.forest},${G.dark})`,
        animation:"nailWipeIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
      }}/>
      <div style={{
        position:"relative", zIndex:1, fontSize:"4rem",
        animation:"nailFallIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
      }}>{emoji}</div>
      <style>{`
        @keyframes nailWipeIn{0%{clip-path:circle(0% at 50% 50%)}100%{clip-path:circle(150% at 50% 50%)}}
        @keyframes nailFallIn{0%{transform:translateY(-80px) rotate(-20deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
      `}</style>
    </div>
  );
}

function getTier(pts) { return [...TIERS].reverse().find(t => pts >= t.min) || TIERS[0]; }

function TierRing({ pts }) {
  const tier = getTier(pts);
  const next = TIERS[TIERS.indexOf(tier)+1];
  const pct = next ? Math.min(100,((pts-tier.min)/(next.min-tier.min))*100) : 100;
  const r=40, circ=2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <div style={{ position:"relative", width:100, height:100 }}>
        <svg width={100} height={100} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={7}/>
          <circle cx={50} cy={50} r={r} fill="none" stroke={tier.color} strokeWidth={7}
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round"
            style={{ transition:"stroke-dashoffset 1.2s ease" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"1.4rem" }}>{tier.icon}</span>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:G.gold, lineHeight:1 }}>{pts}</div>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.5rem", color:"rgba(255,255,255,0.5)", letterSpacing:"0.08em" }}>PTS</div>
        </div>
      </div>
      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:G.gold, fontWeight:600, letterSpacing:"0.1em" }}>{tier.name} {tier.icon}</div>
      {next && <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.62rem", color:"rgba(255,255,255,0.45)" }}>{next.min-pts} pts to {next.name}</div>}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <img src={`/gallery/${photo.file}`} alt={photo.label} onClick={e => e.stopPropagation()} />
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(255,255,255,0.6)", letterSpacing:"0.1em" }}>{photo.label} · ERA NAILS</div>
    </div>
  );
}

// ─── Floating Nails ───────────────────────────────────────────────────────────
function FloatingNails() {
  const nails = ["💅","✨","💎","🌸","👑","💚","🌿"];
  return (
    <>
      {nails.map((n,i) => (
        <div key={i} className="floating-nail" style={{
          left:`${8+i*13}%`, top:`${15+i*10}%`,
          animationDelay:`${i*0.6}s`, animationDuration:`${3+i*0.4}s`,
          fontSize:`${0.8+Math.random()*0.6}rem`,
        }}>{n}</div>
      ))}
    </>
  );
}

// ─── Page transition wrapper ──────────────────────────────────────────────────
function Page({ children }) {
  return <div className="page-wrap">{children}</div>;
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════════════════════════

function AboutPage({ onNav }) {
  return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div className="section-label">Meet Lizzie</div>
          <h2 className="section-title">About ERA Nails</h2>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start", marginTop:16 }}>
            {/* Photo */}
            <div style={{ position:"relative" }}>
              <div style={{
                width:"100%", aspectRatio:"4/5", borderRadius:24,
                background:`linear-gradient(135deg,${G.pale},${G.light})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"5rem", position:"relative", overflow:"hidden",
                boxShadow:"0 20px 60px rgba(27,58,45,0.15)",
              }}>
                <span style={{ opacity:0.4 }}>💅</span>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:G.forest, opacity:0.6 }}>Lizzie's photo</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", color:G.sage, letterSpacing:"0.1em" }}>coming soon</div>
                </div>
              </div>
              {/* Gold accent */}
              <div style={{ position:"absolute", bottom:-16, right:-16, width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${G.gold},${G.goldLight})`, opacity:0.3, filter:"blur(20px)" }}/>
              <div style={{ position:"absolute", top:-10, left:-10, fontFamily:"'Cormorant Garamond',serif", fontSize:"4rem", color:G.gold, opacity:0.15, lineHeight:1 }}>"</div>
            </div>

            {/* Bio */}
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.85rem", color:G.gold, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>which era are you in?</div>

              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", fontWeight:300, color:G.text, lineHeight:1.8, marginBottom:24 }}>
                My name is Lizzie and I am a private nail tech offering gel-based services. I offer hand-painted nail art only — no stencils, stickers, or stamps. I can't wait to be a part of your nail journey!
              </p>

              <div style={{ background:`linear-gradient(135deg,${G.forest},${G.mid})`, borderRadius:16, padding:24, marginBottom:24, color:"white" }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:G.gold, marginBottom:14 }}>Good to Know</div>
                {[
                  ["📅","Appointment Only","No walk-ins. Book through Calendly or contact Lizzie directly."],
                  ["🕐","Out-of-Hours Available","Need an appointment outside normal hours? Just ask — a small additional fee may apply."],
                  ["💬","Questions?","Contact Lizzie personally for anything about booking or services."],
                  ["🎨","Handpainted Only","Every design is made by hand. No stamps, stickers, or stencils. Ever."],
                ].map(([icon,title,body]) => (
                  <div key={title} style={{ display:"flex", gap:14, marginBottom:16 }}>
                    <span style={{ fontSize:"1.1rem", minWidth:24 }}>{icon}</span>
                    <div>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", fontWeight:500, color:"white", marginBottom:2 }}>{title}</div>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>{body}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding:"13px 28px" }}>Book an Appointment</a>
                <button className="btn-outline" onClick={() => onNav("services")} style={{ padding:"13px 28px" }}>View Services</button>
              </div>
            </div>
          </div>

          {/* Values strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:48 }}>
            {[
              ["🌿","Homemade Cuticle Oil","Lizzie's signature cuticle oil — a client favorite."],
              ["🎨","Handpainted Art","Every design crafted by hand, made just for you."],
              ["💚","Personal Service","Private studio, one-on-one attention, every time."],
            ].map(([icon,title,body]) => (
              <div key={title} className="about-value-card">
                <div style={{ fontSize:"2rem", marginBottom:12 }}>{icon}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:G.text, marginBottom:8 }}>{title}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.sage, lineHeight:1.6 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

function ServicesPage({ onNav }) {
  const [tab, setTab] = useState("Manicures");
  const cat = SERVICES.find(s => s.cat === tab);
  return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div className="section-label">Menu</div>
          <h2 className="section-title">Services & Pricing</h2>
          <p className="section-sub" style={{ marginBottom:40, maxWidth:520 }}>Every service is performed with premium products, sanitary tools, and an eye for detail. All nail art is handpainted — no stencils or stamps.</p>
          <div style={{ display:"inline-flex", gap:8, flexWrap:"wrap", marginBottom:36, background:G.pale, padding:6, borderRadius:40 }}>
            {SERVICES.map(s => <button key={s.cat} className={`tab-btn ${tab===s.cat?"active":""}`} onClick={() => setTab(s.cat)}>{s.cat}</button>)}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
            {cat.items.map((item,i) => (
              <div key={i} className="service-row" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"22px 28px", background:"white", borderRadius:i===0?"14px 14px 0 0":i===cat.items.length-1?"0 0 14px 14px":0, borderBottom:i<cat.items.length-1?`1px solid ${G.pale}`:"none", cursor:"pointer" }}
                onClick={()=>onNav("book")}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", color:G.text, marginBottom:4 }}>{item.name}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.sage }}>{item.desc} · {item.time}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontWeight:600, color:G.forest }}>${item.price}</div>
                  <span className="book-hint">Book this →</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:28, padding:18, background:`linear-gradient(135deg,${G.pale},white)`, borderRadius:12, borderLeft:`3px solid ${G.gold}` }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:G.sage }}>✦ Prices are starting prices and may vary. All nail art is handpainted by Lizzie — no stencils, stickers, or stamps.</div>
          </div>
          <div style={{ marginTop:40, textAlign:"center" }}>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-gold">Book a Service</a>
          </div>
        </div>
      </div>
    </Page>
  );
}

function GalleryPage() {
  const [lightbox, setLightbox] = useState(null);
  return (
    <Page>
      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div className="section-label">Portfolio</div>
          <h2 className="section-title">The Work</h2>
          <p className="section-sub" style={{ marginBottom:48, maxWidth:480 }}>Real sets, real clients. Every design handpainted by Lizzie. Tap any photo to view full size.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {GALLERY_PHOTOS.map((photo,i) => (
              <div key={i} className="gallery-cell" style={{ animationDelay:`${i*0.06}s` }} onClick={() => setLightbox(photo)}>
                <img src={`/gallery/${photo.file}`} alt={photo.label} onError={e=>{ e.target.style.background=G.pale; e.target.style.minHeight="200px"; }} />
                <div className="gallery-overlay">
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", color:"white", fontSize:"1rem" }}>{photo.label}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", color:G.gold, fontSize:"0.65rem", letterSpacing:"0.18em", marginTop:2 }}>TAP TO EXPAND</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:48 }}>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.sage, marginBottom:16 }}>Follow ERA Nails by Lizzie on Facebook for daily inspo ✨</p>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-outline">Book Your Set</a>
          </div>
        </div>
      </div>
    </Page>
  );
}

function BookPage() {
  return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <div className="section-label">Scheduling</div>
          <h2 className="section-title">Book an Appointment</h2>
          <p className="section-sub" style={{ marginBottom:48 }}>Click below to see Lizzie's real-time availability and secure your slot. Confirmation and reminders go straight to you.</p>
          <div className="card-hover" style={{ background:"white", borderRadius:20, padding:48, boxShadow:"0 4px 40px rgba(27,58,45,0.08)", marginBottom:32 }}>
            <div style={{ fontSize:"3rem", marginBottom:20, animation:"float 3s ease-in-out infinite" }}>📅</div>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:G.text, marginBottom:12 }}>Ready to book?</h3>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.88rem", color:G.sage, marginBottom:12, lineHeight:1.7 }}>
              Lizzie's calendar is live — pick your service, choose your time, and you're set. No back and forth.
            </p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.9rem", color:G.gold, marginBottom:32, opacity:0.8 }}>which era are you in?</p>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding:"18px 48px" }}>View Available Times →</a>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:G.sage, marginTop:20 }}>Auto confirmation + reminders sent after booking ✦</p>
          </div>

          {/* Policy reminder */}
          <div style={{ background:`linear-gradient(135deg,${G.pale},white)`, borderRadius:14, padding:24, marginBottom:24, border:`1px solid ${G.light}`, textAlign:"left" }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:G.forest, marginBottom:12 }}>💳 Card Required at Booking</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:G.sage, lineHeight:1.7 }}>
              A card on file is required to secure your appointment. Cancellations within 48 hours are charged 50% of the service fee. No-shows are charged in full.
            </div>
          </div>

          <div style={{ background:`linear-gradient(135deg,${G.forest},${G.dark})`, borderRadius:16, padding:32, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20, textAlign:"left" }}>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:"white" }}>📞 Prefer to call or text?</div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:G.light, marginTop:6 }}>Reach Lizzie at <strong>260-350-9001</strong> or <strong>eranailss@outlook.com</strong></div>
            </div>
            <a href="tel:2603509001" style={{ background:G.gold, color:G.dark, padding:"14px 28px", borderRadius:6, fontFamily:"'Jost',sans-serif", fontWeight:600, fontSize:"0.82rem", textDecoration:"none", whiteSpace:"nowrap" }}>Call Now</a>
          </div>
        </div>
      </div>
    </Page>
  );
}

function PressOnPage() {
  const BASE = 40;
  const [shape, setShape] = useState("");
  const [length, setLength] = useState("");
  const [artTier, setArtTier] = useState(0);
  const [sizes, setSizes] = useState({L:{},R:{}});
  const [design, setDesign] = useState("");
  const [inspoFile, setInspoFile] = useState(null);
  const [address, setAddress] = useState({name:"",street:"",city:"",state:"",zip:"",email:"",phone:""});
  const [card, setCard] = useState({name:"",number:"",exp:"",cvc:""});
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const fileRef = useRef(null);

  const artPrice = ART_TIERS[artTier].price;
  const total = BASE + artPrice;
  const setSize = (hand,finger,size) => setSizes(p=>({...p,[hand]:{...p[hand],[finger]:size}}));
  const allSized = () => FINGERS.every(f=>sizes.L[f]&&sizes.R[f]);

  const s1ok = shape && length;
  const s2ok = allSized();
  const s3ok = design.trim().length > 0;
  const s4ok = address.name&&address.street&&address.city&&address.state&&address.zip&&address.email;
  const s5ok = card.name&&card.number.length>=15&&card.exp&&card.cvc.length>=3;

  const reset = () => { setDone(false);setStep(1);setShape("");setLength("");setArtTier(0);setSizes({L:{},R:{}});setDesign("");setInspoFile(null);setAddress({name:"",street:"",city:"",state:"",zip:"",email:"",phone:""});setCard({name:"",number:"",exp:"",cvc:""}); };

  if (done) return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ background:"white", borderRadius:24, padding:60, textAlign:"center", maxWidth:540, boxShadow:"0 8px 48px rgba(27,58,45,0.1)", animation:"fadeUp 0.5s ease" }}>
          <div style={{ fontSize:"3.5rem", marginBottom:20 }}>🎉</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:G.text, marginBottom:12 }}>Order Received!</h3>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.88rem", color:G.sage, marginBottom:8 }}>Thanks {address.name}! Your card is on file. Lizzie will confirm your order and begin production after review.</p>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:G.forest, fontWeight:600, marginBottom:24 }}>{address.email}</p>
          <div style={{ background:G.pale, borderRadius:12, padding:20, marginBottom:28, textAlign:"left" }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:G.forest, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Order Summary</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.text, lineHeight:1.9 }}>
              <div>💅 {shape} · {length}</div>
              <div>🎨 {ART_TIERS[artTier].label}</div>
              {inspoFile && <div>🖼 Inspo photo attached</div>}
              <div>📦 Ships to {address.city}, {address.state}</div>
              <div style={{ marginTop:8, fontWeight:600, color:G.forest }}>Total: ${total}</div>
            </div>
          </div>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:G.sage, marginBottom:24 }}>Ready in <strong>7-10 business days</strong>. Lizzie will reach out with any design questions.</p>
          <button className="btn-dark" onClick={reset}>Order Another Set</button>
        </div>
      </div>
    </Page>
  );

  return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:1020, margin:"0 auto" }}>
          <div className="section-label">Ship Anywhere</div>
          <h2 className="section-title">Custom Press-On Sets</h2>
          <p className="section-sub" style={{ marginBottom:16, maxWidth:540 }}>Can't make it to Ashley? Order a custom handmade set from Lizzie, shipped straight to your door in 7-10 business days.</p>
          <div style={{ display:"flex", gap:10, marginBottom:40, flexWrap:"wrap" }}>
            {[["💅","Custom handmade"],["📦","Ships anywhere in US"],["🎨","Your design, your sizes"],["⏱️","7-10 business days"],["🔒","Secure card on file"]].map(([icon,text]) => (
              <div key={text} style={{ background:"white", borderRadius:20, padding:"7px 15px", fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:G.forest, fontWeight:500, border:`1px solid ${G.pale}` }}>{icon} {text}</div>
            ))}
          </div>

          {/* Steps */}
          <div style={{ display:"flex", gap:8, marginBottom:36 }}>
            {["Style","Sizing","Design","Shipping","Payment"].map((s,i) => (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:3, borderRadius:2, background:i+1<=step?G.forest:G.pale, transition:"background 0.4s", marginBottom:6 }}/>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.6rem", color:i+1===step?G.forest:G.sage, fontWeight:i+1===step?600:400, letterSpacing:"0.1em", textTransform:"uppercase" }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 290px", gap:32, alignItems:"start" }}>
            <div>
              {/* Step 1 */}
              {step===1 && (
                <div style={{ background:"white", borderRadius:16, padding:32, boxShadow:"0 4px 24px rgba(27,58,45,0.06)", animation:"pageIn 0.35s ease" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:G.text, marginBottom:24 }}>Choose Your Style</h3>
                  <div style={{ marginBottom:28 }}>
                    <label>Shape</label>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:8 }}>
                      {SHAPES.map(s=><button key={s} className={`size-btn ${shape===s?"active":""}`} onClick={()=>setShape(s)}>{s}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom:32 }}>
                    <label>Length</label>
                    <div style={{ display:"flex", gap:10, marginTop:8 }}>
                      {LENGTHS.map(l=><button key={l} className={`size-btn ${length===l?"active":""}`} onClick={()=>setLength(l)}>{l}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom:32 }}>
                    <label>Nail Art Add-On</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginTop:8 }}>
                      {ART_TIERS.map((tier,i)=>(
                        <button key={i} className={`art-btn ${artTier===i?"active":""}`} onClick={()=>setArtTier(i)}>
                          <div style={{ fontWeight:600, marginBottom:3 }}>{tier.label}</div>
                          <div style={{ fontSize:"0.7rem", opacity:0.75 }}>{tier.desc}</div>
                          <div style={{ fontSize:"0.78rem", marginTop:5, color:artTier===i?G.gold:G.forest, fontWeight:600 }}>{tier.price===0?"Included":`+$${tier.price}`}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn-dark" style={{ width:"100%" }} disabled={!s1ok} onClick={()=>setStep(2)}>Continue to Sizing →</button>
                </div>
              )}

              {/* Step 2 */}
              {step===2 && (
                <div style={{ background:"white", borderRadius:16, padding:32, boxShadow:"0 4px 24px rgba(27,58,45,0.06)", animation:"pageIn 0.35s ease" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:G.text, marginBottom:8 }}>Your Nail Sizes</h3>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.8rem", color:G.sage, marginBottom:24, lineHeight:1.6 }}>Measure the widest part of each nail bed in mm: &lt;14=XXS, 14-15=XS, 15-16=S, 16-17=M, 17-18=L, 18-19=XL, 19+=XXL</p>
                  {["L","R"].map(hand=>(
                    <div key={hand} style={{ marginBottom:24 }}>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:G.forest, marginBottom:12 }}>{hand==="L"?"Left Hand":"Right Hand"}</div>
                      {FINGERS.map(finger=>(
                        <div key={finger} className="finger-row">
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:G.text }}>{finger}</div>
                          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                            {SIZES.map(size=><button key={size} className={`size-btn ${sizes[hand][finger]===size?"active":""}`} style={{ padding:"4px 9px", fontSize:"0.7rem" }} onClick={()=>setSize(hand,finger,size)}>{size}</button>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:12 }}>
                    <button className="btn-outline" style={{ flex:1 }} onClick={()=>setStep(1)}>← Back</button>
                    <button className="btn-dark" style={{ flex:2 }} disabled={!s2ok} onClick={()=>setStep(3)}>Continue to Design →</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step===3 && (
                <div style={{ background:"white", borderRadius:16, padding:32, boxShadow:"0 4px 24px rgba(27,58,45,0.06)", animation:"pageIn 0.35s ease" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:G.text, marginBottom:8 }}>Your Design</h3>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.8rem", color:G.sage, marginBottom:24, lineHeight:1.6 }}>Tell Lizzie your vision. The more detail the better — colors, vibe, inspo. You can also upload a photo.</p>
                  <div style={{ marginBottom:20 }}>
                    <label>Colors & Vibe *</label>
                    <textarea rows={4} placeholder="e.g. Nude pink base with gold chrome on ring fingers, white flower detail on index nails. Elegant and clean..." value={design} onChange={e=>setDesign(e.target.value)} />
                  </div>
                  {/* Inspo upload */}
                  <div style={{ marginBottom:24 }}>
                    <label>Inspo Photo (optional)</label>
                    <input type="file" ref={fileRef} accept="image/*" style={{ display:"none" }} onChange={e=>setInspoFile(e.target.files[0])} />
                    <div className="upload-area" onClick={()=>fileRef.current.click()}>
                      {inspoFile ? (
                        <div>
                          <div style={{ fontSize:"2rem", marginBottom:8 }}>🖼</div>
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:G.forest, fontWeight:500 }}>{inspoFile.name}</div>
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", color:G.sage, marginTop:4 }}>Tap to change</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize:"2rem", marginBottom:8 }}>📸</div>
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.forest, fontWeight:500 }}>Upload inspo photo</div>
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", color:G.sage, marginTop:4 }}>JPG, PNG, HEIC — tap to browse</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ background:G.pale, borderRadius:12, padding:16, marginBottom:24 }}>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", color:G.forest, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>💡 Tip</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.sage, lineHeight:1.6 }}>You can also email inspo to <strong>eranailss@outlook.com</strong> after ordering — just include your name so Lizzie can match it up.</div>
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <button className="btn-outline" style={{ flex:1 }} onClick={()=>setStep(2)}>← Back</button>
                    <button className="btn-dark" style={{ flex:2 }} disabled={!s3ok} onClick={()=>setStep(4)}>Continue to Shipping →</button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step===4 && (
                <div style={{ background:"white", borderRadius:16, padding:32, boxShadow:"0 4px 24px rgba(27,58,45,0.06)", animation:"pageIn 0.35s ease" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:G.text, marginBottom:24 }}>Shipping Info</h3>
                  <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:24 }}>
                    <div><label>Full Name *</label><input placeholder="Your name" value={address.name} onChange={e=>setAddress(a=>({...a,name:e.target.value}))}/></div>
                    <div><label>Email *</label><input placeholder="you@email.com" value={address.email} onChange={e=>setAddress(a=>({...a,email:e.target.value}))}/></div>
                    <div><label>Phone</label><input placeholder="(555) 000-0000" value={address.phone} onChange={e=>setAddress(a=>({...a,phone:e.target.value}))}/></div>
                    <div><label>Street Address *</label><input placeholder="123 Main St" value={address.street} onChange={e=>setAddress(a=>({...a,street:e.target.value}))}/></div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:12 }}>
                      <div><label>City *</label><input placeholder="City" value={address.city} onChange={e=>setAddress(a=>({...a,city:e.target.value}))}/></div>
                      <div><label>State *</label><input placeholder="IN" maxLength={2} value={address.state} onChange={e=>setAddress(a=>({...a,state:e.target.value.toUpperCase()}))}/></div>
                    </div>
                    <div><label>ZIP *</label><input placeholder="46705" value={address.zip} onChange={e=>setAddress(a=>({...a,zip:e.target.value}))}/></div>
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <button className="btn-outline" style={{ flex:1 }} onClick={()=>setStep(3)}>← Back</button>
                    <button className="btn-dark" style={{ flex:2 }} disabled={!s4ok} onClick={()=>setStep(5)}>Continue to Payment →</button>
                  </div>
                </div>
              )}

              {/* Step 5 — Card on file */}
              {step===5 && (
                <div style={{ background:"white", borderRadius:16, padding:32, boxShadow:"0 4px 24px rgba(27,58,45,0.06)", animation:"pageIn 0.35s ease" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:G.text, marginBottom:8 }}>Card on File</h3>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:G.sage, marginBottom:24, lineHeight:1.6 }}>A card is required to secure your order. You won't be charged until Lizzie confirms your set is ready to ship.</p>
                  <div style={{ background:`linear-gradient(135deg,${G.forest},${G.dark})`, borderRadius:16, padding:24, marginBottom:24 }}>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.65rem", color:G.gold, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16 }}>Card Details</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                      <div>
                        <label style={{ color:"rgba(255,255,255,0.6)" }}>Name on Card *</label>
                        <input placeholder="Full name" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
                      </div>
                      <div>
                        <label style={{ color:"rgba(255,255,255,0.6)" }}>Card Number *</label>
                        <input placeholder="•••• •••• •••• ••••" maxLength={19} value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim()}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <div>
                          <label style={{ color:"rgba(255,255,255,0.6)" }}>Expiry *</label>
                          <input placeholder="MM/YY" maxLength={5} value={card.exp} onChange={e=>setCard(c=>({...c,exp:e.target.value}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
                        </div>
                        <div>
                          <label style={{ color:"rgba(255,255,255,0.6)" }}>CVC *</label>
                          <input placeholder="•••" maxLength={4} value={card.cvc} onChange={e=>setCard(c=>({...c,cvc:e.target.value}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background:G.pale, borderRadius:10, padding:14, marginBottom:24 }}>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:G.sage, lineHeight:1.7 }}>🔒 Your card info is securely stored. You'll only be charged <strong>${total}</strong> once Lizzie confirms your order is ready to ship. Cancellation fee applies if order is cancelled after production begins.</div>
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <button className="btn-outline" style={{ flex:1 }} onClick={()=>setStep(4)}>← Back</button>
                    <button className="btn-dark" style={{ flex:2 }} disabled={!s5ok} onClick={()=>setDone(true)}>Submit Order ✦</button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="order-summary">
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.62rem", color:G.gold, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>Order Summary</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", color:"white", marginBottom:18 }}>Custom Press-On Set</div>
              {[["Base Set",`$${BASE}`],[ART_TIERS[artTier].label,artPrice>0?`+$${artPrice}`:"Included"],["US Shipping","Included"]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:"rgba(255,255,255,0.55)" }}>{l}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.gold, fontWeight:500 }}>{v}</div>
                </div>
              ))}
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.12)", paddingTop:14, marginTop:4, display:"flex", justifyContent:"space-between" }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:"white", fontWeight:600 }}>Total</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:G.gold, fontWeight:600 }}>${total}</div>
              </div>
              <div style={{ marginTop:18, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:16 }}>
                {shape&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"rgba(255,255,255,0.5)", marginBottom:6 }}>💅 {shape}{length?` · ${length}`:""}</div>}
                {allSized()&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"rgba(255,255,255,0.5)", marginBottom:6 }}>📏 Sizes confirmed</div>}
                {design&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"rgba(255,255,255,0.5)", marginBottom:6 }}>🎨 Design described</div>}
                {inspoFile&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"rgba(255,255,255,0.5)", marginBottom:6 }}>🖼 Photo attached</div>}
                {address.city&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"rgba(255,255,255,0.5)", marginBottom:6 }}>📦 {address.city}, {address.state}</div>}
              </div>
              <div style={{ marginTop:18, background:"rgba(200,169,110,0.12)", borderRadius:10, padding:14 }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:G.gold, lineHeight:1.7 }}>✦ Payment after Lizzie confirms<br/>✦ 7-10 business days<br/>✦ US shipping included<br/>✦ Card required to secure order</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function LoyaltyPage({ onNav }) {
  const [member, setMember] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", phone:"" });
  const [formError, setFormError] = useState("");
  const [pts, setPts] = useState(0);
  const [redeemed, setRedeemed] = useState([]);
  const [toast, setToast] = useState(null);
  const tier = getTier(pts);
  const tierIdx = TIERS.indexOf(tier);
  const nextTier = TIERS[tierIdx+1];

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleJoin = () => {
    if (!form.name || !form.email || !form.phone) { setFormError("Please fill in all fields to join."); return; }
    setMember(form);
    showToast(`Welcome to your new ERA, ${form.name}! 🌱`);
  };

  const redeem = (r) => {
    if (pts < r.pts || redeemed.includes(r.label)) return;
    setPts(p=>p-r.pts);
    setRedeemed(prev=>[...prev,r.label]);
    showToast(`${r.icon} Redeemed: ${r.label}!`);
  };

  // ── Signup gate ──────────────────────────────────────────────────────────
  if (!member) return (
    <Page>
      <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${G.dark},${G.forest})`, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ maxWidth:520, width:"100%", animation:"fadeUp 0.5s ease" }}>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:"3rem", marginBottom:16, animation:"float 3s ease-in-out infinite" }}>👑</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.9rem", color:"rgba(200,169,110,0.5)", letterSpacing:"0.2em", marginBottom:12 }}>which era are you in?</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.2rem,6vw,3.2rem)", fontWeight:300, color:G.cream, lineHeight:1.05, marginBottom:12 }}>Welcome to your<br/>new ERA.</h2>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.88rem", color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>Join the ERA loyalty program — it's free. Earn points every time you book, unlock real rewards, and climb the tiers as your loyalty grows.</p>
          </div>

          {/* Tier preview */}
          <div style={{ display:"flex", gap:8, marginBottom:32, overflowX:"auto", paddingBottom:4 }}>
            {TIERS.map(t => (
              <div key={t.name} style={{ minWidth:110, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"14px 12px", textAlign:"center", border:"1px solid rgba(255,255,255,0.08)", flex:1 }}>
                <div style={{ fontSize:"1.3rem", marginBottom:6 }}>{t.icon}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", color:"white", marginBottom:3 }}>{t.name}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.6rem", color:"rgba(200,169,110,0.7)", lineHeight:1.4 }}>{t.perk}</div>
              </div>
            ))}
          </div>

          {/* Signup form */}
          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:20, padding:32, border:"1px solid rgba(200,169,110,0.15)" }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:G.gold, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:20 }}>Create Your Member Profile</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
              <div>
                <label style={{ color:"rgba(255,255,255,0.5)" }}>Full Name *</label>
                <input placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
              </div>
              <div>
                <label style={{ color:"rgba(255,255,255,0.5)" }}>Email *</label>
                <input placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
              </div>
              <div>
                <label style={{ color:"rgba(255,255,255,0.5)" }}>Phone *</label>
                <input placeholder="(555) 000-0000" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"white" }}/>
              </div>
            </div>
            {formError && <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.76rem", color:"#F87171", marginBottom:14 }}>{formError}</div>}
            <button className="btn-gold" style={{ width:"100%", padding:"16px", fontSize:"0.85rem", letterSpacing:"0.2em" }} onClick={handleJoin}>
              Join ERA — It's Free ✦
            </button>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.3)", textAlign:"center", marginTop:14, lineHeight:1.6 }}>
              Free to join. Points earned through bookings and activity. Perks unlock as you level up.
            </p>
          </div>
        </div>
      </div>
    </Page>
  );

  return (
    <Page>
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:G.forest, color:"white", padding:"12px 24px", borderRadius:30, fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", zIndex:9999, animation:"fadeUp 0.3s ease", boxShadow:"0 8px 24px rgba(0,0,0,0.2)", whiteSpace:"nowrap" }}>{toast}</div>
      )}
      <div style={{ background:`linear-gradient(160deg,${G.dark},${G.forest})`, padding:"80px 40px 48px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:G.gold, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:8 }}>ERA Member</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.4)", marginBottom:16, letterSpacing:"0.12em" }}>which era are you in?</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:300, color:G.cream, marginBottom:4 }}>Welcome, {member.name.split(" ")[0]}.</h2>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:"rgba(255,255,255,0.4)", marginBottom:32 }}>{member.email}</p>

          {/* Tier + points */}
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:40, alignItems:"center", background:"rgba(255,255,255,0.05)", borderRadius:20, padding:32, border:`1px solid rgba(200,169,110,0.2)`, marginBottom:32 }}>
            <TierRing pts={pts} />
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:G.cream, marginBottom:4 }}>{tier.name}</div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.82rem", color:"rgba(255,255,255,0.6)", marginBottom:12 }}>{tier.desc}</div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.gold, fontWeight:500, marginBottom:16 }}>✦ {tier.perk}</div>
              {nextTier && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.4)" }}>{tier.name}</span>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.4)" }}>{nextTier.name}</span>
                  </div>
                  <div style={{ height:5, background:"rgba(255,255,255,0.1)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:`linear-gradient(90deg,${G.gold},${G.goldLight})`, width:`${Math.min(100,((pts-tier.min)/(nextTier.min-tier.min))*100)}%`, borderRadius:3, transition:"width 1s ease" }}/>
                  </div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:"rgba(255,255,255,0.35)", marginTop:6 }}>{nextTier.min-pts} pts to unlock {nextTier.name} {nextTier.icon}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"48px 40px", background:G.cream }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>

          {/* All tiers */}
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:G.sage, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>All Tiers</div>
          <div style={{ background:`linear-gradient(160deg,${G.dark},${G.forest})`, borderRadius:20, padding:28, marginBottom:40 }}>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
              {TIERS.map((t,i) => {
                const isCurrent = tier===t;
                const unlocked = pts>=t.min;
                return (
                  <div key={t.name} className="tier-card" style={{ minWidth:160, flex:1, borderColor:isCurrent?G.gold:unlocked?"rgba(200,169,110,0.3)":"rgba(255,255,255,0.07)", background:isCurrent?"rgba(200,169,110,0.15)":unlocked?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize:"1.6rem", marginBottom:8 }}>{t.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:unlocked?"white":"rgba(255,255,255,0.35)", marginBottom:4 }}>{t.name}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.65rem", color:G.gold, marginBottom:8 }}>{t.min}+ pts</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>{t.perk}</div>
                    {isCurrent && <div style={{ position:"absolute", top:10, right:10, background:G.gold, color:G.dark, fontFamily:"'Jost',sans-serif", fontSize:"0.55rem", fontWeight:700, padding:"2px 7px", borderRadius:10 }}>YOU</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards */}
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:G.sage, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>Redeem Points</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:40 }}>
            {REWARDS.map(r => {
              const can = pts >= r.pts && !redeemed.includes(r.label);
              const used = redeemed.includes(r.label);
              return (
                <div key={r.label} className={`reward-card ${can?"redeemable":""}`} onClick={()=>can&&redeem(r)}
                  style={{ opacity:used?0.5:1, cursor:can?"pointer":"not-allowed" }}>
                  <div style={{ fontSize:"1.8rem", marginBottom:10 }}>{r.icon}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:G.text, marginBottom:4 }}>{r.label}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", color:G.sage, marginBottom:14 }}>{r.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", fontWeight:600, color:can?G.forest:G.sage }}>{r.pts} pts</span>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:used?"#4CAF7D":can?G.forest:G.sage }}>
                      {used?"✓ Redeemed":can?"Redeem →":"Need more pts"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How to earn */}
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:G.sage, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>How to Earn Points</div>
          <div style={{ background:"white", borderRadius:16, overflow:"hidden", border:`1px solid ${G.pale}` }}>
            {[
              ["📅","Book a service","+10 pts","book"],
              ["⭐","Leave a review","+20 pts",null],
              ["👭","Refer a friend","+50 pts",null],
              ["🎂","Birthday bonus","+30 pts",null],
              ["📸","Share your set on social","+15 pts",null],
              ["💅","Order a press-on set","+10 pts","pressons"],
            ].map(([icon,action,pts,dest],i,arr) => (
              <div key={action} onClick={()=>dest&&onNav(dest)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 24px", borderBottom:i<arr.length-1?`1px solid ${G.pale}`:"none", cursor:dest?"pointer":"default", transition:"background 0.2s" }}
                onMouseEnter={e=>dest&&(e.currentTarget.style.background=G.pale)}
                onMouseLeave={e=>dest&&(e.currentTarget.style.background="white")}>
                <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                  <span style={{ fontSize:"1.1rem" }}>{icon}</span>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.text }}>{action}</div>
                  {dest && <span style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", color:G.gold }}>→</span>}
                </div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", fontWeight:600, color:G.forest, background:G.pale, padding:"4px 12px", borderRadius:20 }}>{pts}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

function ReviewsPage() {
  return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div className="section-label">Client Love</div>
          <h2 className="section-title">What They're Saying</h2>
          <div style={{ display:"flex", alignItems:"center", gap:32, marginBottom:48 }}>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"5rem", fontWeight:300, color:G.forest, lineHeight:1 }}>5.0</div>
              <Stars n={5} />
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.74rem", color:G.sage, marginTop:4 }}>all 5-star reviews</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
            {REVIEWS.map((r,i)=>(
              <div key={i} className="review-card" style={{ animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontWeight:600, color:G.text }}>{r.name}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:G.sage }}>{r.service}</div>
                  </div>
                  <Stars n={r.rating} />
                </div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", color:G.text, lineHeight:1.65, fontStyle:"italic" }}>"{r.text}"</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:40, background:"white", borderRadius:16, padding:32, textAlign:"center", border:`1px solid ${G.pale}` }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:G.text, marginBottom:8 }}>Had a great experience?</div>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.sage, marginBottom:20 }}>Leave a review on Facebook and help others find ERA Nails by Lizzie.</p>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-dark">Book Your Visit</a>
          </div>
        </div>
      </div>
    </Page>
  );
}

function PolicyPage({ onNav }) {
  return (
    <Page>
      <div style={{ minHeight:"100vh", background:G.cream, padding:"80px 40px" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div className="section-label">Important Info</div>
          <h2 className="section-title">Cancellation Policy</h2>
          <p className="section-sub" style={{ marginBottom:48 }}>We respect your time and ask the same in return.</p>
          {[
            { icon:"⏰", title:"48-Hour Cancellation", body:"Cancellations made at least 48 hours before your appointment are fully refunded with no fee. We're happy to reschedule at no charge with proper notice." },
            { icon:"💳", title:"Card Required at Booking", body:"A valid card is required on file to secure all appointments. This allows us to enforce the cancellation policy fairly and protect Lizzie's time." },
            { icon:"⚠️", title:"Late Cancellations (Under 48 Hours)", body:"Cancellations within 48 hours are subject to a 50% service fee charged to the card on file." },
            { icon:"❌", title:"No-Shows", body:"Clients who don't show up without notice will be charged 100% of the service to the card on file. Repeated no-shows may require prepayment for future bookings." },
            { icon:"🔁", title:"Rescheduling", body:"Happy to reschedule at no charge if done 48+ hours in advance. Same-day reschedules are treated as late cancellations." },
            { icon:"📱", title:"How to Cancel", body:"Cancel through your Calendly confirmation email or by calling/texting Lizzie directly at 260-350-9001. Social media DMs are not guaranteed to be seen in time." },
            { icon:"✦", title:"First-Time Clients", body:"All first-time bookings require a valid phone number and card on file for confirmation." },
          ].map((p,i)=>(
            <div key={i} className="policy-item">
              <div style={{ fontSize:"1.4rem", minWidth:32 }}>{p.icon}</div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", color:G.text, marginBottom:6 }}>{p.title}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.sage, lineHeight:1.7 }}>{p.body}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:32, background:`linear-gradient(135deg,rgba(27,58,45,0.06),white)`, borderRadius:16, padding:24, borderLeft:`3px solid ${G.gold}` }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:G.forest, marginBottom:6 }}>Questions?</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.84rem", color:G.sage }}>Call or text Lizzie at <strong>260-350-9001</strong> or email <strong>eranailss@outlook.com</strong></div>
          </div>
          <div style={{ marginTop:40, textAlign:"center" }}>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-dark">Book with Confidence</a>
          </div>
        </div>
      </div>
    </Page>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════════════
function HomePage({ onNav }) {
  return (
    <div>
      <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${G.forest} 0%,${G.dark} 55%,#041008 100%)`, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
        <FloatingNails />

        {/* Orbs */}
        {[[500,500,-120,-100,"rgba(200,169,110,0.07)",90],[350,350,40,-80,"rgba(200,169,110,0.05)",70],[180,180,"40%","45%","rgba(184,212,184,0.04)",45]].map(([w,h,t,l,bg,bl],i)=>(
          <div key={i} style={{ position:"absolute", width:w, height:h, top:t, left:l, background:bg, borderRadius:"50%", filter:`blur(${bl}px)`, pointerEvents:"none" }}/>
        ))}

        <nav style={{ padding:"24px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:10 }}>
          <Logo />
          <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
            {NAV_ITEMS.map(s=><button key={s} className="nav-link" onClick={()=>onNav(s.toLowerCase().replace("-","").replace(" ",""))}>{s}</button>)}
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding:"10px 22px", fontSize:"0.78rem" }}>Book Now</a>
          </div>
        </nav>

        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"40px 20px 80px", position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.9rem", color:"rgba(200,169,110,0.5)", letterSpacing:"0.2em", marginBottom:20, animation:"fadeIn 1.2s ease" }}>which era are you in?</div>

          <div style={{ animation:"fadeUp 0.7s ease 0.1s both" }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(4rem,12vw,8rem)", lineHeight:0.88, color:G.cream, letterSpacing:"-0.02em" }}>ERA</h1>
            <div className="glitter-text" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.6rem,4.5vw,2.8rem)", letterSpacing:"0.22em", marginBottom:8 }}>NAILS</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(1rem,2.5vw,1.5rem)", color:G.light, opacity:0.75, marginBottom:40 }}>by Lizzie</div>
          </div>

          <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", animation:"fadeUp 0.7s ease 0.3s both" }}>
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding:"16px 44px", fontSize:"0.82rem" }}>Book an Appointment</a>
            <button className="btn-outline" style={{ borderColor:G.light, color:G.light, fontSize:"0.82rem", padding:"16px 44px" }} onClick={()=>onNav("pressons")}>Order Press-Ons</button>
          </div>

          <div style={{ display:"flex", gap:52, marginTop:72, flexWrap:"wrap", justifyContent:"center", animation:"fadeUp 0.7s ease 0.5s both" }}>
            {[["5★","All 5-Star Reviews"],["🖌️","Handpainted Art Only"],["💎","Builder Gel Specialist"]].map(([num,label])=>(
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:G.gold }}>{num}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", letterSpacing:"0.18em", textTransform:"uppercase", color:G.light, opacity:0.6, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", animation:"float 2.5s ease-in-out infinite", opacity:0.35, color:G.gold, fontSize:"1.4rem" }}>⌄</div>
      </div>

      {/* Contact strip */}
      <div style={{ background:G.gold, padding:"18px 40px", display:"flex", justifyContent:"center", gap:56, flexWrap:"wrap" }}>
        {[["📞 Call or Text","260-350-9001"],["📧 Email","eranailss@outlook.com"],["📍 Ashley, Indiana","By appointment only"]].map(([t,s])=>(
          <div key={t} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:G.forest }}>{t}</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.8rem", color:G.dark, marginTop:2 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function EraApp() {
  const [section, setSection] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const topRef = useRef(null);

  const navigate = useCallback((s) => {
    if (s === section) return;
    setTransitioning(true);
    setTimeout(() => {
      setSection(s);
      setTransitioning(false);
      setTimeout(()=>topRef.current?.scrollIntoView({behavior:"smooth"}),50);
    }, 480);
  },[section]);

  const sectionKey = (s) => s.toLowerCase().replace(/[^a-z]/g,"");

  return (
    <div style={{ minHeight:"100vh", background:G.cream }}>
      <style>{css}</style>
      <NailTransition active={transitioning} />
      <div ref={topRef} />

      {section !== "home" && (
        <nav style={{ position:"sticky", top:0, zIndex:100, background:G.forest, padding:"14px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 24px rgba(10,26,15,0.3)" }}>
          <div style={{ cursor:"pointer" }} onClick={()=>navigate("home")}><Logo size={28}/></div>
          <div style={{ display:"flex", gap:22, alignItems:"center", flexWrap:"wrap" }}>
            {NAV_ITEMS.map(s=>(
              <button key={s} className={`nav-link ${section===sectionKey(s)?"active":""}`}
                onClick={()=>navigate(sectionKey(s))} style={{ fontSize:"0.76rem" }}>{s}</button>
            ))}
            <a href="https://calendly.com/eranailss" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding:"8px 18px", fontSize:"0.72rem" }}>Book</a>
          </div>
        </nav>
      )}

      {section==="home"     && <HomePage onNav={navigate}/>}
      {section==="about"    && <AboutPage onNav={navigate}/>}
      {section==="services" && <ServicesPage onNav={navigate}/>}
      {section==="gallery"  && <GalleryPage/>}
      {section==="book"     && <BookPage/>}
      {section==="pressons" && <PressOnPage/>}
      {section==="loyalty"  && <LoyaltyPage onNav={navigate}/>}
      {section==="reviews"  && <ReviewsPage/>}
      {section==="policy"   && <PolicyPage onNav={navigate}/>}

      <footer style={{ background:G.dark, padding:"48px 40px 32px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:32, marginBottom:40 }}>
            <div>
              <Logo size={32}/>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.sage, marginTop:14, maxWidth:210, lineHeight:1.75 }}>Luxury nail studio by Lizzie. Ashley, Indiana.</p>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"0.82rem", color:"rgba(200,169,110,0.4)", marginTop:8, letterSpacing:"0.1em" }}>which era are you in?</div>
              <div style={{ marginTop:14 }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.gold, marginBottom:4 }}>📞 260-350-9001</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.78rem", color:G.gold }}>📧 eranailss@outlook.com</div>
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:G.gold, marginBottom:14 }}>Navigate</div>
              {NAV_ITEMS.map(l=>(
                <div key={l} style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.8rem", color:G.sage, marginBottom:10, cursor:"pointer" }}
                  onClick={()=>navigate(sectionKey(l))}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.2)" }}>© 2025 ERA Nails by Lizzie. All rights reserved.</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.2)" }}>Ashley, Indiana ✦ By Appointment Only</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
