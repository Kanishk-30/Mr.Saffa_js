export default function handler(req, res) {
  res.json({
    EMAIL_USER_exists: !!process.env.EMAIL_USER,
    EMAIL_USER_value: process.env.EMAIL_USER,
    EMAIL_PASS_exists: !!process.env.EMAIL_PASS,
    EMAIL_PASS_length: process.env.EMAIL_PASS?.length,
    EMAIL_PASS_first4: process.env.EMAIL_PASS?.substring(0, 4),
    all_env_keys: Object.keys(process.env).filter(key => key.includes('EMAIL'))
  });
}
