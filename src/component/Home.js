import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';
import Notes from './Notes';
const Home = () => {
    // const context = useContext(noteContext)
    // const { notes, SetNotes } = context;
    return (
        <div >
            <Notes />

        </div>
    )
}

export default Home