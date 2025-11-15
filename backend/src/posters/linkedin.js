const axios = require('axios');

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

async function postToLinkedIn(post) {
    const { caption, image_url } = post;
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const author = `urn:li:organization:${process.env.LINKEDIN_COMPANY_ID}`;

    try {
        // 1. Register the image upload
        const registerUploadResponse = await axios.post(
            `${LINKEDIN_API_URL}/assets?action=registerUpload`,
            {
                registerUploadRequest: {
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                    owner: author,
                    serviceRelationships: [{
                        relationshipType: 'OWNER',
                        identifier: 'urn:li:userGeneratedContent'
                    }]
                }
            },
            { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );

        const uploadUrl = registerUploadResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const asset = registerUploadResponse.data.value.asset;

        // 2. Download the image from image_url
        const imageResponse = await axios.get(image_url, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');


        // 3. Upload the image binary to the uploadUrl
        await axios.put(uploadUrl, imageBuffer, {
            headers: { 'Content-Type': 'application/octet-stream' }
        });

        // 4. Create the UGC post with the image asset
        const response = await axios.post(
            `${LINKEDIN_API_URL}/ugcPosts`,
            {
                author: author,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: caption
                        },
                        shareMediaCategory: 'IMAGE',
                        media: [{
                            status: 'READY',
                            media: asset
                        }]
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            },
            { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );
        console.log('Successfully posted to LinkedIn:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error posting to LinkedIn:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    postToLinkedIn,
};
