import { useChatbot } from "../ChatbotContext";
import HeroSlider from "../components/HeroSlider";
import women from "../assets/women.jpg";
import "./Home.css";

function Home() {
  const { setOpen } = useChatbot();

  // Add more photos here later, e.g. [women, womanTwo, womanThree]
  const heroImages = [women];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">You are not alone</span>
          <h1>Your voice matters.<br />Your rights are real.</h1>
          <p>
            A safe space for women in Nepal to understand their legal rights,
            share their stories, and find people who believe them.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setOpen(true)}>
              Talk to Saathi
            </button>
            <a href="/confessions" className="btn-secondary">Share Your Story</a>
          </div>
        </div>
        <div className="hero-image">
          <HeroSlider images={heroImages} />
        </div>
      </section>

      {/* rest of the page stays exactly the same — impact strip, help section, CTA banner */}
    </div>
  );
}

export default Home;