import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Answer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <li>{this.props.answer}</li>;
    }
}

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: props.question.question,
            answers: props.question.incorrect_answers,
            correctAnswer: props.question.correct_answer
        };
    }
    
    componentDidMount() {
        this.setState({ answers: [...this.state.answers, this.props.question.correct_answer] });
    }
    
    render() {
        let answerList = this.state.answers.map(answer => {
            return <Answer answer={answer} />;
        });
        return (
            <div>
            <li dangerouslySetInnerHTML={{__html: this.state.question}} />
            <ul>
                {answerList}
            </ul>
            </div>
        );
    }
}

export class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: []
        };
        this.listCategory = this.listCategory.bind(this);
        this.submitCategorySelection = this.submitCategorySelection.bind(this);
    }
    
    listCategory(cat) {
        return <option key={cat.id} value={cat.id}>{cat.name}</option>;
    }
    
    submitCategorySelection() {
        console.log("https://opentdb.com/api.php?amount=10&category=" + this.props.playCategory);
        axios.get("https://opentdb.com/api.php?amount=10&category=" + this.props.playCategory)
        .then(response => {
            console.log(response.data.results);
            return response.data.results;
        })
        .then(rawData => {
            this.setState({
                questions: rawData
            });
        })
        .catch(error => console.log(error));
    }
    
    render() {
        let questionList = this.state.questions.map((ques) => {
            return <Question question={ques} />;
        });
        
        return (
            <div>
                <p>Select a category!</p>
                <select id="categorySelection" onChange={this.props.selectCategory}>
                    {this.props.categories.map(this.listCategory)}
                </select>
                <button onClick={this.submitCategorySelection}>Let's Play!</button>
                <ul>
                    {questionList}
                </ul>
            </div>
        );
    }
}