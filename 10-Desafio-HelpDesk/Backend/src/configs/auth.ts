const expiresIn = 1000 * 60 * 60 * 24 * 3

export const authConfig = {
  secret:
    process.env.JWT_SECRET ||
    '1a9dfb409b8d80caff51afccc89d7a71084b8ee049223a955e065826cab32cf2',
  expiresIn,
}
