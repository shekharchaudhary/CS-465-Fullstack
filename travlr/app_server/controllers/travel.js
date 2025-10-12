const http = require('http');
const https = require('https');

const getJson = (url, headers = {}) => new Promise((resolve, reject) => {
    try {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, { headers }, (resp) => {
            const { statusCode } = resp;
            const contentType = resp.headers['content-type'] || '';

            if (statusCode < 200 || statusCode >= 300) {
                // Drain data before rejecting to avoid socket hang up
                resp.resume();
                return reject(new Error(`API request failed: ${statusCode}`));
            }
            if (!/application\/json/i.test(contentType)) {
                // Non-JSON still attempt to read for debugging
                // but reject as unexpected content
            }
            let raw = '';
            resp.setEncoding('utf8');
            resp.on('data', chunk => raw += chunk);
            resp.on('end', () => {
                try {
                    const parsed = JSON.parse(raw);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error('Invalid JSON from API'));
                }
            });
        });
        req.on('error', reject);
    } catch (e) {
        reject(e);
    }
});

const travel = (req, res) => {
    const apiPath = '/api/trips';
    const url = `${req.protocol}://${req.get('host')}${apiPath}`;

    getJson(url, { 'Accept': 'application/json' })
        .then(json => {
            res.render('travel', { title: 'Travlr Getaways', trips: json });
        })
        .catch(err => {
            res.status(500).render('travel', { title: 'Travlr Getaways', trips: [], error: err.message });
        });
};

module.exports = {
    travel
};
