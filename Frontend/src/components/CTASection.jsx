
function CTASection()
{
    return <section className="cta-section reveal">
        <div className="cta-box">
            <span className="cta-cookie">🍪</span>
            <h2 className="section-title" style={{color:"white" ,maxWidth:"none"}}>One more cookie, beta.</h2>
            <button onClick={()=>scrollTo({top: 2375, behavior: 'smooth'})} href="#Crack" id="btnam" style={{ }}>✨Get your fortune</button>
            <p>Aunty Ji never runs out of advice. Neither should you.</p>
            
        </div>
    </section>
}
export default CTASection;  


