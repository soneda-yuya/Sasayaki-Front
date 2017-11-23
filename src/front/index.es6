import Web3 from 'web3';
import Vue from './main.es6';

const config = require('../../config/config.json');
const abi = require('./abi.json');

/* eslint no-unused-vars: 0 */
const vm = new Vue({
  el: '#index',
  data: {
    new_message: '',
    messages: [],
  },
  methods: {
    toggleSidenav() {
      this.$refs.sidenav.toggle();
    },
  },
  mounted() {
    const web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(config.ethProvider));

    const contract = new web3.eth.Contract(abi, '0x8cadd64ed77c96b3358b4be3533f48dda2a99a24');

    contract.methods.id().call()
      .then(id => contract.methods.messages(id - 1).call())
      .then((message) => {
        this.messages.push(message);
      });
  },
});
