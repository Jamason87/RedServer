module.exports = (req, res, next) => {
    res.header('access-control-allow-origin', '*'); // this tells the browser to allow code from any origin.
    res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE'); // Specifies the methods allowed when accessing the resource(or api) in the response preflight request.
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // is used in the response to a preflight request to indicate whch HTTp headers can be used during the actual request
    next();
}