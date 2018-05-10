import React, {Component} from 'react';

export default class UserMenu extends Component {
  constructor (props) {
    super(props);

    this.onClickOutSide = this.onClickOutSide.bind(this);
  }
  onClickOutSide (event) {
    if (this.ref && !this.ref.contains(event.target)) {
      if (this.props.onClose) {
        this.props.onClose();
      }
      console.log('you click out side');
    }
  }
  componentDidMount () {
    window.addEventListener('mousedown', this.onClickOutSide);
  }
  componentWillUnmount () {
    window.removeEventListener('mousedown', this.onClickOutSide);
  }
  render () {
    const {store} = this.props;
    return (
      <div className='user-menu' ref={(ref) => (this.ref = ref)}>
        <h2>User menu</h2>
        <ul>
          <li className='user-item'>
            <button>My profile</button>
          </li>
          <li className='user-item'>
            <button>Change password</button>
          </li>
          <li className='user-item'>
            <button onClick={() => {
              if (this.props.onClose) {
                this.props.onClose();
              }
              store.signOut();
            }}>Logout</button>
          </li>
        </ul>
      </div>
    );
  }
}
