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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // This function runs when the user submits the form
const handleSubmit = async (e) => {
  e.preventDefault(); // Stop the page from refreshing when the form submits

  // Check if the user filled out both fields
  if (!formData.name || !formData.product) {
    setMessage("Please fill out both name and product fields."); // show error message
    return; // stop running the rest of the code
  }

  // Show a "loading" message while we wait for the API
  setMessage("Generating your note...");

  try {
    // Send the form data to our backend API (/api/generate.js)
    const response = await fetch("/.netlify/functions/generate", {
      method: "POST", // we are sending data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, messageType: activeTab }), // turn the JS object into a string
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Turn the response into usable JSON
    const data = await response.json();
    console.log("API Response:", data);

    // If the backend gave us a note, show it to the user
    if (data.note) {
      setMessage(data.note);
    } else {
      // If no note came back, show a fallback error message
      setMessage("Could not generate a note. Please try again.");
    }
  } catch (error) {
    // If the fetch request itself fails (like no internet or server crash)
    setMessage("The system is busy. Please try again in a moment.");
  }
};


  return (
    <div className="app-container">
      <div className="app-header">
        <h1>✨ Thank You Note Generator</h1>
        <p className="app-subtitle">Create personalized thank you messages in seconds</p>
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
              <label htmlFor="name">
                Recipient's Name *
              </label>
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
              <label htmlFor="email">
                Email Address
              </label>
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
                  activeTab === "thankyou" ? "What did they help you with?" :
                  activeTab === "apology" ? "What issue occurred?" :
                  activeTab === "welcome" ? "What service/product are they joining?" :
                  "What should we follow up about?"
                }
                required
              />
            </div>
            
            <button type="submit" className="generate-button">
              <span className="button-text">
                {activeTab === "thankyou" && "Generate Thank You Note"}
                {activeTab === "apology" && "Generate Apology Note"}
                {activeTab === "welcome" && "Generate Welcome Message"}
                {activeTab === "followup" && "Generate Follow-up Message"}
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

