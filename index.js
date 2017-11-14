require('dotenv').config();
const seneca = require('seneca')();
const data = require('../sandbox-data');

seneca.add({ role: 'item', cmd: 'updateItem' }, (message, reply) => {
  if (!message.id) {
    return reply(null, { error: 'ItemIdentifierRequired' });
  }
  if (!message.label) {
    return reply(null, { error: 'ItemLabelRequired' });
  }
  data.Item
    .findById(message.id)
    .then(item => {
      if (!item) {
        return reply(null, { error: 'ItemNotFound' });
      }
      item.label = message.label;
      return item.save();
    })
    .then(item => reply(null, { response: item }))
    .catch(error => reply(error, null));
});

seneca.listen({
  port: process.env.PORT,
  host: process.env.HOST || 'localhost',
});
