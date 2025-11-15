const FB = require('fb');
const fs = require('fs');

async function postToInstagram(post) {
    const { caption, image_url, video_url, media_type } = post;
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
    const igUserId = process.env.IG_USER_ID;

    FB.setAccessToken(accessToken);

    if (media_type === 'video' && video_url) {
        // IMPORTANT: The Instagram Graph API requires a publicly accessible URL for video uploads.
        // This means the video file cannot be a local file path.
        // You must host the video file on a public server and provide the URL here.
        // For local development, a tool like ngrok can be used to expose your local server.
        // The PUBLIC_URL environment variable should be set to the base of this public URL.
        const publicVideoUrl = `${process.env.PUBLIC_URL}${video_url}`;

        if (!process.env.PUBLIC_URL) {
            throw new Error('PUBLIC_URL environment variable is not set. A public URL is required for Instagram video uploads.');
        }

        try {
            const containerResponse = await FB.api(`${igUserId}/media`, 'post', {
                media_type: 'VIDEO',
                video_url: publicVideoUrl,
                caption: caption,
            });

            if (!containerResponse || containerResponse.error) {
                throw new Error('Error creating media container: ' + (containerResponse.error.message || 'Unknown error'));
            }

            // Check for container readiness
            let isReady = false;
            let statusResponse;
            while (!isReady) {
                statusResponse = await FB.api(containerResponse.id, 'get', { fields: 'status_code' });
                if (statusResponse.status_code === 'FINISHED') {
                    isReady = true;
                } else if (statusResponse.status_code === 'ERROR') {
                    throw new Error('Media container processing failed.');
                }
                await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
            }

            const publishResponse = await FB.api(`${igUserId}/media_publish`, 'post', {
                creation_id: containerResponse.id,
            });

            return publishResponse;
        } catch (error) {
            console.error('Error posting video to Instagram:', error.message);
            throw error;
        }

    } else { // Default to image posting
        const publicImageUrl = image_url; // Assuming image_url is already public

        try {
            const containerResponse = await FB.api(`${igUserId}/media`, 'post', {
                image_url: publicImageUrl,
                caption: caption,
            });

            if (!containerResponse || containerResponse.error) {
                throw new Error('Error creating media container: ' + (containerResponse.error.message || 'Unknown error'));
            }

            const publishResponse = await FB.api(`${igUserId}/media_publish`, 'post', {
                creation_id: containerResponse.id,
            });

            return publishResponse;
        } catch (error) {
            console.error('Error posting image to Instagram:', error.message);
            throw error;
        }
    }
}

module.exports = {
    postToInstagram,
};
