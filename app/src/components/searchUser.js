import React, {Component} from 'react';
import _ from 'lodash';
export default class SearchUser extends Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick (user) {
    if (this.props.onSelect) {
      this.props.onSelect(user);
    }
  }
  render () {
    const {store, search} = this.props;
    const users = store.searchUser(search);
    return (
      <div className='search-user'>
        <div className='user-list'>
          {users.map((value, index) => {
            return (
              <div key={index} onClick={() => this.handleClick(value)} className='user'>
                <img src={_.get(value, 'avatar')} alt='' />
                <h2>{_.get(value, 'name')}</h2>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
