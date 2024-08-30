// script.js

let pingInterval;

function startPing() {
    const url = document.getElementById('urlInput').value.trim();
    const statusDiv = document.getElementById('status');

    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    if (pingInterval) {
        alert('Ping is already running.');
        return;
    }

    statusDiv.innerHTML = `Pinging ${url}...`;
    pingInterval = setInterval(() => {
        // Simulated ping request (no real impact)
        fetch(url)
            .then(response => {
                if (response.ok) {
                    console.log(`Ping successful: ${url}`);
                } else {
                    console.log(`Ping failed: ${url}`);
                }
            })
            .catch(error => {
                console.log(`Ping error: ${error}`);
            });
    }, 1000); // Ping every 1 second
}

function stopPing() {
    const statusDiv = document.getElementById('status');

    if (!pingInterval) {
        alert('No ping is currently running.');
        return;
    }

    clearInterval(pingInterval);
    pingInterval = null;
    statusDiv.innerHTML = 'Pinging stopped.';
    console.log('Ping stopped.');
}
