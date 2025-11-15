<script>
    let topic = '';
    let tone = 'friendly';
    let count = 7;
    let isLoading = false;
    let message = '';

    async function generateContent() {
        isLoading = true;
        message = 'Generating...';
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, tone, count })
            });
            const result = await response.json();
            if (response.ok) {
                message = `Successfully generated ${result.count} posts!`;
                topic = ''; // Clear topic
            } else {
                throw new Error(result.message || 'Failed to generate content');
            }
        } catch (error) {
            message = error.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="container">
    <h1>Content Generator</h1>
    <p>Create a batch of new content drafts from a single topic.</p>

    <form on:submit|preventDefault={generateContent}>
        <div class="form-group">
            <label for="topic">Topic</label>
            <input type="text" id="topic" bind:value={topic} placeholder="e.g., 'Benefits of AI in marketing'" required>
        </div>

        <div class="form-group">
            <label for="tone">Tone</label>
            <select id="tone" bind:value={tone}>
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="urgent">Urgent</option>
                <option value="inspirational">Inspirational</option>
            </select>
        </div>

        <div class="form-group">
            <label for="count">Number of Posts (7-30)</label>
            <input type="number" id="count" bind:value={count} min="7" max="30">
        </div>

        <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Batch'}
        </button>
    </form>

    {#if message}
        <p class="message">{message}</p>
    {/if}
</div>

<style>
    .container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1rem;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
    }
    input, select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        padding: 0.75rem 1.5rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:disabled {
        background-color: #ccc;
    }
    .message {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f0f0f0;
        border-radius: 4px;
    }
</style>
