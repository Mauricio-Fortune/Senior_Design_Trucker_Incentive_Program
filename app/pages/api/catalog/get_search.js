// search iTunes API

export default async function handler(req, res) {
  try {
    // Destructure term and entity from the request body
    const {term, entity,limit} = req.body;

    // Encode the term to ensure the URL is correctly formatted, especially for terms with spaces
    const encodedTerm = encodeURIComponent(term);

    // Correctly construct the URL with template literals to include term and entity in the query
    const url = `https://itunes.apple.com/search?term=${encodedTerm}&${entity}&${limit}&country=US`;
    
    // Fetch data from the iTunes API
    const response = await fetch(url);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }

    // Parse the JSON response
    const data = await response.json();

    // Respond with the iTunes search results
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching iTunes API:', error);
    // Provide a more generic error message to the client
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
