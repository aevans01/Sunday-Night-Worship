import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';
function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://www.bible.com/verse-of-the-day');
      const html = await response.text();
      const $ = cheerio.load(html);
      const nextData = JSON.parse($('#__NEXT_DATA__').text());
      setData(nextData);
    };

    fetchData();
  }, []);

  return (
    <div className='center'>
      <Button>Clear Songs</Button><br /><br />
      <Button>View PR</Button><br /><br />
      <Button>View Users</Button><br />

      <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
    </div>
  )
}

export default AdminDashboard;