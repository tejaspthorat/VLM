import { NextApiRequest, NextApiResponse } from 'next'

// Helper function to log form data
const logFormData = (data: any) => {
  console.log('Form Data Received:', data)
}

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Parse the incoming form data from the request body
      const formData = req.body

      // Log the form data to the console
      logFormData(formData)

      // Respond with success
      res.status(200).json({ message: 'Form data logged successfully!' })
    } catch (error) {
      console.error('Error processing request:', error)
      res.status(500).json({ error: 'Error processing request' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
