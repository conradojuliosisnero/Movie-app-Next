export async function handler(req, res) {
  // Check if the user is authenticated
  if (req.session.user) {
    // If the user is authenticated, return a 200 status code
    res.status(200).json({ authenticated: true });
  } else {
    // If the user is not authenticated, return a 401 status code
    res.status(401).json({ authenticated: false });
  }
}