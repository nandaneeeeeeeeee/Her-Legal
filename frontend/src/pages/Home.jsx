import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>You Are Not Alone.</h1>
        <p className="hero-subtitle">
          Know your rights. Share your story. Find your community.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Talk to Saathi (Chatbot)</button>
          <button className="btn-secondary">Share Your Story</button>
        </div>
      </section>

      <section className="info-cards">
        <div className="card">
          <div className="card-icon">⚖️</div>
          <h3>Know Your Rights</h3>
          <p>Simple, clear answers about women's legal rights in Nepal.</p>
        </div>
        <div className="card">
          <div className="card-icon">💬</div>
          <h3>Share & Get Support</h3>
          <p>Speak freely. Get advice from people who understand.</p>
        </div>
        <div className="card">
          <div className="card-icon">📰</div>
          <h3>Real Stories</h3>
          <p>Read how other women found help — and found their voice.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;