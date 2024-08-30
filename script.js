document.getElementById('startBtn').addEventListener('click', async () => {
    const url = document.getElementById('urlInput').value;
    if (url) {
        const status = document.getElementById('status');
        status.innerHTML = 'Fetching data...';
        const info = await getIpInfo(url);
        status.innerHTML = info;
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    // Here you can add any logic needed to stop actions initiated by the Start button
    const status = document.getElementById('status');
    status.innerHTML = 'Stopped.';
});

async function getIpInfo(url) {
    let result = '';

    try {
        // Ping the Site
        const pingTime = await pingSite(url);
        result += `<strong>Ping:</strong> ${pingTime} ms<br><br>`;

        // IP-API Information
        const ipApiUrl = `http://ip-api.com/json/${url}`;
        const ipResponse = await fetch(ipApiUrl);
        const ipData = await ipResponse.json();

        if (ipData.status === "success") {
            result += `
                <strong>IP Information:</strong><br>
                IP: ${ipData.query}<br>
                Country: ${ipData.country}<br>
                Region: ${ipData.regionName}<br>
                City: ${ipData.city}<br>
                ISP: ${ipData.isp}<br>
                Org: ${ipData.org}<br>
                AS: ${ipData.as}<br>
                Lat/Lon: ${ipData.lat}, ${ipData.lon}<br>
                Zip: ${ipData.zip}<br>
                Timezone: ${ipData.timezone}<br><br>
            `;
        } else {
            result += `Failed to retrieve IP info for ${url}. Reason: ${ipData.message}<br><br>`;
        }

        // Whois Information
        const whoisApiUrl = `https://jsonwhoisapi.com/api/v1/whois?identifier=${url}`;
        const whoisResponse = await fetch(whoisApiUrl, {
            headers: {
                "Authorization": "Bearer YOUR_API_KEY"  // Replace with your actual API key
            }
        });
        const whoisData = await whoisResponse.json();

        result += `<strong>Whois Information:</strong><br>`;
        if (whoisData.domain_name) {
            result += `
                Domain: ${whoisData.domain_name}<br>
                Registrar: ${whoisData.registrar}<br>
                Registered On: ${whoisData.created_date}<br>
                Expires On: ${whoisData.expiry_date}<br>
                Updated On: ${whoisData.updated_date}<br>
                Nameservers: ${whoisData.nameservers.join(', ')}<br>
            `;
        } else {
            result += `No Whois information available.<br>`;
        }

        // DNS Information
        const dnsApiUrl = `https://api.hackertarget.com/dnslookup/?q=${url}`;
        const dnsResponse = await fetch(dnsApiUrl);
        const dnsData = await dnsResponse.text();

        result += `<br><strong>DNS Information:</strong><br><pre>${dnsData}</pre>`;

        // SSL Labs Information
        const sslApiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${url}`;
        const sslResponse = await fetch(sslApiUrl);
        const sslData = await sslResponse.json();

        result += `<br><strong>SSL/TLS Information:</strong><br>`;
        if (sslData.status === "READY") {
            const endpoint = sslData.endpoints[0];
            result += `
                Grade: ${endpoint.grade}<br>
                Server: ${endpoint.serverName}<br>
                IP Address: ${endpoint.ipAddress}<br>
                TLS Version: ${endpoint.details.protocols[0].version}<br>
                Issuer: ${endpoint.details.cert.issuerLabel}<br>
                Expiration Date: ${new Date(endpoint.details.cert.notAfter).toUTCString()}<br>
                Vulnerabilities: ${endpoint.details.vulnStatus}
            `;
        } else {
            result += `SSL Labs analysis is still running or unavailable.<br>`;
        }

        // Web Technologies (Wappalyzer)
        const wappalyzerApiUrl = `https://api.wappalyzer.com/v2/lookup/?urls=${url}`;
        const wappalyzerResponse = await fetch(wappalyzerApiUrl, {
            headers: {
                "x-api-key": "YOUR_API_KEY"  // Replace with your Wappalyzer API key
            }
        });
        const wappalyzerData = await wappalyzerResponse.json();

        result += `<br><strong>Web Technologies:</strong><br>`;
        if (wappalyzerData.length > 0) {
            wappalyzerData[0].technologies.forEach(tech => {
                result += `${tech.name} (${tech.category})<br>`;
            });
        } else {
            result += `No technologies detected or analysis failed.<br>`;
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
