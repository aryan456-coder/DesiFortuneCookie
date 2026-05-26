import axios from "axios";
import { useState } from "react";

function CookieCracker() {
  const [fortune, setFortune] = useState("");
    
  const resetCracker = () => {
    setFortune("");
  };
const dispenseWisdom = () => {
  console.log("dispensing wisdom");
  console.log(import.meta.env.VITE_API_URL);
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/fortune/random`)
    .then((response) => {
      console.log(response.data);
      setFortune(response.data);
    })
    .catch((err) => console.log(err));
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
            {!fortune && (
              <div
                className="big-cookie"
                onClick={dispenseWisdom}
                title="Tap to Crack!!"
              >
                🍪
              </div>
            )}
          </div>

          <div className="fortune-card-live">

            {fortune ? (
              <>
                <div className="aunty-tag">
                  <div className="aunty-avatar">👩‍🦱</div>

                  <div>
                    <div className="aunty-name">Aunty Ji</div>
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
                <h3>Your Fortune Will Be Revealed Soon😌</h3>
              </>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

export default CookieCracker;