// Helper function to generate prompts based on message type
function getPromptForMessageType(messageType, name, product) {
  switch (messageType) {
    case 'thankyou':
      return `Write a short, personalized thank-you note for a customer named ${name} who purchased ${product}. Make it warm and specific to the product they bought.`;
    case 'apology':
      return `Write a short, personalized apology note for a customer named ${name} regarding issues with ${product}. Make it sincere and show that you're taking responsibility.`;
    case 'welcome':
      return `Write a short, personalized welcome message for a customer named ${name} who is joining ${product}. Make it enthusiastic and welcoming.`;
    case 'followup':
      return `Write a short, personalized follow-up message for a customer named ${name} about ${product}. Make it friendly and show you care about their experience.`;
    default:
      return `Write a short, personalized message for a customer named ${name} about ${product}. Make it warm and professional.`;
  }
}

export const handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method not allowed" }) 
    };
  }

  try {
    const { name, product, messageType = 'thankyou' } = JSON.parse(event.body);

    if (!name || !product) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Name and product are required" })
      };
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Return mock responses based on message type
      let mockMessages = [];
      
      if (messageType === 'thankyou') {
        mockMessages = [
          `Dear ${name},\n\nThank you so much for purchasing ${product}! We're absolutely thrilled that you chose our ${product} and we hope it brings you joy.\n\nWe truly appreciate your support and hope you love your new purchase. If you have any questions or need assistance, please don't hesitate to reach out.\n\nWith gratitude,\nThe Team`,
          `Hi ${name},\n\nWe wanted to take a moment to personally thank you for your purchase of ${product}. Your support means the world to us!\n\nWe hope you enjoy your ${product} and that it exceeds your expectations. Thank you for choosing us and for being such a valued customer.\n\nWarm regards,\nThe Team`,
          `Hello ${name},\n\nThank you for your wonderful purchase of ${product}! We're so grateful for your business and thrilled that you've chosen our ${product}.\n\nWe hope you love it as much as we loved creating it for you. Your support helps us continue doing what we love.\n\nWith heartfelt thanks,\nThe Team`
        ];
      } else if (messageType === 'apology') {
        mockMessages = [
          `Dear ${name},\n\nWe sincerely apologize for the issues you experienced with ${product}. We understand how frustrating this must be, and we want you to know that we take your concerns very seriously.\n\nWe're committed to making this right and ensuring you have a positive experience. Please don't hesitate to reach out if you need any assistance.\n\nWith our sincerest apologies,\nThe Team`,
          `Hi ${name},\n\nWe're truly sorry for the problems you encountered with ${product}. This is not the experience we want for our valued customers, and we deeply regret any inconvenience this has caused.\n\nWe're working hard to resolve this issue and prevent it from happening again. Thank you for your patience and understanding.\n\nWith heartfelt apologies,\nThe Team`,
          `Hello ${name},\n\nWe want to personally apologize for the difficulties you've faced with ${product}. Your satisfaction is our top priority, and we're disappointed that we didn't meet your expectations.\n\nWe're taking immediate steps to address this situation and ensure you receive the quality service you deserve.\n\nWith sincere apologies,\nThe Team`
        ];
      } else if (messageType === 'welcome') {
        mockMessages = [
          `Welcome ${name}!\n\nWe're absolutely thrilled to have you join our community! We're excited to share ${product} with you and can't wait for you to experience all the amazing benefits.\n\nYou're now part of something special, and we're here to support you every step of the way. If you have any questions, we're just a message away!\n\nWelcome aboard!\nThe Team`,
          `Hi ${name},\n\nWelcome to our family! We're so excited you've decided to join us and explore ${product}. You've made a fantastic choice, and we're confident you'll love what we have to offer.\n\nWe're here to help you get the most out of your experience. Don't hesitate to reach out if you need anything!\n\nWelcome to the team!\nThe Team`,
          `Hello ${name},\n\nA warm welcome to you! We're delighted that you've chosen to be part of our community and experience ${product}. You're in for something truly special!\n\nWe're committed to making your journey with us amazing. We're here to support you and ensure you have the best possible experience.\n\nWelcome to the family!\nThe Team`
        ];
      } else if (messageType === 'followup') {
        mockMessages = [
          `Hi ${name},\n\nWe wanted to follow up with you about ${product} and see how everything is going. We hope you're enjoying your experience and that everything is meeting your expectations.\n\nIf you have any questions, concerns, or feedback about ${product}, we'd love to hear from you. Your input helps us improve and serve you better.\n\nLooking forward to hearing from you!\nThe Team`,
          `Dear ${name},\n\nWe hope you're doing well! We wanted to check in about ${product} and see if there's anything we can help you with.\n\nWe're always here to support you and ensure you're getting the most out of your experience. Don't hesitate to reach out if you need anything at all.\n\nBest regards,\nThe Team`,
          `Hello ${name},\n\nWe wanted to touch base about ${product} and make sure everything is going smoothly for you. We hope you're having a great experience and that we can continue to support you.\n\nIf there's anything we can do to improve your experience or if you have any questions, please let us know. We're here to help!\n\nWarm regards,\nThe Team`
        ];
      }
      
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ note: randomMessage })
      };
    }

    // Make a request to the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that writes short, warm, and personalized messages for small businesses. Keep the tone friendly and professional.",
          },
          {
            role: "user",
            content: getPromptForMessageType(messageType, name, product),
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    const message = data.choices?.[0]?.message?.content?.trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ note: message || `Dear ${name}, thank you so much for your ${messageType} regarding ${product}! We truly appreciate your business.` }),
    };
  } catch (err) {
    console.error(err);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: "Something went wrong. Please try again." }) 
    };
  }
};

