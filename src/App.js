import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import axios from 'axios';
import './App.css';
import { MainPage } from './components/MainPage.js';
import { Questions } from './components/Questions.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      playCategory: "9"
    };
    this.selectCategory = this.selectCategory.bind(this);
  }
  
  componentDidMount() {
    axios.get('https://opentdb.com/api_category.php')
    .then(response => {
        let fetchedData = response.data.trivia_categories;
        this.setState({
            categories: fetchedData
        });
    })
    .catch(error => console.log(error));
  }
  
  selectCategory(e) {
    this.setState({
        playCategory: e.target.value
    });
  }
  
  render() {
    const history = createBrowserHistory();
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" render={(props) => <MainPage {...props} playCategory={this.state.playCategory} categories={this.state.categories} selectCategory={this.selectCategory} />} />
          <Route path="/questions" render={(props) => <Questions {...props} playCategory={this.state.playCategory} />} />
        </div>
      </Router>
    );
  }
}

export default App;
