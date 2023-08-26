const notFoundMiddleware = (req, res) => {
    return res.status(404).json({msg: 'Route does not exist'})
}

export default notFoundMiddleware