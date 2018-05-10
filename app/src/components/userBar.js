import React, {Component} from 'react';
import _ from 'lodash';
import UserForm from './userForm';
import UserMenu from './userMenu';
export default class UserBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showFrom: false,
      showUserMenu: false
    };
  }
  render () {
    const {store} = this.props;
    const me = store.getCurrentUser();
    const profileImg = _.get(me, 'avatar');
    const avatar = 'https://www.drupal.org/files/issues/default-avatar.png';
    return (
      <div className='user-bar'>
        {!me ? <button
          onClick={() => this.setState({showFrom: true})}
          className='sign-in-button'
          type='button'>
          Sign in</button> : null}
        <div className='profile-name'>{_.get(me, 'name')}</div>
        <div onClick={() => this.setState({showUserMenu: true})} className='profile-image'> <img src={profileImg || avatar} alt='' /></div>
        {!me && this.state.showFrom
          ? <UserForm
            onClose={() => {
              this.setState({
                showFrom: false
              });
            }}
            store={store} /> : null}
        {this.state.showUserMenu
          ? <UserMenu
            onClose={() => {
              this.setState({
                showUserMenu: false
              });
            }}
            store={store}
          /> : null}
      </div>
    );
  }
}
