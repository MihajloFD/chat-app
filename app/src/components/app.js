import React, {Component} from 'react';
import Store from '../store';

import Message from './message';
export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      store: new Store(this)
    };
  }
  render () {
    const {store} = this.state;
    return (
      <div className='app-wraper'>
        <Message store={store} />
      </div>
    );
  }
}
