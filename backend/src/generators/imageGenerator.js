require('dotenv').config();
const axios = require('axios');

const IMAGE_GEN_API_KEY = process.env.IMAGE_GEN_API_KEY;
// This would be the actual endpoint for the image generation service (e.g., Stable Diffusion API)
const IMAGE_GEN_API_ENDPOINT = process.env.IMAGE_GEN_API_ENDPOINT || 'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image';


/**
 * Generates an image using an external API.
 * This function is a wrapper around the image generation tool/API.
 *
 * @param {string} prompt - The text prompt to generate the image from.
 * @returns {Promise<string>} - The URL of the generated image.
 */
async function generateImage(prompt) {
  // This is where the actual call to the image_gen tool or API would happen.
  // For demonstration, we'll simulate an API call and return a placeholder.
  // In a real implementation, you would replace this with the actual API call.

  console.log(`Generating image with prompt: "${prompt}"`);

  // Example for Stability AI API:
  try {
    const response = await axios.post(
        IMAGE_GEN_API_ENDPOINT,
        {
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            height: 1792,
            width: 1024,
            steps: 30,
            samples: 1,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${IMAGE_GEN_API_KEY}`,
            },
        }
    );

    const imageUrl = response.data.artifacts[0].base64; // Or however the API returns the image
    // Here you might need to save the image from a buffer/base64 and get a public URL
    // For now, let's assume it returns a direct URL or we can construct one.
    // This is a placeholder for the actual image URL.
    return `data:image/png;base64,${imageUrl}`;
  } catch (error) {
      console.error('Error generating image:', error.response ? error.response.data : error.message);
      // Returning a placeholder in case of an error to not break the flow during testing
      return 'https://via.placeholder.com/1024x1792.png?text=Image+Generation+Failed';
  }
}

module.exports = {
  generateImage,
};
