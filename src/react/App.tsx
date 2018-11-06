import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from './Game';

class App extends React.Component {
  render() {
    return (
      <div style={{padding: "15px"}}>
        <Game />
      </div>
    );  
  }
}

export default App;

ReactDOM.render(
  <App />,
  document.querySelector('.content')
);