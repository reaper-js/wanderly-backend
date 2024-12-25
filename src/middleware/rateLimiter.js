import rateLimit from 'express-rate-limit'

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000, 
    message: 'tmrftip',
})


export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many authentication attempts, please try again later'
})

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
    message: 'Too many API requests from this IP, please try again later'
})
