import {OrderedMap} from 'immutable';
import _ from 'lodash';

const users = OrderedMap({
  '1': {_id: '1', email: 'miki@gmail.com', name: 'Mihajlo Govedarica', created: new Date(), avatar: 'https://api.adorable.io/avatars/100/abott@miki.png'},
  '2': {_id: '2', email: 'gogo@gmail.com', name: 'Gogo Simic', created: new Date(), avatar: 'https://api.adorable.io/avatars/100/abott@gogo.png'},
  '3': {_id: '3', email: 'denis@gmail.com', name: 'Denis Coric', created: new Date(), avatar: 'https://api.adorable.io/avatars/100/abott@denis.png'}
});

export default class Store {
  constructor (appComponent) {
    this.app = appComponent;
    this.messages = new OrderedMap();
    this.channels = new OrderedMap();
    this.activeChannalId = null;
    this.user = this.getUserFromLocalstorage();
  }
  signOut () {
    this.user = null;
    localStorage.removeItem('me');
    this.update();
  }
  getUserFromLocalstorage () {
    let user = null;
    const data = localStorage.getItem('me');
    console.log('User from local storage ', data);
    try {
      if (data) {
        user = JSON.parse(data);
      }
    } catch (err) {
      console.log(err);
    };
    return user;
  }
  setCurrentUser (user) {
    this.user = user;
    if (user) {
      localStorage.setItem('me', JSON.stringify(user));
    }
    this.update();
  }
  login (email, password) {
    const userEmail = _.toLower(email);
    return new Promise((resolve, reject) => {
      const user = users.find((user) => user.email === userEmail);
      if (user) {
        this.setCurrentUser(user);
      }
      return user ? resolve(user) : reject('user in not found');
    });
  }
  addUserToChannel (userId, channelId) {
    // console.log('adding users', userId, channelId);
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.members = channel.members.set(userId, true);
      this.channels = this.channels.set(channelId, channel);
      this.update();
    }
  }
  searchUser (search = '') {
    let searchItem = new OrderedMap();
    let keyword = _.toLower(search);
    const currentUser = this.getCurrentUser();
    const currentUserId = _.get(currentUser, '_id');
    if (_.trim(keyword).length) {
      // searchItem = users.filter((user) => _.get(user, '_id') !== currentUserId && _.includes(_.get(user, 'name')), keyword);
      searchItem = users.filter((user) => _.get(user, '_id') !== currentUserId && _.includes(_.toLower(_.get(user, 'name')), keyword));
    }
    return searchItem.valueSeq();
  }
  getCurrentUser () {
    return this.user;
  }
  setActiveChannel (activeChannalId) {
    this.activeChannalId = activeChannalId;
    this.update();
  }
  getActiveChannel () {
    const channel = this.activeChannalId ? this.channels.get(this.activeChannalId) : this.channels.first();
    return channel;
  }
  getMessagesFromChannel (channel) {
    let messages = new OrderedMap();
    if (channel) {
      channel.messages.forEach((value, key) => {
        const message = this.messages.get(key);
        messages = messages.set(key, message);
      });
    }
    return messages.valueSeq();
  }
  getMembersFromChanel (channel) {
    let members = new OrderedMap();
    if (channel) {
      channel.members.forEach((value, key) => {
        const member = users.get(key);
        const loggedUser = this.getCurrentUser();
        if (_.get(loggedUser, '_id') !== _.get(member, '_id')) {
          members = members.set(key, member);
        }
      });
    }
    return members.valueSeq();
  }
  getMessages () {
    return this.messages.valueSeq();
  }
  addMessages (id, message = {}) {
    const user = this.getCurrentUser();
    message.user = user;

    this.messages = this.messages.set(`${id}`, message);

    const channelId = _.get(message, 'channelId');
    if (channelId) {
      let channel = this.channels.get(channelId);
      channel.isNew = false;
      channel.lastMassage = _.get(message, 'body', '');
      channel.messages = channel.messages.set(id, true);
      this.channels = this.channels.set(channelId, channel);
    }
    // console.log('poruke', (JSON.stringify(this.messages.toJS())));
    this.update();
  }
  removeMemberFromChannel (activeChannal = null, user = null) {
    if (!activeChannal || !user) {
      return;
    }
    const userId = _.get(user, '_id');
    const channelId = _.get(activeChannal, '_id');
    activeChannal.members = activeChannal.members.remove(userId);
    this.channels = this.channels.set(channelId, activeChannal);
    this.update();
  }
  onCreateNewChannel (channel = {}) {
    console.log('new channel', channel);
    const channelId = _.get(channel, '_id');
    this.addChaneles(channelId, channel);
    this.setActiveChannel(channelId);

    // console.log('kanali', (JSON.stringify(this.channels.toJS())));
  }
  getChaneles () {
    this.channels = this.channels.sort((a, b) => a.created < b.created);
    return this.channels.valueSeq();
  }
  addChaneles (index, channel = {}) {
    this.channels = this.channels.set(`${index}`, channel);
    this.update();
  }
  update () {
    this.app.forceUpdate();
  }
}
