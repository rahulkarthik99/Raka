const { google } = require('googleapis');
const youtube = google.youtube('v3');
const fs = require('fs');

async function postToYouTube(post) {
    const { caption, video_path } = post;
    const credentials = JSON.parse(process.env.YOUTUBE_CREDENTIALS_JSON); // Assuming OAuth credentials are in a single JSON

    const auth = new google.auth.OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
    );

    auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

    google.options({ auth });

    try {
        const response = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: post.topic || 'A great new video',
                    description: caption,
                    tags: post.hashtags,
                },
                status: {
                    privacyStatus: 'private', // Can be 'public', 'private', or 'unlisted'
                },
            },
            media: {
                body: fs.createReadStream(video_path),
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading video to YouTube:', error.message);
        throw error;
    }
}

module.exports = {
    postToYouTube,
};
