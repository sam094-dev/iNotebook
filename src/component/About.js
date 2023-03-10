import React from 'react'
import { useContext } from 'react'
import noteContext from '../context/notes/noteContext';
const About = () => {
    const a = useContext(noteContext);
    return (
        <div>this is {a.name}</div>
    )
}

export default About