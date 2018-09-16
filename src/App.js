import './styles/App.css';
import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { FocusStyleManager } from "@blueprintjs/core";
import Home from './containers/Home';
import withSizes from 'react-sizes';

FocusStyleManager.onlyShowFocusOnTabs();

class App extends Component {
  render () {
    const { windowHeight } = this.props;
    return (
      <Router>
        <div className="App" style={{ minHeight: windowHeight }}>
          <Route exact path="/" component={Home} />
        </div>
      </Router>
    );
  }
}

const mapSizesToProps = ({ height }) => ({
  windowHeight: height
});

export default withSizes(mapSizesToProps)(App)
