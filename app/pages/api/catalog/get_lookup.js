export default async function handler(req, res) {
    try {
      // Destructure item_ID from the request query
      const { item_ID } = req.query;
  
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
  
      const response = await fetch(`https://itunes.apple.com/lookup?id=${item_ID}`, requestOptions);
      
      if (!response.ok) 
        throw new Error('Failed to fetch item data');
      
      const data = await response.json();
      
      // Ensure there's data in the response before attempting to access it
      if (data.results.length > 0) {
        res.status(200).json(data.results[0]);
      } else {
        // Handle the case where no data is returned
        res.status(404).json({ message: 'No data found' });
      }
      
    } catch (error) {
      console.error('Error fetching iTunes API:', error);
      // Provide a more generic error message to the client
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  