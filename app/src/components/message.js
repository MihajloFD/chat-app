import React, {Component} from 'react';
let avatar = 'https://www.drupal.org/files/issues/default-avatar.png';

export default class Message extends Component {
  constructor (props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      messages: []
    };
    this.addTestMessage = this.addTestMessage.bind(this);
    this._onResize = this._onResize.bind(this);
  }
  _onResize () {
    this.setState({height: window.innerHeight});
    console.log('resizing is in prosecc');
  }
  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this.addTestMessage();
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
  }
  addTestMessage () {
    let {messages} = this.state;

    for (let i = 0; i < 100; i++) {
      let isMe = false;
      if (i % 3 === 0) {
        isMe = true;
      };
      const newMsg = {
        author: `Author: ${i}`,
        body: `The body of message ${i}`,
        avatar: avatar,
        me: isMe
      };
      messages.push(newMsg);
    }
    this.setState({messages: messages});
  }
  render () {
    const {height, messages} = this.state;
    const style = {
      height: height
    };
    return (
      <div style={style} className='app-massenger'>
        <div className='header'>
          <div className='left' >
            <div className='actions'>
              <button>New message</button>

            </div>
          </div>
          <div className='content'>
            <h2>Title</h2>
          </div>
          <div className='right'>
            <div className='user-bar'>
              <div className='profile-name'>miki</div>
              <div className='profile-image'> <img src={avatar} alt='' /></div>
            </div>
          </div>
        </div>
        <div className='main' >
          <div className='left-sidebar'>
            <div className='chanels'>
              <div className='chanel'>
                <div className='user-image'>
                  <img src={avatar} alt='' />
                </div>
                <div className='chanel-info'>
                  <h2>kikiriki</h2>
                  <p>hellooo there</p>
                </div>
              </div>
            </div>
          </div>
          <div className='content'>
            <div className='messages'>
              {messages.map((message, index) => {
                return (
                  <div key={index} className={message.me ? 'message me' : 'message'} >
                    <div className='message-user-image'>
                      <img src={message.avatar} alt='' />
                    </div>
                    <div className='message-body'>
                      <div className='message-author'>{message.me ? 'ja kazem' : message.author}</div>
                      <div className='message-text'>
                        <p>{message.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='message-input'>
              <div className='text-input'>
                <textarea placeholder='Write your message' />
              </div>
              <div className='actions'>
                <button className='send'>
                  Send
                </button>
              </div>
            </div>
          </div>
          <div className='right-sidebar' >
            <h2 className='title'>Members</h2>
            <div className='members' >
              <div className='member'>
                <div className='user-image'>
                  <img src={avatar} alt='' />
                </div>
                <div className='member-info'>
                  <h2>kikiriki</h2>
                  <p>hellooo there</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
