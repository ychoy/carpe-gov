function index(req, res) {
    res.json({
        message: "CarpeGov",
        documentation_url: "https://github.com/ychoy/carpe-gov",
        base_url: "localhost:3000",
        endpoints: [
        {
          method: "GET",
          path: "/api",
          description: "Describes available endpoints"
        }
        ]
    });
}

module.exports = {
    index: index
}
