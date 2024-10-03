// pages/api/contexts.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Simulated contexts data - This can come from a database, an external API, or be hardcoded.
const availableContexts = [
  'Software Development',
  'Hardware Engineering',
  'AI Research',
  'Cloud Computing',
  'Data Science',
  'Robotics',
  'Cybersecurity'
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET requests
  if (req.method === 'GET') {
    res.status(200).json({ contexts: availableContexts });
  } else {
    // If a method other than GET is used, return a 405 error (Method Not Allowed)
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
