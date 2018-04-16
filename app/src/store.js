import {OrderedMap} from 'immutable';
import _ from 'lodash';

const users = OrderedMap({
  '1': {_id: '1', name: 'Miki Govedarica', created: new Date(), avatar: 'https://api.adorable.io/avatars/100/abott@miki.png'},
  '2': {_id: '2', name: 'Gogo Simic', created: new Date(), avatar: 'https://api.adorable.io/avatars/100/abott@gogo.png'},
  '3': {_id: '3', name: 'Denis Coric', created: new Date(), avatar: 'https://api.adorable.io/avatars/100/abott@denis.png'}
});

export default class Store {
  constructor (appComponent) {
    this.app = appComponent;
    this.messages = new OrderedMap();
    this.channels = new OrderedMap();
    this.activeChannalId = null;
    this.user = {
      _id: '1',
      name: 'Miki',
      created: new Date()
    };
  }
  addUserToChannel (userId, channelId) {
    console.log('adding users', userId, channelId);
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.members = channel.members.set(userId, true);
      this.channels = this.channels.set(channelId, channel);
      this.update();
    }
  }
  searchUser (search = '') {
    let searchItem = new OrderedMap();
    if (_.trim(search).length) {
      users.filter((user) => {
        const name = _.get(user, 'name');
        const userId = _.get(user, '_id');
        const loggedUser = this.getCurrentUser();
        if (_.includes(name, search) && userId !== _.get(loggedUser, '_id')) {
          searchItem = searchItem.set(userId, user);
        }
      });
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
    let messages = [];
    if (channel) {
      channel.messages.map((value, key) => {
        // key = Number(key);
        const message = this.messages.get(key);
        messages.push(message);
      });
    }
    return messages;
  }
  getMembersFromChanel (channel) {
    let members = new OrderedMap();
    if (channel) {
      channel.members.map((value, key) => {
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
    this.messages = this.messages.set(`${id}`, message);

    const channelId = _.get(message, 'channelId');
    if (channelId) {
      let channel = this.channels.get(channelId);
      channel.isNew = false;
      channel.lastMassage = _.get(message, 'body', '');
      channel.messages = channel.messages.set(id, true);
      this.channels = this.channels.set(channelId, channel);
    }

    this.update();
  }
  onCreateNewChannel (channel = {}) {
    console.log('new channel', channel);
    const channelId = _.get(channel, '_id');
    this.addChaneles(channelId, channel);
    this.setActiveChannel(channelId);
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
