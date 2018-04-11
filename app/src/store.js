import {OrderedMap} from 'immutable';
import _ from 'lodash';

const users = OrderedMap({
  '1': {_id: '1', name: 'Miki', created: new Date()},
  '2': {_id: '2', name: 'Gogo', created: new Date()},
  '3': {_id: '3', name: 'Denis', created: new Date()}
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
    let members = [];
    if (channel) {
      channel.members.map((value, key) => {
        const member = users.get(key);
        members.push(member);
      });
    }
    return members;
  }
  getMessages () {
    return this.messages.valueSeq();
  }
  addMessages (id, message = {}) {
    this.messages = this.messages.set(`${id}`, message);

    const channelId = _.get(message, 'channelId');
    if (channelId) {
      const channel = this.channels.get(channelId);
      channel.messages = channel.messages.set(id, true);
      this.channels = this.channels.set(channelId, channel);
    }

    this.update();
  }
  getChaneles () {
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
