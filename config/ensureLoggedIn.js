export default (req, res, next) => {
    if (req.user) return next()
    res.status(401).json({ msg: 'Unauthorized You Shall Not Pass' }) // integer
}