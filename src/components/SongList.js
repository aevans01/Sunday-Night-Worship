import Axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


function SongList() {
    const [songs, setSongs] = useState();

    useEffect(() => {
        Axios.get(`https://hhbc-snw-api.netlify.app/api/getSongs`)
            .then((response) => {
                console.log("test")
                if (response.data) {
                    setSongs(response.data)
                    console.log(response.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    function deleteSong(id) {
        Axios.delete(
            'https://hhbc-snw-api.netlify.app/api/deleteSong',
            {
                data: { id }
            }
        )
            .then(() => {
                setSongs(songs.filter(song => song.id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <>
            <Table id='songListTable' striped bordered hover>
                <tr key={"header"}>
                    <th></th>
                    <th>Title</th>
                </tr>
                {songs.map((item) => (
                    <tr key={item.id}>
                        <td><Button onClick={() => deleteSong(item.id)}>Delete</Button></td>
                        <td>{item.VideoTitle}</td>
                    </tr>
                ))}
            </Table>
        </>
    )
}

export default SongList;