import React, { Component } from 'react';
import axios from 'axios';

export class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    componentDidMount() {
        axios.get("https://opentdb.com/api.php?amount=10&category=" + this.props.playCategory)
        .then(response => {
            this.setState({
               questions: response 
            });
            console.log(this.state.questions);
        })
    }
    
    render() {
        return <p>hi</p>
    }
}