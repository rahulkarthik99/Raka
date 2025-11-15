require('dotenv').config();
const axios = require('axios');

const LLM_API_KEY = process.env.LLM_API_KEY;
// Assuming an OpenAI-compatible endpoint
const LLM_API_ENDPOINT = process.env.LLM_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

/**
 * Generates content for a single social media post.
 * @param {string} topic - The topic of the post.
 * @param {string} tone - The desired tone (e.g., friendly, urgent).
 * @param {string} length - The desired length (short/medium/long).
 * @param {string} destination_url - The URL for the call to action.
 * @returns {Promise<object>} - The generated content object.
 */
async function generateSinglePost({ topic, tone, length, destination_url }) {
  const prompt = `
    Input: ${topic}, ${tone}, ${length}, ${destination_url}

    Task: Produce:
    1) A short caption (1-3 sentences) optimized for social engagement (hook + value + CTA).
    2) Exactly 3 relevant hashtags (each preceded by #).
    3) A 1-line image generation prompt tailored to vertical format (1024x1792) describing scene, mood, and composition.
    4) A 1-line alt-text for accessibility.
    5) A 2-line CTA encouraging click-through to ${destination_url}.

    Tone: ${tone}
    Length: ${length}
    Return JSON only: { "caption": "...", "hashtags": ["#...","#...","#..."], "image_prompt": "...", "alt_text": "...", "cta": "..." }
  `;

  try {
    const response = await axios.post(
      LLM_API_ENDPOINT,
      {
        model: 'gpt-4o', // Or any other suitable model
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LLM_API_KEY}`,
        },
      }
    );

    const content = JSON.parse(response.data.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Error generating content from LLM:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate content.');
  }
}

/**
 * Generates a batch of content variations.
 * @param {string} topic - The topic for the posts.
 * @param {string} tone - The desired tone.
 * @param {number} count - The number of variations to generate (e.g., 14).
 * @returns {Promise<Array<object>>} - An array of generated content objects.
 */
async function generateBatchPosts({ topic, tone, count }) {
    const prompt = `Generate ${count} variations for the topic "${topic}" with tone ${tone}. Return an array of JSON objects following the single post output. Ensure diversity of hooks and CTAs.`;

    try {
        const response = await axios.post(
          LLM_API_ENDPOINT,
          {
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${LLM_API_KEY}`,
            },
          }
        );

        // Assuming the response is an object with a key containing the array
        const result = JSON.parse(response.data.choices[0].message.content);
        return result.variations || result; // Adjust based on actual API response structure
    } catch (error) {
        console.error('Error generating batch content from LLM:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate batch content.');
    }
}


module.exports = {
  generateSinglePost,
  generateBatchPosts
};
