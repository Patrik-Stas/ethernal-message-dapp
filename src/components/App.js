import React from 'react';
import Main from './Main'
import Header from './Header'
import {Container} from 'semantic-ui-react';
import Footer from "./Footer";

const App = () => (
    <div className="App">
        <Container>
            <Header/>
            <Main/>
            <Footer/>
        </Container>
    </div>
);

export default App;
