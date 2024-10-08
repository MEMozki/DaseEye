document.getElementById('searchBtn').addEventListener('click', async () => {
    const url = document.getElementById('urlInput').value;
    if (url) {
        const status = document.getElementById('status');
        status.innerHTML = 'Fetching data...';

        // Show DDoS buttons after search
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('stopBtn').style.display = 'inline-block';

        const info = await getIpInfo(url);
        status.innerHTML = info;
    } else {
        document.getElementById('status').innerHTML = 'Please enter a valid domain or IP address.';
    }
});

document.getElementById('startBtn').addEventListener('click', () => {
    const status = document.getElementById('status');
    status.innerHTML = 'Simulating DDoS attack...';
    // Start the DDoS simulation (this is just a placeholder)
    ddosInterval = setInterval(() => {
        fetch(`https://cors-anywhere.herokuapp.com/http://ip-api.com/json/${encodeURIComponent(document.getElementById('urlInput').value)}`, {
            method: 'GET',
            mode: 'cors'
        })
            .then(() => console.log('Pinged!'))
            .catch((error) => console.error('Ping failed:', error));
    }, 5000); // Ping every 5 seconds
});

document.getElementById('stopBtn').addEventListener('click', () => {
    clearInterval(ddosInterval);
    const status = document.getElementById('status');
    status.innerHTML = 'DDoS simulation stopped.';
});

let ddosInterval;

async function getIpInfo(url) {
    let result = '';

    try {
        // Fetch detailed information from ip-api.com via CORS proxy
        const apiUrl = `https://cors-anywhere.herokuapp.com/http://ip-api.com/json/${encodeURIComponent(url)}`;
        console.log('Fetching from URL:', apiUrl); // Debugging line
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.status === "fail") {
            result += `Failed to retrieve IP info for ${url}. Reason: ${data.message}<br><br>`;
        } else {
            result += `
                <strong>IP Information:</strong><br>
                IP: ${data.query}<br>
                Hostname: ${data.hostname || 'N/A'}<br>
                Country: ${data.country}<br>
                Region: ${data.regionName}<br>
                City: ${data.city}<br>
                ISP: ${data.isp}<br>
                Organization: ${data.org || 'N/A'}<br>
                Latitude/Longitude: ${data.lat}, ${data.lon}<br>
                Timezone: ${data.timezone}<br>
                AS: ${data.as || 'N/A'}<br>
                Proxy: ${data.proxy ? 'Yes' : 'No'}<br>
                Connection Type: ${data.connection_type || 'N/A'}<br>
                Country Code: ${data.countryCode || 'N/A'}<br>
                Region Code: ${data.regionCode || 'N/A'}<br>
                Zip Code: ${data.zip || 'N/A'}<br><br>
            `;
        }

    } catch (error) {
        result += `Error fetching data: ${error.message}<br>`;
    }

    return result;
}

async function pingSite(url) {
    const status = document.getElementById('status');
    const start = performance.now();

    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
            method: 'GET',
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const end = performance.now();
        const ping = Math.round(end - start);
        return `Ping: ${ping} ms`;
    } catch (error) {
        return `Ping failed: ${error.message}`;
    }
}
