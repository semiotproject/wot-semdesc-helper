"use strict";

import React from 'react';
import { Component } from 'react';
import { RouteHandler } from 'react-router';
import Navigation from './nav.react';

export default class ClassView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="main-wrapper">
                <div id="nav">
                    <Navigation></Navigation>
                </div>
                <div id="app-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }
}