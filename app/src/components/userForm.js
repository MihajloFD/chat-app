import React, {Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default class UserForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      message: null,
      user: {
        email: '',
        password: ''
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);

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
  onChangeFieldValue (event) {
    let {user} = this.state;
    const field = event.target.name;
    user[field] = event.target.value;
    this.setState({
      user: user
    });
  }
  handleSubmit (event) {
    event.preventDefault();
    const {user} = this.state;
    const {store} = this.props;
    this.setState({
      message: null
    }, () => {
      if (user.email && user.password) {
        store.login(user.email, user.password).then((user) => {
          if (this.props.onClose) {
            this.props.onClose();
          }
          this.setState({
            message: null
          });
          console.log('loogged user', user);
        }).catch((err) => {
          console.log('err', err);
          this.setState({
            message: {
              body: err,
              type: 'error'
            }
          });
        });
      }
    });
  }
  render () {
    const {user, message} = this.state;
    return (
      <div className='user-form' ref={(ref) => (this.ref = ref)}>
        <form onSubmit={this.handleSubmit} method='post'>
          {message ? <p className={classNames('app-message', _.get(message, 'type'))} >{_.get(message, 'body')}</p> : null}
          <div className='form-item'>
            <label>Email</label>
            <input value={_.get(user, 'email')} onChange={this.onChangeFieldValue} type='email' placeholder='Email address...' name='email' />
          </div>
          <div className='form-item'>
            <label>Password</label>
            <input value={_.get(user, 'password')} onChange={this.onChangeFieldValue} type='password' placeholder='Password' name='password' />
          </div>
          <div className='form-actions'>
            <button type='button'>Create an account</button>
            <button className='primary' type='submit'>Sign In</button>
          </div>
        </form>
      </div>
    );
  }
}
