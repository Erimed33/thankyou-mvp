import { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("thankyou");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    product: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // new loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.product) {
      setMessage("Please fill out both name and product fields.");
      return;
    }

    setLoading(true);
    setMessage("✨ Generating your note...");

    try {
      // ✅ Correct Netlify Function URL
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // send current tab type too (thankyou/apology/etc.)
        body: JSON.stringify({ ...formData, messageType: activeTab }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.note) {
        setMessage(data.note);
      } else {
        setMessage("⚠️ Could not generate a note. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("🚧 The system is busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>✨ Thank You Note Generator</h1>
        <p className="app-subtitle">
          Create personalized thank you messages in seconds
        </p>
      </div>

      <div className="app-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "thankyou" ? "active" : ""}`}
            onClick={() => setActiveTab("thankyou")}
          >
            💜 Thank You
          </button>
          <button
            className={`tab-button ${activeTab === "apology" ? "active" : ""}`}
            onClick={() => setActiveTab("apology")}
          >
            🙏 Apology
          </button>
          <button
            className={`tab-button ${activeTab === "welcome" ? "active" : ""}`}
            onClick={() => setActiveTab("welcome")}
          >
            👋 Welcome
          </button>
          <button
            className={`tab-button ${activeTab === "followup" ? "active" : ""}`}
            onClick={() => setActiveTab("followup")}
          >
            📞 Follow-up
          </button>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="thank-you-form">
            <div className="form-group">
              <label htmlFor="name">Recipient's Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter the person's name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="product">
                {activeTab === "thankyou" && "Product/Service *"}
                {activeTab === "apology" && "What went wrong? *"}
                {activeTab === "welcome" && "What are they joining? *"}
                {activeTab === "followup" && "What to follow up about? *"}
              </label>
              <input
                id="product"
                name="product"
                type="text"
                value={formData.product}
                onChange={handleChange}
                placeholder={
                  activeTab === "thankyou"
                    ? "What did they help you with?"
                    : activeTab === "apology"
                    ? "What issue occurred?"
                    : activeTab === "welcome"
                    ? "What service/product are they joining?"
                    : "What should we follow up about?"
                }
                required
              />
            </div>

            <button type="submit" className="generate-button" disabled={loading}>
              <span className="button-text">
                {loading
                  ? "Generating..."
                  : activeTab === "thankyou"
                  ? "Generate Thank You Note"
                  : activeTab === "apology"
                  ? "Generate Apology Note"
                  : activeTab === "welcome"
                  ? "Generate Welcome Message"
                  : "Generate Follow-up Message"}
              </span>
              <span className="button-icon">
                {activeTab === "thankyou" && "💜"}
                {activeTab === "apology" && "🙏"}
                {activeTab === "welcome" && "👋"}
                {activeTab === "followup" && "📞"}
              </span>
            </button>
          </form>
        </div>

        {message && (
          <div className="message-container">
            <div className="message-header">
              <h3>
                {activeTab === "thankyou" && "Your Personalized Thank You Note"}
                {activeTab === "apology" && "Your Personalized Apology Note"}
                {activeTab === "welcome" && "Your Personalized Welcome Message"}
                {activeTab === "followup" && "Your Personalized Follow-up Message"}
              </h3>
              <div className="message-decoration">
                {activeTab === "thankyou" && "💌"}
                {activeTab === "apology" && "🙏"}
                {activeTab === "welcome" && "👋"}
                {activeTab === "followup" && "📞"}
              </div>
            </div>
            <div className="message-content">
              <p>{message}</p>
            </div>
            <button
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(message)}
            >
              📋 Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
