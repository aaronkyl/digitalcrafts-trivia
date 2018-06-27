import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: 'notSelected'
        };
        this.checkAnswer = this.checkAnswer.bind(this);
    }
    
    checkAnswer(e) {
        console.log('checking answer');
        let className = this.props.onClick(this.props.value);
        if (className) {
            this.setState({
                result: className
            });
        }
    }

    render() {
        return <li className={this.state.result} onClick={this.checkAnswer} value={this.props.value} dangerouslySetInnerHTML={{__html: this.props.answer}} />;
    }
}

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: props.question.question,
            answers: props.question.incorrect_answers,
            correctAnswer: props.question.correct_answer,
            answered: false
        };
        this.checkAnswer = this.checkAnswer.bind(this);
    }
    
    componentDidMount() {
        let newAnswerList = [...this.state.answers, this.props.question.correct_answer];
        this.shuffleArray(newAnswerList);
        this.setState({ answers: newAnswerList });
    }
    
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/46161940
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
    }
    
    checkAnswer(answer) {
        if(this.state.answered) {
            return false;
        } else {
            this.setState({
                answered: true
            });
            console.log('selected answer: ', answer);
            let className;
            console.log('correct answer', this.state.correctAnswer);
            if (answer == this.state.correctAnswer) {
                className = 'correctAnswer';
                this.props.increaseScore();
            } else {
                className = 'wrongAnswer';
            }
            return className;
        }
    }
    
    render() {
        let answerList = this.state.answers.map((answer, i) => {
            return <Answer answer={answer} key={i} onClick={this.checkAnswer} value={answer}/>;
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
            questions: [],
            score: 0
        };
        this.listCategory = this.listCategory.bind(this);
        this.submitCategorySelection = this.submitCategorySelection.bind(this);
        this.increaseScore = this.increaseScore.bind(this);
    }
    
    listCategory(cat) {
        return <option key={cat.id} value={cat.id}>{cat.name}</option>;
    }
    
    increaseScore() {
        let newScore = this.state.score + 1;
        this.setState({
            score: newScore
        });
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
        let questionList = this.state.questions.map((ques, i) => {
            return <Question key={i} question={ques} increaseScore={this.increaseScore}/>;
        });
        
        return (
            <div>
                <p>Select a category!</p>
                <select id="categorySelection" onChange={this.props.selectCategory}>
                    {this.props.categories.map(this.listCategory)}
                </select>
                <button onClick={this.submitCategorySelection}>Let's Play!</button>
                <p>Score: {this.state.score}</p>
                <ul>
                    {questionList}
                </ul>
            </div>
        );
    }
}