import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'supersecret'

export function signToken(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export function verifyToken(token: string): any | null {
    try {
        return jwt.verify(token, SECRET)
    } catch {
        return null
    }
}
