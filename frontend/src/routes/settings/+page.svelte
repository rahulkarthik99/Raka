<div class="container">
    <h1>Settings</h1>
    <p>Manage your API keys and platform connections here.</p>

    <div class="settings-group">
        <h2>API Keys</h2>
        <div class="form-group">
            <label for="llm-key">LLM API Key</label>
            <input type="password" id="llm-key" placeholder="Enter your key">
        </div>
        <div class="form-group">
            <label for="image-gen-key">Image Gen API Key</label>
            <input type="password" id="image-gen-key" placeholder="Enter your key">
        </div>
    </div>

    <div class="settings-group">
        <h2>Platform Connections</h2>
        <div class="connection-status">
            <span>Instagram/Facebook</span>
            <button>Connect</button>
        </div>
         <div class="connection-status">
            <span>LinkedIn</span>
            <button>Connect</button>
        </div>
        <!-- YouTube will be added back when video is supported -->
    </div>

</div>

<style>
    .container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 1rem;
    }
    .settings-group {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    .connection-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #eee;
    }
</style>
