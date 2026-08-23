import axios from "axios";
import { useEffect, useState } from "react";

function CookieCracker() {
  const [fortune, setFortune] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState(
    "🧐 Aunty Ji is thinking..."
  );

  const thinkingMessages = [
    "🧐 Aunty Ji is thinking...",
    "☕ Aunty Ji is having chai first...",
    "👀 Aunty Ji is judging your life choices...",
    "🔮 Aunty Ji is consulting the universe...",
    "📞 Aunty Ji is asking your mummy...",
    "🤔 Aunty Ji needs a moment...",
    "✨ Aunty Ji has decided your fate..."
  ];

  useEffect(() => {
    if (!loading) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % thinkingMessages.length;
      setThinkingMessage(thinkingMessages[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  const resetCracker = () => {
    setFortune("");
  };

  const dispenseWisdom = () => {
    // Prevent multiple API calls
    if (loading) return;

    console.log("dispensing wisdom");
    console.log(import.meta.env.VITE_API_URL);

    setLoading(true);
    setFortune("");

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/fortune/random`)
      .then((response) => {
        console.log(response.data);
        setFortune(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="Crack">
      <div id="cracker">

        <span className="prop prop1">✨</span>
        <span className="prop prop2">🍪</span>
        <span className="prop prop3">🧾</span>
        <span className="prop prop4">💫</span>
        <span className="prop prop5">🍀</span>

        <div className="cracker-grid">

          <div className="cracker-left">
            <h2>Ready for your fortune??</h2>

            <p>
              Aunty ji is waiting. Don’t keep her waiting for long.
              She has opinions.
            </p>
          </div>

          <div className="cookie-wrapper">

            {!fortune && !loading && (
              <div
                className="big-cookie"
                onClick={dispenseWisdom}
                title="Tap to Crack!!"
              >
                🍪
              </div>
            )}

            {loading && (
              <div className="big-cookie thinking-cookie">
                🔮
              </div>
            )}

          </div>

          <div className="fortune-card-live">

            {loading ? (
              <>
                <div className="aunty-tag">

                  <div className="aunty-avatar">
                    👩‍🦱
                  </div>

                  <div>
                    <div className="aunty-name">
                      Aunty Ji
                    </div>

                    <div className="aunty-title">
                      Chief Fortune Dispenser
                    </div>
                  </div>

                </div>

                <blockquote>
                  <p className="thinking-text">
                    {thinkingMessage}
                  </p>
                </blockquote>

                <div className="thinking-dots">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              </>
            ) : fortune ? (
              <>
                <div className="aunty-tag">

                  <div className="aunty-avatar">
                    👩‍🦱
                  </div>

                  <div>
                    <div className="aunty-name">
                      Aunty Ji
                    </div>

                    <div className="aunty-title">
                      Chief Fortune Dispenser
                    </div>
                  </div>

                </div>

                <blockquote>
                  <p>{fortune?.text}</p>
                </blockquote>

                <div className="hindi">
                  {fortune?.hindi}
                </div>

                <button
                  className="crack-again"
                  onClick={resetCracker}
                >
                  Crack another one 🍪
                </button>
              </>
            ) : (
              <>
                <h3>
                  Your Fortune Will Be Revealed Soon😌
                </h3>
              </>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

export default CookieCracker;