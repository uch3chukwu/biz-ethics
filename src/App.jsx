import { ArrowUpRight, BatteryCharging, Building2, Camera, CheckCircle2, ChevronRight, GraduationCap, HardHat, Home as HomeIcon, Hotel, MapPin, MessageCircle, Network, Phone, PlugZap, Store, Wrench } from "lucide-react";
import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import { categories } from "./data/categories";
import "./App.css";

const services = [
  { number: "01", title: "Fibre Optics", icon: PlugZap, image: "/images/services/fibre-optics.jpg", imagePosition: "center 58%", copy: "Fibre installation, termination, splicing and testing for dependable high-speed connections, including FTTH and FTTO infrastructure.", details: "Installation · Splicing · Testing · FTTH / FTTO" },
  { number: "02", title: "Structured Cabling", icon: Network, image: "/images/services/structured-cabling.jpg", imagePosition: "42% center", copy: "Organised data cabling for homes and workplaces, from individual network points to complete rack and patch-panel deployments.", details: "Data cabling · Network points · Racks · Cable management" },
  { number: "03", title: "CCTV", icon: Camera, image: "/images/services/cctv.jpg", imagePosition: "center 24%", copy: "IP CCTV and PoE camera systems designed around your space, with recording, remote monitoring and ongoing maintenance.", details: "IP cameras · PoE · NVR systems · Remote monitoring" },
  { number: "04", title: "Power Solutions", icon: BatteryCharging, image: "/images/services/power-solutions.jpg", imagePosition: "58% center", copy: "Practical backup power, solar-related solutions and power protection for the equipment your infrastructure depends on.", details: "Backup power · Solar solutions · Equipment protection" },
  { number: "05", title: "Support", icon: Wrench, image: "/images/services/technical-support.jpg", imagePosition: "60% center", copy: "Hands-on diagnostics, repairs and upgrades for connectivity, network and surveillance systems that are not working as they should.", details: "Troubleshooting · Maintenance · Diagnostics · Upgrades" },
];

const environments = [
  { title: "Homes", icon: HomeIcon, copy: "Connected, monitored and resilient living spaces, from fibre entry points to cameras and backup power." },
  { title: "Offices", icon: Building2, copy: "Structured networks, secure equipment, CCTV and support that keep teams working." },
  { title: "Hotels", icon: Hotel, copy: "Reliable guest connectivity and monitored shared spaces, installed with day-to-day operations in mind." },
  { title: "Schools", icon: GraduationCap, copy: "Practical connectivity, surveillance and access control infrastructure for learning environments." },
  { title: "Commercial spaces", icon: Store, copy: "Scalable infrastructure for shops, facilities and growing business premises." },
];

function Home() {
  const location = useLocation();
  const generalMessage = encodeURIComponent("Hello Biz Ethics, I would like to make an enquiry about your infrastructure services or products.");
  const projectMessage = encodeURIComponent("Hello Biz Ethics, I would like to discuss an installation, infrastructure upgrade, equipment requirement or technical problem.");
  const productMessage = encodeURIComponent("Hello Biz Ethics, I'm looking for infrastructure equipment. Can you help?");

  useEffect(() => {
    if (!location.hash) return;
    const timer = setTimeout(() => document.getElementById(location.hash.substring(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    return () => clearTimeout(timer);
  }, [location]);

  return <div className="site">
    <Navbar />
    <main>
      <section className="hero" id="home"><div className="container hero-grid">
        <div className="hero-content"><div className="eyebrow">FIBRE OPTICS · STRUCTURED CABLING · CCTV · POWER SOLUTIONS · SUPPORT</div><h1>Infrastructure for <em>connected spaces.</em></h1><p className="hero-text">We supply, install and support the infrastructure that keeps homes, offices and businesses connected, powered and monitored across Nigeria.</p><div className="hero-actions"><a href={`https://wa.me/2348033883255?text=${projectMessage}`} target="_blank" rel="noreferrer" className="button button-primary"><MessageCircle size={18} /> Discuss a project</a><a href="#services" className="button button-secondary">Explore our services <ArrowUpRight size={18} /></a></div><div className="hero-location"><MapPin size={15} /><span>Based in Ikeja, Lagos · Projects across Nigeria</span></div></div>
        <div className="hero-visual"><div className="system-card"><div className="system-header"><span>BIZ ETHICS LTD.</span><span>INFRASTRUCTURE / 001</span></div><div className="system-title"><span>CONNECTED INFRASTRUCTURE</span></div><div className="system-flow"><div className="system-item"><div className="system-icon"><PlugZap size={22} /></div><div><strong>CONNECT</strong><span>Fibre & structured cabling</span></div></div><div className="flow-line" /><div className="system-item"><div className="system-icon"><Camera size={22} /></div><div><strong>MONITOR</strong><span>CCTV & access control</span></div></div><div className="flow-line" /><div className="system-item"><div className="system-icon"><BatteryCharging size={22} /></div><div><strong>KEEP RUNNING</strong><span>Power & technical support</span></div></div></div><div className="system-footer"><span className="system-ready"><span className="live-dot" />SYSTEM READY</span><span>LAGOS / NG</span></div></div></div>
      </div></section>
      <section className="audience-section"><div className="container audience-inner"><span className="section-number">WHAT WE BUILD</span><div><h3>From a single connection to an entire infrastructure.</h3><p>We bring the cabling, equipment, installation and technical support together, so every part of the system works as one.</p></div></div></section>
      <section className="section services-section" id="services"><div className="container"><div className="section-heading"><div><span className="section-number">01 / CORE SERVICES</span><h2>Five capabilities.<br /><em>Built to work together.</em></h2></div><p>We design, supply, install and support the essential infrastructure behind reliable connectivity, monitoring and equipment uptime.</p></div><div className="services-grid">{services.map(({ number, title, icon: Icon, image, imagePosition, copy, details }) => <article className="service-card" key={title}><div className="service-image" style={{ backgroundImage: `url('${image}')`, backgroundPosition: imagePosition }} aria-hidden="true" /><div className="service-top"><span>{number}</span><Icon size={29} /></div><div className="service-content"><h3>{title}</h3><p>{copy}</p><span className="service-details">{details}</span></div></article>)}</div></div></section>
      <section className="section solutions-section" id="solutions"><div className="container"><div className="section-heading"><div><span className="section-number">02 / SOLUTIONS</span><h2>Built around<br /><em>your space.</em></h2></div><p>The right infrastructure depends on how a place is used. We plan each deployment around the people, equipment and daily demands within it.</p></div><div className="environment-grid">{environments.map(({ title, icon: Icon, copy }, index) => <article className="environment-card" key={title}><span className="environment-number">0{index + 1}</span><Icon size={25} /><h3>{title}</h3><p>{copy}</p></article>)}</div><p className="supporting-capability"><HardHat size={18} /> Supporting capabilities also include networking equipment and access control systems where the project requires them.</p></div></section>
      <section className="section products-section" id="products"><div className="container"><div className="section-heading product-heading"><div><span className="section-number">03 / PRODUCTS</span><h2>Equipment for<br /><em>the infrastructure.</em></h2></div><p>Source the networking, fibre, CCTV, cabling, power, access control and accessory products needed to build or upgrade your system.</p></div><div className="product-list">{categories.map(({ id, number, name, previewDescription }) => <Link to={`/products#${id}`} className="product-row" key={id}><span className="product-index">{number}</span><span className="product-name">{name}</span><span className="product-description">{previewDescription}</span><ChevronRight size={20} /></Link>)}</div><div className="product-note"><span>NEED A SPECIFIC ITEM?</span><a href={`https://wa.me/2348033883255?text=${productMessage}`} target="_blank" rel="noreferrer">Ask us directly <ArrowUpRight size={16} /></a></div></div></section>
      <section className="section about-section" id="about"><div className="container about-grid"><div className="about-image"><div className="about-image-frame"><img src="/images/about-network.jpg" alt="Installed network infrastructure" /></div></div><div className="about-content"><span className="section-number">04 / ABOUT BIZ ETHICS</span><h2>Practical expertise.<br /><em>Built into every job.</em></h2><p>Biz Ethics is a Lagos-based infrastructure company helping homes, offices and businesses connect, monitor and support the spaces they depend on.</p><p>We work from the physical layer up: selecting suitable equipment, installing it properly, testing the result and remaining available when a system needs attention. From one difficult connection to a broader infrastructure rollout, our approach stays direct and practical.</p><div className="about-points"><div><CheckCircle2 size={18} /><span>Design & supply</span></div><div><CheckCircle2 size={18} /><span>Installation & testing</span></div><div><CheckCircle2 size={18} /><span>Ongoing support</span></div></div></div></div></section>
      <section className="cta-section" id="contact"><div className="container cta-inner"><div><span className="section-number cta-number">05 / START A PROJECT</span><h2>What does your space<br /><em>need to do better?</em></h2><p>Talk to us about a new installation, an infrastructure upgrade, equipment you need or a technical problem you want solved.</p></div><div className="cta-actions"><a href={`https://wa.me/2348033883255?text=${projectMessage}`} target="_blank" rel="noreferrer" className="button button-light"><MessageCircle size={18} /> WhatsApp us</a><a href="tel:08033883255" className="button button-outline-light"><Phone size={18} /> Call us</a></div></div></section>
    </main>
    <Footer />
    <a href={`https://wa.me/2348033883255?text=${generalMessage}`} target="_blank" rel="noreferrer" className="floating-whatsapp" aria-label="Chat with Biz Ethics on WhatsApp"><MessageCircle size={22} /><span>WhatsApp us</span></a>
  </div>;
}

function App() { return <Routes><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/admin" element={<Admin />} /></Routes>; }
export default App;
