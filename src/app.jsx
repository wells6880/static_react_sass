import React from 'react';
import flag from '@/assets/img/flag.png'
import './app.scss';

export default function() {

    return (
        <div className="app">
            <div className="app-title">Hello</div>
            <img src={flag} alt=""/>
        </div>
    )
}