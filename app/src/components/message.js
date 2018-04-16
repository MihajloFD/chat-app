import React, {Component} from 'react';
import {OrderedMap} from 'immutable';
import {ObjectID} from '../helper/objectid';
import _ from 'lodash';
import moment from 'moment';
import SearchUser from './searchUser';
let avatar = 'https://www.drupal.org/files/issues/default-avatar.png';
export default class Message extends Component {
  constructor (props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      newMessage: 'Hello there...',
      searchUser: '',
      showUserSearch: false
    };
    this._onResize = this._onResize.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.scrollToBottomMessage = this.scrollToBottomMessage.bind(this);
    this._onCreateChannel = this._onCreateChannel.bind(this);
    this.renderChannelTitle = this.renderChannelTitle.bind(this);
  }
  renderChannelTitle (channel) {
    const {store} = this.props;
    const members = store.getMembersFromChanel(channel);
    const names = [];
    members.forEach((user) => {
      const name = _.get(user, 'name');
      names.push(name);
    });
    console.log('imena ', names);
    return <h2>{_.join(names, ',')}</h2>;
  }
  _onCreateChannel () {
    const {store} = this.props;
    const channelId = new ObjectID().toString();
    const channel = {
      _id: channelId,
      title: 'New Message',
      lastMassage: '',
      members: new OrderedMap(),
      messages: new OrderedMap(),
      created: new Date(),
      isNew: true
    };
    store.onCreateNewChannel(channel);
  }
  scrollToBottomMessage () {
    if (this.messagesRef) {
      this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
    }
  }
  renderMessage (message) {
    const text = _.get(message, 'body', '');
    const html = _.split(text, '\n').map((m, key) => {
      return <p key={key} dangerouslySetInnerHTML={{__html: m}} />;
    });
    return html;
  }
  _onResize () {
    this.setState({height: window.innerHeight});
  }
  handleSend () {
    const {newMessage} = this.state;
    const {store} = this.props;
    if (_.trim(newMessage).length === 0) {
      return;
    }
    const messageID = new ObjectID().toString();
    const channel = store.getActiveChannel();
    const channelId = _.get(channel, '_id', null);
    const currentUser = store.getCurrentUser();

    const message = {
      _id: messageID,
      channelId: channelId,
      body: newMessage,
      author: _.get(currentUser, 'name', null),
      avatar: avatar,
      me: true
    };
    console.log('new message object ', message);
    store.addMessages(messageID, message);
    this.setState({newMessage: ''});
  }
  componentDidUpdate () {
    this.scrollToBottomMessage();
  }
  componentDidMount () {
    window.addEventListener('resize', this._onResize);
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
  }
  render () {
    const {height, searchUser, showUserSearch} = this.state;
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
            <button className='left-action'>
              <i className='icon-settings-streamline-1' />
            </button>
            <button onClick={this._onCreateChannel} className='right-action'>
              <i className='icon-paperplane' />
            </button>
            <h2>Messenger</h2>
          </div>
          <div className='content'>
            {_.get(activeChannel, 'isNew') ? <div className='toolbar'>
              <label>To:</label>
              <input
                placeholder='Type name of person...'
                value={searchUser}
                onChange={(e) => {
                  const textSearchUser = _.get(e, 'target.value');
                  this.setState({
                    searchUser: textSearchUser,
                    showUserSearch: true
                  });
                }}
              />
              {showUserSearch ? <SearchUser
                onSelect={(user) => {
                  // console.log('idemo', user.name);
                  this.setState({
                    showUserSearch: false,
                    searchUser: ''
                  }, () => {
                    const userId = _.get(user, '_id');
                    const channelId = _.get(activeChannel, '_id');
                    store.addUserToChannel(userId, channelId);
                  });
                }}
                search={searchUser} store={store} /> : null}
            </div> : <h2>{_.get(activeChannel, 'title', '')}</h2>}
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
                  <div key={index}
                    onClick={() => {
                      store.setActiveChannel(channel._id);
                    }}
                    className={_.get(activeChannel, '_id') === _.get(channel, '_id') ? 'active chanel' : 'chanel'}>
                    <div className='user-image'>
                      <img src={avatar} alt='' />
                    </div>
                    <div className='chanel-info'>
                      {this.renderChannelTitle(channel)}
                      <p>{channel.lastMassage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='content'>
            <div ref={(ref) => (this.messagesRef = ref)} className='messages'>
              {messages.map((message, index) => {
                return (
                  <div key={index} className={message.me ? 'message me' : 'message'} >
                    <div className='message-user-image'>
                      <img src={message.avatar} alt='' />
                    </div>
                    <div className='message-body'>
                      <div className='message-author'>{message.me ? 'ja kazem' : message.author}</div>
                      <div className='message-text'>
                        {this.renderMessage(message)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='message-input'>
              <div className='text-input'>
                <textarea
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      this.handleSend();
                    }
                  }}
                  onChange={(e) => this.setState({newMessage: e.target.value})}
                  value={this.state.newMessage}
                  placeholder='Write new message' />
              </div>
              <div className='actions'>
                <button onClick={this.handleSend} className='send'>
                  Send
                </button>
              </div>
            </div>
          </div>
          <div className='right-sidebar' >
            {members.size > 0
              ? <div>
                <h2 className='title'>Members</h2>
                <div className='members' >
                  {members.map((member, key) => {
                    return (
                      <div key={key} className='member'>
                        <div className='user-image'>
                          <img src={_.get(member, 'avatar')} alt='' />
                        </div>
                        <div className='member-info'>
                          <h2>{member.name}</h2>
                          <p>Joined: {moment(member.created).fromNow()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div> : null}
          </div>
        </div>
      </div>
    );
  }
}
