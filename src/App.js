import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useParams} from 'react-router-dom';

function HomePage() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
            .then(response => response.json())
            .then(storyIds => {
                const limitedStoryIds = storyIds.slice(0, 100);
                const promises = limitedStoryIds.map(id =>
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
                );
                Promise.all(promises).then(stories => {
                    setNews(stories);
                });
            });
    }, []);

    return (
        <div>
            <h1>Hacker News</h1>
            <ul>
                {news.map(story => (
                    <li key={story.id}>
                        <Link to={`/story/${story.id}`}>{story.title}</Link> - {story.score} points by {story.by} on {new Date(story.time * 1000).toLocaleString()}
                    </li>
                ))}
            </ul>
            <button onClick={() => window.location.reload(false)}>Refresh</button>
        </div>
    );
}

function StoryPage({ match }) {
    const { id } = useParams();
    const [story, setStory] = useState(null);

    useEffect(() => {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => response.json())
            .then(story => {
                setStory(story);
            });
    }, [id]);

    if (!story) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{story.title}</h2>
            <p>Author: {story.by}</p>
            <p>Date: {new Date(story.time * 1000).toLocaleString()}</p>
            <p>Number of Comments: {story.descendants}</p>
            <a href={story.url}>Read More</a>
            <br />
            <Link to="/">Back to News List</Link>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/story/:id" element={<StoryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

