const travel = (req, res) => {
    const apiPath = '/api/trips';
    const url = `${req.protocol}://${req.get('host')}${apiPath}`;

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    };

    // Fetch the trips from our API and render the view
    fetch(url, options)
        .then(apiRes => {
            if (!apiRes.ok) throw new Error(`API request failed: ${apiRes.status}`);
            return apiRes.json();
        })
        .then(json => {
            // console.log(json);
            res.render('travel', { title: 'Travlr Getaways', trips: json });
        })
        .catch(err => res.status(500).send(err.message));
};

module.exports = {
    travel
};
