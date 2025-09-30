import { useState } from "react";

function App() {
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
    const response = await fetch("/api/generate", {
      method: "POST", // we are sending data
      body: JSON.stringify(formData), // turn the JS object into a string
    });

    // Turn the response into usable JSON
    const data = await response.json();

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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Thank You Note Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Product/Service:
          <input
            name="product"
            value={formData.product}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Generate Message</button>
      </form>
      {message && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Generated Note:</h3>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default App;

