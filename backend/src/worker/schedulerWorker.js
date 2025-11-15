require('dotenv').config();
const storage = require('../storage/storageClient');
const { postToInstagram } = require('../posters/instagram');
const { postToYouTube } = require('../posters/youtube');
const { postToLinkedIn } = require('../posters/linkedin');

const MAX_ATTEMPTS = 3;
const INITIAL_BACKOFF_MS = 2000; // 2 seconds

async function processQueue() {
    console.log('Scheduler worker running...');
    const posts = await storage.getPosts();

    const duePosts = posts.filter(p =>
        p.status === 'scheduled' &&
        p.approved &&
        new Date(p.scheduled_at) <= new Date()
    );

    for (const post of duePosts) {
        await processPost(post);
    }
    console.log('Scheduler worker finished.');
}

async function processPost(post) {
    await storage.updatePost(post.id, { status: 'posting', last_attempt_at: new Date().toISOString() });

    let allSucceeded = true;
    const platforms = post.platforms.split(','); // Assuming platforms are comma-separated

    for (const platform of platforms) {
        try {
            await attemptPost(platform.trim(), post);
        } catch (error) {
            allSucceeded = false;
            console.error(`Failed to post to ${platform} for post ${post.id}:`, error.message);
        }
    }

    if (allSucceeded) {
        await storage.updatePost(post.id, { status: 'posted' });
    } else {
        await storage.updatePost(post.id, { status: 'error' });
    }
}

async function attemptPost(platform, post) {
    let attempts = post.attempts || 0;
    while (attempts < MAX_ATTEMPTS) {
        try {
            switch (platform) {
                case 'instagram':
                    await postToInstagram(post);
                    break;
                case 'youtube':
                    await postToYouTube(post);
                    break;
                case 'linkedin':
                    await postToLinkedIn(post);
                    break;
                default:
                    throw new Error(`Unknown platform: ${platform}`);
            }
            return; // Success
        } catch (error) {
            attempts++;
            await storage.updatePost(post.id, { attempts });
            if (attempts >= MAX_ATTEMPTS) {
                throw error;
            }
            const backoff = INITIAL_BACKOFF_MS * Math.pow(3, attempts - 1);
            console.log(`Retrying ${platform} post for ${post.id} in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
        }
    }
}


if (require.main === module) {
    processQueue().catch(console.error);
}

module.exports = {
    processQueue,
};
