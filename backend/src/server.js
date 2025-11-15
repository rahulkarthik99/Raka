require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const storage = require('./storage/storageClient');
const { generateSinglePost, generateBatchPosts } = require('./generators/contentGenerator');
const { generateImage } = require('./generators/imageGenerator');

// --- API Endpoints ---

// Generate content and save as drafts
app.post('/api/generate', async (req, res) => {
    const { topic, tone, count = 1, destination_url } = req.body;
    if (!topic || !tone) {
        return res.status(400).json({ error: 'Topic and tone are required.' });
    }

    try {
        const postsData = (count > 1)
            ? await generateBatchPosts({ topic, tone, count })
            : [await generateSinglePost({ topic, tone, length: 'medium', destination_url })];

        for (const postData of postsData) {
            // Generate an image for each post
            const imageUrl = await generateImage(postData.image_prompt);
            const fullPost = {
                topic,
                ...postData,
                image_url: imageUrl,
                status: 'draft',
            };
            await storage.createPost(fullPost);
        }
        res.status(201).json({ message: `${count} post(s) generated successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate content.' });
    }
});

// Get all posts from the queue
app.get('/api/queue', async (req, res) => {
    try {
        const posts = await storage.getPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts.' });
    }
});

// Get a single post
app.get('/api/queue/:id', async (req, res) => {
    try {
        const post = await storage.getPost(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the post.' });
    }
});


// Update a post (for approving, scheduling, etc.)
app.put('/api/queue/:id', async (req, res) => {
    try {
        const updatedPost = await storage.updatePost(req.params.id, req.body);
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the post.' });
    }
});

// Delete a post
app.delete('/api/queue/:id', async (req, res) => {
    try {
        await storage.deletePost(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the post.' });
    }
});


app.get('/', (req, res) => {
    res.send('AutoPoster Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
