
import sampleFortunes from "../data/sampleFortunes";

function SampleFortunes() {
  return <section className="fortune-section reveal" id="sample">
        <div className="section-label1">Sample fortunes</div>
        <h2 className="section-title">A taste of wisdom 🖤</h2>
        <div className="fortune-cards">
            <div className="fortune-card">
                <div className="aunty-tag">
                    <div className="aunty-avatar">👩‍🦱</div>
                    <div>
                        <div className="aunty-name">Aunty ji</div>
                        <div className="aunty-title">Cheif Fortune D Spencer</div>
                    </div>
                </div>
                <blockquote>"Great success is coming!! - but only after you stop sleeping till 11."</blockquote>
                <div className="hindi-tag">Neend kam, kaam zyada ⏰</div>
            </div>
            <div className="fortune-card">
                <div className="aunty-tag">
                    <div className="aunty-avatar">👩‍🦱</div>
                    <div>
                        <div className="aunty-name">Aunty ji</div>
                        <div className="aunty-title">Cheif Fortune D Spencer</div>
                    </div>
                </div>
                <blockquote>"Beta, Why are you worrying? First finish your plate. Tension lene se kya hoga."
                </blockquote>
                <div className="hindi-tag">Pehle Khana fir Sochna 🍛</div>
            </div>
            <div className="fortune-card">
                <div className="aunty-tag">
                    <div className="aunty-avatar">👩‍🦱</div>
                    <div>
                        <div className="aunty-name">Aunty ji</div>
                        <div className="aunty-title">Cheif Fortune D Spencer</div>
                    </div>
                </div>
                <blockquote>"Happiness will knock soon. Please make sure the house is clean. What will people think?"
                </blockquote>
                <div className="hindi-tag">Saaf safai zaroori hai 🧹</div>
            </div>
        </div>
    </section>
}

export default SampleFortunes;