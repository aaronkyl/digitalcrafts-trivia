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
        let className = this.props.onClick(this.props.value);
        if (className) {
            this.setState({
                result: className
            });
        }
    }

    render() {
        return <li className={['answer-choice', this.state.result].join(' ')} onClick={this.checkAnswer} value={this.props.value} dangerouslySetInnerHTML={{__html: '<span className="answer-text">' + this.props.answer + '</span>'}} />;
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
    
    //split this into smaller functions
    checkAnswer(answer) {
        if(this.state.answered) {
            return false;
        }
        
        this.setState({
            answered: true
        });
        let className;
        if (answer === this.state.correctAnswer) {
            className = 'correctAnswer';
            this.props.increaseScore();
        } else {
            className = 'wrongAnswer';
        }
        setTimeout(this.props.nextQuestion.bind(this),1000);
        return className;
    }
    
    render() {
        let answerList = this.state.answers.map((answer, i) => {
            return <Answer answer={answer} key={i} onClick={this.checkAnswer} value={answer}/>;
        });
        
        return (
            <div className="question-div">
            <li className="question-text" dangerouslySetInnerHTML={{__html: this.state.question}} />
            <ul className="answer-list-div">
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
            round: 1,
            score: 0
        };
        this.listCategory = this.listCategory.bind(this);
        this.submitCategorySelection = this.submitCategorySelection.bind(this);
        this.increaseScore = this.increaseScore.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
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
    
    nextQuestion() {
        let newRound = this.state.round + 1;
        this.setState({
            round: newRound
        });
    }
    
    submitCategorySelection() {
        axios.get("https://opentdb.com/api.php?amount=10&category=" + this.props.playCategory)
        .then(response => {
            this.setState({
                questions: []
            });
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
        let questions = this.state.questions.map((ques, i) => {
            return <Question key={i} question={ques} increaseScore={this.increaseScore} nextQuestion={this.nextQuestion}/>;
        });

        let questionList = questions.slice(this.state.round - 1, this.state.round);
        
        let categories;
        if (this.props.categories) {
            categories = this.props.categories.map(this.listCategory);
        } else {
            categories = 'pending';
        }
        
        return (
            <div id="game-div">
                <h1>AKW TRIVIA</h1>
                <h2>It's trivia time, y'all!</h2>
                <p>Select a category to begin...</p>
                <select id="categorySelection" onChange={this.props.selectCategory}>
                    {categories}
                </select>
                <button onClick={this.submitCategorySelection}>Let's Play!</button>
                <p>Score: {this.state.score}</p>
                <ul className="question-list-ul">
                    {questionList}
                </ul>
            </div>
        );
    }
}