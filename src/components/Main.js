import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './Home'
import History from './History'

const Main = () => (
    <main>
        <Switch>
            <Route path='/messages/:id' component={Home}/>
            <Route exact path='/history' component={History}/>
            <Route exact path='/top' component={Home}/>
            <Route exact path='/' component={Home}/>
        </Switch>
    </main>
);

export default Main
