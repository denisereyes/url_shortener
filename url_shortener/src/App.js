//import logo from './logo.svg';
import './App.css';
//added below imports 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Form from './components/Form.js';

function App() {
  return (
     <BrowserRouter>
      <div className="App">    
          <div className="auth-wrapper">
            <div className='auth-inner'>
              <Routes>
                <Route exact path="/" Component={Form} />
                <Route path = "/app" Component={Form} />
              </Routes>
            </div>
          </div>           
        </div>
      </BrowserRouter>
  );
}

export default App;
