<svelte:head>
  <title>Daily Dose of Calm</title>
  <style>
    /* Global styles for the calming background */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: linear-gradient(135deg, #a8e6cf, #d8a7e2);
      background-attachment: fixed; /* Keep gradient fixed during scroll */
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden; /* Hide scrollbars caused by animation/layout */
    }

    /* The main card container */
    .card {
      background: rgba(255, 255, 255, 0.85); /* Semi-transparent white */
      backdrop-filter: blur(10px); /* Frosted glass effect */
      border-radius: 20px;
      padding: 40px 50px;
      text-align: center;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      border: 1px solid rgba(255, 255, 255, 0.18);
      animation: fadeIn 1.5s ease-in-out;
      opacity: 0; /* Start hidden for animation */
      animation-fill-mode: forwards; /* Stay visible after animation */
      max-width: 500px;
    }

    /* Large, welcoming title */
    h1 {
      font-size: 2.8em;
      font-weight: 300;
      color: #2c3e50;
      margin-bottom: 0.5em;
    }

    /* Subtitle or welcome message */
    p {
      font-size: 1.2em;
      color: #555;
      line-height: 1.6;
    }

    /* The fade-in animation */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</svelte:head>

<div class="card">
  <h1>Welcome to your Daily Dose of Calm</h1>
  <p>Your sanctuary for peace and mindfulness. Take a deep breath and relax.</p>
</div>
