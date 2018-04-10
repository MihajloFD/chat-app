import React, {Component} from 'react';
import {OrderedMap} from 'immutable';
// import _ from 'lodash';
let avatar = 'https://www.drupal.org/files/issues/default-avatar.png';
export default class Message extends Component {
  constructor (props) {
    super(props);
    this.state = {
      height: window.innerHeight
    };
    this.addTestMessage = this.addTestMessage.bind(this);
    this._onResize = this._onResize.bind(this);
  }
  _onResize () {
    this.setState({height: window.innerHeight});
  }
  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this.addTestMessage();
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
  }
  addTestMessage () {
    const {store} = this.props;
    for (let i = 0; i < 100; i++) {
      let isMe = false;
      if (i % 3 === 0) {
        isMe = true;
      };
      const newMsg = {
        _id: i,
        author: `Author: ${i}`,
        body: `The body of message ${i}`,
        avatar: avatar,
        me: isMe
      };
      // console.log(typeof i);
      store.addMessages(i, newMsg);
    }
    for (let j = 0; j < 10; j++) {
      const newChannel = {
        _id: j,
        title: `Channel title${j}`,
        lastMassage: `last ${j}`,
        members: new OrderedMap({
          1: true,
          3: true
        }),
        messages: new OrderedMap()
      };
      newChannel.messages = newChannel.messages.set(j, true);
      store.addChaneles(j, newChannel);
    }
  }
  render () {
    const {height} = this.state;
    const style = {
      height: height
    };
    const {store} = this.props;
    const activeChannel = store.getActiveChannel();
    const messages = store.getMessagesFromChannel(activeChannel);
    const channels = store.getChaneles();
    const members = store.getMembersFromChanel(activeChannel);
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
              {channels.map((channel, index) => {
                return (
                  <div key={index} onClick={() => {
                    store.setActiveChannel(channel._id);
                  }} className='chanel'>
                    <div className='user-image'>
                      <img src={avatar} alt='' />
                    </div>
                    <div className='chanel-info'>
                      <h2>{channel.title}</h2>
                      <p>{channel.lastMassage}</p>
                    </div>
                  </div>
                );
              })}
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
              {members.map((member, key) => {
                return (
                  <div key={key} className='member'>
                    <div className='user-image'>
                      <img src={avatar} alt='' />
                    </div>
                    <div className='member-info'>
                      <h2>{member.name}</h2>
                      <p>hellooo there</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
