import { React, useState } from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../styles/appbar';
import { Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';

export default function Store() {
    const mockData = [
        { category: 'albums', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/100x100bb.jpg', name: 'Flower Boy', price: '15' },
        { category: 'albums', image: '/download.jpg', name: '2014 Forest Hills Drive', price: '50' },
        { category: 'albums', image: '/truck.png', name: 'Truck', price: '99' },
        { category: 'songs', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/100x100bb.jpg', name: 'Flower Boy', price: '15' },
        { category: 'songs', image: '/download.jpg', name: '2014 Forest Hills Drive', price: '50' },
        { category: 'podcasts', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/100x100bb.jpg', name: 'Flower Boy', price: '15' },
        { category: 'audiobooks', image: '/download.jpg', name: '2014 Forest Hills Drive', price: '50' },
        { category: 'audiobooks', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/100x100bb.jpg', name: 'Flower Boy', price: '15' },
        { category: 'movies', image: '/download.jpg', name: '2014 Forest Hills Drive', price: '50' },
        { category: 'ebooks', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/100x100bb.jpg', name: 'Flower Boy', price: '15' },
    ];
    const [category, setCategory] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [userPoints, setUserPoints] = useState(1000);

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);
        const newData = mockData.filter(item => item.category === selectedCategory);
        setFilteredData(newData);
    };

    const headerStyle = {
        textAlign: 'center',
        fontSize: '50px',
        fontWeight: 'bold',
        margin: '20px 0',
    };

    return (
        <>
            <Head>
                <title>Store</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header style={headerStyle}>Store</header>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" m={2}>
                <Typography variant="h5" gutterBottom>
                    Points Available: {userPoints}
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 300, maxWidth: 300 }}>
                    <InputLabel id="category-select-label" style={{ fontSize: '20px' }}>Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={category}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="albums">Albums</MenuItem>
                        <MenuItem value="songs">Songs</MenuItem>
                        <MenuItem value="podcasts">Podcasts</MenuItem>
                        <MenuItem value="audiobooks">Audiobooks</MenuItem>
                        <MenuItem value="movies">Movies</MenuItem>
                        <MenuItem value="ebooks">Ebooks</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid container spacing={2} sx={{ p: 2 }}>
                {filteredData.map((item, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: 250,
                                    objectFit: 'contain',
                                    margin: 'auto'
                                }}
                                image={item.image}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    Points: {item.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">Buy</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );

}
