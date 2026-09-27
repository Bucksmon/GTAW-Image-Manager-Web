import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
const GITHUB_URL = "https://github.com/Bucksmon/GTAW-Image-Manager-Web";

const serverInstallUrl = DISCORD_CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(DISCORD_CLIENT_ID)}&scope=bot%20applications.commands&permissions=343597468736&integration_type=0`
  : "https://discord.com/developers/applications";

function Icon({ name, size = 20 }) {
  const paths = {
    discord: <><path d="M7 6.5a14 14 0 0 1 10 0c1.5 2.2 2.2 5 2 8.5-1.8 1.4-3.6 2.2-5.4 2.7l-1.1-1.5M7 6.5C5.5 8.7 4.8 11.5 5 15c1.8 1.4 3.6 2.2 5.4 2.7l1.1-1.5M8.5 13.5c2.1 1 4.9 1 7 0M9 10.5h.01M15 10.5h.01"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></>,
    shield: <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6z"/>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    github: <><path d="M9 19c-4 1.3-4-2-5.5-2.5M14.5 21v-2.9a2.6 2.6 0 0 0-.7-2c2.4-.3 4.8-1.2 4.8-5.4a4.2 4.2 0 0 0-1.1-2.9 3.9 3.9 0 0 0-.1-2.9s-.9-.3-3 1.1a10 10 0 0 0-5.4 0c-2.1-1.4-3-1.1-3-1.1a3.9 3.9 0 0 0-.1 2.9 4.2 4.2 0 0 0-1.1 2.9c0 4.2 2.4 5.1 4.8 5.4a2.9 2.9 0 0 0-.8 2v2.9"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    cursor: <><path d="m5 3 5.8 15.7 2.2-6 6-2.2L5 3Z"/><path d="m13 13 4 4"/></>,
    server: <><rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function RevealOnScroll({ children, className = "" }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function App() {
  const [copied, setCopied] = useState(false);
  const [faq, setFaq] = useState(0);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText("Right-click the screenshot → Apps → Approve Screenshot");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const faqItems = useMemo(() => [
    ["Do I need to open a website to upload?", "No. The workflow is entirely inside Discord. Add the app, run /setup, choose one approval channel and one approver role, then post screenshots there."],
    ["How does approval work?", "An authorized approver right-clicks the screenshot message and chooses Apps → Approve Screenshot. The bot validates the server configuration and processes the image."],
    ["What do I get back?", "Approved images are posted into the uploader's private Discord thread with direct links and grouped BBCode for Cloudinary and ImgBB."],
    ["Can the same screenshot be approved twice?", "No. Approved messages are tracked in the database. Trying to approve one again returns an already-approved message and marks the original screenshot with a checkmark."],
    ["Who can configure a server?", "Only members with the Discord Manage Server permission can use /setup or /disable. Each server has its own approval channel and approver role."],
    ["Why is there still a website?", "The website is only the public landing and install page. Uploading, approval, hosting and database operations happen through the Discord app and private backend."]
  ], []);

  return (
    <div className="site">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="GTAW Image Manager home">
          <span className="brand-mark">G</span>
          <span>
            <strong>GTAW Image Manager</strong>
            <small>Discord-first screenshot hosting</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"><Icon name="github" size={16}/> GitHub</a>
        </nav>

        <a className="button button-primary nav-cta" href={serverInstallUrl} target="_blank" rel="noreferrer">
          <Icon name="discord" size={17}/> Add to Discord
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow" />
          <div className="eyebrow reveal">BUILT FOR GTAW</div>
          <h1 className="reveal delay-1">Your screenshots.<br/><span>Handled entirely in Discord.</span></h1>
          <p className="hero-copy reveal delay-2">
            Post a GTAW screenshot, let an authorized approver approve it, and get hosted image links plus forum-ready BBCode in your private Discord thread. No upload dashboard. No tab switching.
          </p>

          <div className="hero-actions reveal delay-3">
            <a className="button button-primary large" href={serverInstallUrl} target="_blank" rel="noreferrer">
              <Icon name="discord" size={19}/> Add to Server
            </a>
            <a className="button button-secondary large" href="#how">
              See how it works <Icon name="chevron" size={16}/>
            </a>
          </div>

          <div className="trust-row reveal delay-4">
            <span><Icon name="lock" size={15}/> Server-side credentials</span>
            <span><Icon name="link" size={15}/> Direct links + BBCode</span>
            <span><Icon name="check" size={15}/> PNG · JPG · WebP · GIF</span>
            <span><Icon name="server" size={15}/> Server-specific setup</span>
          </div>

          <div className="hero-preview reveal delay-4" aria-label="Discord approval preview">
            <div className="preview-topbar">
              <span className="dot" /><span className="dot" /><span className="dot" />
              <span className="preview-label"># screenshots</span>
            </div>
            <div className="preview-message">
              <div className="preview-avatar">B</div>
              <div className="preview-content">
                <div className="preview-name">Bucksmon <span>CODE</span></div>
                <div className="preview-image">
                  <div className="image-sheen" />
                  <span>GTAW screenshot</span>
                </div>
                <div className="approval-chip"><Icon name="cursor" size={14}/> Apps → Approve Screenshot</div>
              </div>
            </div>
          </div>
        </section>

        <RevealOnScroll><section id="how" className="how section lazy-section">
          <div className="section-heading">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>From screenshot to forum link in seconds.</h2>
            <p>The Discord app is the workflow. The website is only the front door.</p>
          </div>

          <div className="steps">
            <article className="step scroll-card">
              <div className="step-number">01</div>
              <div className="step-icon"><Icon name="discord" size={23}/></div>
              <h3>Post your screenshot</h3>
              <p>Run <code>/setup</code> once, choose the server's approval channel and approver role, then post your PNG, JPEG, WebP or GIF.</p>
            </article>

            <article className="step featured-step scroll-card">
              <div className="step-number">02</div>
              <div className="step-icon"><Icon name="cursor" size={23}/></div>
              <h3>Approve the message</h3>
              <p>An authorized approver right-clicks the screenshot and selects <strong>Apps → Approve Screenshot</strong>. No reaction trigger or dashboard required.</p>
            </article>

            <article className="step scroll-card">
              <div className="step-number">03</div>
              <div className="step-icon"><Icon name="link" size={23}/></div>
              <h3>Get the links</h3>
              <p>The bot uploads the image, reuses the uploader's private thread and posts direct URLs plus grouped BBCode for each host.</p>
            </article>
          </div>
        </section></RevealOnScroll>

        <RevealOnScroll><section id="features" className="features section">
          <div className="section-heading">
            <div className="eyebrow">MADE FOR THE FLOW</div>
            <h2>Everything happens where your screenshots already live.</h2>
          </div>

          <div className="feature-grid">
            <article className="scroll-card">
              <span className="feature-icon"><Icon name="discord" size={20}/></span>
              <h3>Discord-first</h3>
              <p>No upload dashboard for the core workflow. Post, approve and receive your links without leaving Discord.</p>
            </article>
            <article className="scroll-card">
              <span className="feature-icon"><Icon name="cursor" size={20}/></span>
              <h3>Controlled approvals</h3>
              <p>Each server chooses one approval channel and one role. Only authorized members can approve screenshots.</p>
            </article>
            <article className="scroll-card">
              <span className="feature-icon"><Icon name="link" size={20}/></span>
              <h3>Forum-ready output</h3>
              <p>Get direct image URLs and grouped BBCode in a clean format that is easy to paste into GTAW forum posts.</p>
            </article>
            <article className="scroll-card">
              <span className="feature-icon"><Icon name="lock" size={20}/></span>
              <h3>Private by design</h3>
              <p>Results go to the uploader's private Discord thread. Provider credentials and database access stay server-side.</p>
            </article>
            <article className="scroll-card">
              <span className="feature-icon"><Icon name="server" size={20}/></span>
              <h3>Server-specific configuration</h3>
              <p>Every server stores its own approval channel and role. Nothing is hard-coded for one community.</p>
            </article>
            <article className="scroll-card">
              <span className="feature-icon"><Icon name="shield" size={20}/></span>
              <h3>Serverless backend</h3>
              <p>Discord interactions are handled over HTTPS by the backend. There is no always-on Gateway worker to keep running.</p>
            </article>
          </div>
        </section>

        <section className="demo section lazy-section">
          <div className="demo-panel">
            <div className="demo-copy">
              <div className="eyebrow">THE DISCORD FLOW</div>
              <h2>Approve. Upload. Paste.</h2>
              <p>One message starts the process. The result appears in your private upload thread.</p>
              <button className="command-row" onClick={copyText}>
                <span>Right-click → Apps → Approve Screenshot</span>
                <b>{copied ? "Copied!" : "Copy"}</b>
              </button>
            </div>

            <div className="discord-card">
              <div className="message-head">
                <span className="bot-avatar">G</span>
                <div><strong>GTAW Image Manager</strong><small>APP</small></div>
                <span className="status-pill">✓ APPROVED</span>
              </div>
              <div className="message-body">
                <strong>☑️ Approved screenshot upload complete.</strong>

                <div className="provider-block">
                  <div className="provider-title">Cloudinary</div>
                  <span className="label">Links</span>
                  <code>https://res.cloudinary.com/.../screenshot-1.png</code>
                  <code>https://res.cloudinary.com/.../screenshot-2.png</code>
                  <span className="label">BBCode</span>
                  <code>[img]https://res.cloudinary.com/.../screenshot-1.png[/img]</code>
                  <code>[img]https://res.cloudinary.com/.../screenshot-2.png[/img]</code>
                </div>

                <div className="provider-block">
                  <div className="provider-title">ImgBB</div>
                  <span className="label">Links</span>
                  <code>https://i.ibb.co/.../screenshot-1.png</code>
                  <code>https://i.ibb.co/.../screenshot-2.png</code>
                  <span className="label">BBCode</span>
                  <code>[img]https://i.ibb.co/.../screenshot-1.png[/img]</code>
                  <code>[img]https://i.ibb.co/.../screenshot-2.png[/img]</code>
                </div>
              </div>
            </div>
          </div>
        </section></RevealOnScroll>

        <RevealOnScroll><section id="faq" className="faq section lazy-section"> className="faq section">
          <div className="section-heading">
            <div className="eyebrow">FAQ</div>
            <h2>Everything you need to know.</h2>
          </div>

          <div className="faq-list">
            {faqItems.map(([question, answer], index) => (
              <button
                key={question}
                className={`faq-item ${faq === index ? "open" : ""}`}
                onClick={() => setFaq(faq === index ? -1 : index)}
                aria-expanded={faq === index}
              >
                <span>
                  <strong>{question}</strong>
                  {faq === index && <small>{answer}</small>}
                </span>
                <span className="faq-icon"><Icon name="chevron" size={17}/></span>
              </button>
            ))}
          </div>
        </section></RevealOnScroll>
      </main>

      <footer className="footer">
        <div>
          <strong>GTAW Image Manager</strong>
          <span>Discord-first screenshot hosting for GTAW players.</span>
        </div>
        <div className="footer-links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">Source</a>
          <a href={serverInstallUrl} target="_blank" rel="noreferrer">Add to Discord</a>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
