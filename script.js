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
        fetch(document.getElementById('urlInput').value, { method: 'GET', mode: 'no-cors' })
            .then(() => console.log('Pinged!'))
            .catch(() => console.log('Ping failed.'));
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
        // Fetch detailed information from 2ip.ru
        const apiUrl = `https://2ip.ru/api/v1/ipinfo/${url}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data) {
            result += `
                <strong>IP Information:</strong><br>
                IP: ${data.ip}<br>
                Hostname: ${data.hostname || 'N/A'}<br>
                Country: ${data.country}<br>
                Region: ${data.region}<br>
                City: ${data.city}<br>
                ISP: ${data.isp}<br>
                Organization: ${data.org || 'N/A'}<br>
                Latitude/Longitude: ${data.lat}, ${data.lon}<br>
                Timezone: ${data.timezone}<br>
                ASN: ${data.as || 'N/A'}<br>
                Proxy: ${data.proxy ? 'Yes' : 'No'}<br>
                Connection Type: ${data.connection || 'N/A'}<br>
                Country Code: ${data.country_code || 'N/A'}<br>
                Region Code: ${data.region_code || 'N/A'}<br>
                Zip Code: ${data.zip || 'N/A'}<br>
                Network Type: ${data.network_type || 'N/A'}<br>
                ISP Organization: ${data.isp_organization || 'N/A'}<br>
                Services: ${data.services || 'N/A'}<br>
                Domains: ${data.domains || 'N/A'}<br><br>
            `;
        } else {
            result += `Failed to retrieve IP info for ${url}.<br><br>`;
        }

    } catch (error) {
        result += `Error fetching data: ${error.message}<br>`;
    }

    return result;
}

async function pingSite(url) {
    const start = performance.now();
    try {
        await fetch(url, { method: 'GET', mode: 'no-cors' });
        const end = performance.now();
        return Math.round(end - start);
    } catch (error) {
        return 'Ping failed: ' + error.message;
    }
}
