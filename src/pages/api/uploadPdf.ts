import { NextApiRequest, NextApiResponse } from "next";

// Helper function to log form data
const logFormData = (data: any) => {
  console.log("Form Data Received:", data);
};

// API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const formData = req.body;
      logFormData(formData);

      // Make a POST request to the Flask API
      const flaskApiUrl = "http://ec2-3-222-101-98.compute-1.amazonaws.com:8000/embed"; // Replace with your Flask API URL

      const flaskResponse = await fetch(flaskApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data as the payload to Flask API
      });

      const flaskResponseData = await flaskResponse.json();

      if (flaskResponse.ok) {
        // Forward Flask API response back to the client
        res.status(200).json(flaskResponseData);
      } else {
        res
          .status(flaskResponse.status)
          .json({ error: flaskResponseData.error || "Error from Flask API" });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
