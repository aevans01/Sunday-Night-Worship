import React, { useEffect, useState } from 'react';

// Sample list of verses (fallback if no API is used)
const verses = [
    { reference: "John 3:16", text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life." },
    { reference: "Philippians 4:13", text: "I can do all things through Christ who strengthens me." },
    { reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
    { reference: "Romans 8:28", text: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose." },
];

const DailyBibleVerse = () => {
    const [verse, setVerse] = useState(null);

    useEffect(() => {
        // Function to fetch a daily verse
        const fetchVerse = async () => {
            try {
                // Uncomment and use this if you have an API endpoint for Bible verses
                const response = await fetch('https://www.bible.com/${language}/verse-of-the-day');
                const data = await response.json();
                setVerse({ text: data.text, reference: data.reference });

                // Fallback to random verse if no API
                // const todayIndex = new Date().getDate() % verses.length; // Rotate through verses by day
                // setVerse(verses[todayIndex]);
            } catch (error) {
                console.error("Error fetching the verse:", error);
                setVerse(verses[3]); // Fallback to the first verse
            }
        };

        fetchVerse();
    }, []);

    if (!verse) return <div>Loading...</div>;

    return (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Daily Bible Verse</h2>
            <p style={{ fontStyle: 'italic', fontSize: '1.5em' }}>{`"${verse.text}"`}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{`- ${verse.reference}`}</p>
        </div>
    );
};

export default DailyBibleVerse;
