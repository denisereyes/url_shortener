import logo from './logo.svg';
import './App.css';
//added below imports 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min/css';
import form from './components/Form.js';


function App() {
  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className='auth-inner'>
          <Switch>
            <Route exact path="/" component={Form} />
            <Route path = "/app" component={Form} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
