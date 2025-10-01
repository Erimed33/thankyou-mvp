import 'dotenv/config';
// This function will run when someone hits /api/generate
// Vercel treats any file in /api as an API endpoint
export default async function handler(req, res) {
  // Only allow POST requests (because we expect data to be sent in)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Pull "name" and "product" from the request body
    // JSON.parse turns the raw string into a JS object
    const { name, product } = JSON.parse(req.body);

    // Make a request to the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", // we're sending data
      headers: {
        "Content-Type": "application/json", // tell OpenAI we're sending JSON
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // use our secret key stored in env vars
      },
      // This is the "prompt" we send to OpenAI
      body: JSON.stringify({
        model: "gpt-4o-mini", // model to use (cheap + fast for MVP)
        messages: [
          {
            role: "system", // sets the AI's role or personality
            content: "You are a helpful assistant that writes short thank-you notes for small businesses.",
          },
          {
            role: "user", // what the user is asking for
            content: `Write a short thank-you note for a customer named ${name} who purchased ${product}.`,
          },
        ],
      }),
    });

    // Turn the response into JSON we can use
    const data = await response.json();
console.log("OpenAI response:", data);

    // Safely pull the generated message from the response
    const message = data.choices?.[0]?.message?.content?.trim();

    // Send a successful response back to the frontend
    // If OpenAI doesn't return anything, fall back to a generic thank-you
    res.status(200).json({ note: message || "Thank you for your purchase!" });
  } catch (err) {
    // If something breaks (bad request, OpenAI down, etc.)
    console.error(err); // log the actual error for us
    res.status(500).json({ error: "Something went wrong. Please try again." }); // send friendly message to user
  }
}
