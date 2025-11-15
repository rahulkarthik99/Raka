<header>
    <nav>
        <a href="/">Queue</a>
        <a href="/generator">Generator</a>
        <a href="/settings">Settings</a>
    </nav>
</header>

<main>
    <slot></slot>
</main>

<style>
    header {
        background-color: #f8f9fa;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
    }
    nav {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
    }
    nav a {
        text-decoration: none;
        color: #007bff;
        font-weight: 500;
    }
    main {
        padding: 1rem;
    }
</style>
