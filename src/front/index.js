import Web3 from 'web3';
import moment from 'moment';
import Vue from './main.js';

const config = require('../../config/config.json');
const abi = require('./abi.json');

/* eslint no-unused-vars: 0 */
const vm = new Vue({
  el: '#index',
  data: {
    metamask: false,
    new_message: '',
    messages: [],
    web3: undefined,
    contract: undefined,
    account: '',
    writing: false,
    balance: 0,
    transactions: [],
  },
  methods: {
    toggleSidenav() {
      this.$refs.sidenav.toggle();
    },
    postDisabled() {
      return (!this.metamask || this.new_message === '' || this.account === '' || this.balance === 0);
    },
    post() {
      if (this.postDisabled()) {
        return;
      }
      this.writing = true;
      try {
        this.contract.methods.Sasayaku(this.new_message).send({ from: this.account })
          .on('transactionHash', (hash) => {
            console.info(hash);
            this.new_message = '';
            this.writing = false;
            this.transactions.push(hash);
          })
          .on('receipt', (receipt) => {
            console.info(receipt);
            for (let i = 0; i < this.transactions.length; i++) {
              if (this.transactions[i] === receipt.transactionHash) {
                this.transactions.splice(i, 1);
                return;
              }
            }
            if (receipt.status === '0x0') {
              this.$refs.error.open();
            }
          })
          .on('error', (error) => {
            console.error(error);
            this.$refs.error.open();
            this.writing = false;
            this.transactions = [];
          });
      } catch (e) {
        console.error(e);
        this.$refs.error.open();
        this.writing = false;
        this.transactions = [];
      }
    },
    update() {
      if (!this.metamask) {
        return;
      }
      this.web3.eth.getAccounts()
        .then((accounts) => {
          this.account = accounts[0];
          return this.contract.methods.id().call();
        })
        .then((id) => {
          const list = [];
          for (let i = id; i >= 1 && i >= id - 10; i--) {
            list.push(this.contract.methods.messages(i - 1).call());
          }
          return Promise.all(list);
        })
        .then((messages) => {
          this.messages = messages;
          return this.contract.methods.balanceOf(this.account).call();
        })
        .then((balance) => {
          this.balance = Number(balance);
          setTimeout(this.update, 1000);
        })
        .catch((error) => {
          console.error(error);
          setTimeout(this.update, 1000);
        });
    },
    formatDate(date) {
      return moment.unix(date).format('YYYY-MM-DD HH:mm:ss Z');
    },
  },
  mounted() {
    this.metamask = !!global.window.web3;
    if (this.metamask) {
      this.web3 = new Web3();
      this.web3.setProvider(global.window.web3.currentProvider);
      this.contract = new this.web3.eth.Contract(abi, config.contract);
      this.update();
    }
  },
});
