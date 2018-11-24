const config = require('../config');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));

function getblockTest(blocknum, count) { // eslint-disable-line
  console.log('------------ test blocklist API -------------');

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        console.log(`last number ${number}`);
        const blocks = [];
        for (let i = blocknum; i <= number && i < blocknum + count; i++) {
          const blockdata = await web3.eth.getBlock(i, true);

          const Height = blockdata.number;
          const Age = blockdata.timestamp;
          const txn = blockdata.transactions.length;
          const Uncles = blockdata.uncles.length;
          const Miner = blockdata.miner;
          const GasUsed = blockdata.gasUsed;
          const GasLimit = blockdata.gasLimit;

          let Reward = 0;
          let gas = 0;
          for (let j = 0; j < txn; j++) {
            const hash = blockdata.transactions[j].hash;
            const gasprice = blockdata.transactions[j].gasPrice;
            const transaction = await web3.eth.getTransactionReceipt(hash);

            const price = gasprice * transaction.gasUsed;
            gas += transaction.gasUsed;
            Reward += price / 1000000000;
          }

          const GasPrice = txn ? Reward / gas : 0;
          Reward = Reward / 1000000000;

          blocks.push({
            blockNumber: Height,
            timeStamp: Age,
            txn,
            uncles: Uncles,
            blockMiner: Miner,
            gasUsed: GasUsed,
            gasLimit: GasLimit,
            avgGasPrice: GasPrice.toFixed(2),
          });
        }

        console.log('blocks: ', blocks);
      } catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
      }
    } else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
    }
  });
}

function latestblocks(count) { // eslint-disable-line
  console.log('------------ test latestblocks API -------------');

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        console.log('last number ', number);

        if (count > number + 1) count = number + 1;

        const blocks = [];
        for (let i = number; i > number - count; i--) {
          const blockdata = await web3.eth.getBlock(i, true);

          const Height = blockdata.number;
          const Age = blockdata.timestamp;
          const txn = blockdata.transactions.length;
          const Uncles = blockdata.uncles.length;
          const Miner = blockdata.miner;
          const GasUsed = blockdata.gasUsed;
          const GasLimit = blockdata.gasLimit;

          let Reward = 0;
          let gas = 0;
          for (let j = 0; j < txn; j++) {
            const hash = blockdata.transactions[j].hash;
            const gasprice = blockdata.transactions[j].gasPrice;
            const transaction = await web3.eth.getTransactionReceipt(hash);

            const price = gasprice * transaction.gasUsed;
            gas += transaction.gasUsed;
            Reward += price / 1000000000;
          }

          const GasPrice = txn ? Reward / gas : 0;
          Reward = Reward / 1000000000;

          blocks.push({
            blockNumber: Height,
            timeStamp: Age,
            txn,
            uncles: Uncles,
            blockMiner: Miner,
            gasUsed: GasUsed,
            gasLimit: GasLimit,
            avgGasPrice: GasPrice.toFixed(2),
          });
        }

        console.log('blocks: ', blocks);
      } catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
      }
    } else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
    }
  });
}

async function getblockdetail(blockNumber) { // eslint-disable-line
  console.log('------------ test getblockdetail API -------------');

  try {
    const blockdata = await web3.eth.getBlock(blockNumber, true);

    const timestamp = blockdata.timestamp;
    const txn = blockdata.transactions.length;
    // const Uncles = blockdata.uncles.length;
    const hash = blockdata.hash;
    const parentHash = blockdata.parentHash;
    const sha3Uncles = blockdata.sha3Uncles;
    const Miner = blockdata.miner;
    const difficulty = blockdata.difficulty;
    const totalDifficulty = blockdata.totalDifficulty;
    const size = blockdata.size;
    const nonce = blockdata.nonce;
    const extraData = blockdata.extraData;
    const GasUsed = blockdata.gasUsed;
    const GasLimit = blockdata.gasLimit;

    const blockdetail = {
      blockNumber,
      timeStamp: timestamp,
      transactions: txn,
      hash,
      parentHash,
      sha3Uncles,
      minedBy: Miner,
      difficulty,
      totalDifficulty,
      size,
      gasUsed: GasUsed,
      gasLimit: GasLimit,
      nonce,
      extraData
    };

    console.log('data: ', blockdetail);
  } catch (e) {
    console.log('blocklist: we have a promblem: ', e); // Should dump errors here
  }
}

async function getTransactions(blockNumber) { // eslint-disable-line

  try {
    const blockdata = await web3.eth.getBlock(blockNumber, true);
    const timestamp = blockdata.timestamp;
    const transactions = blockdata.transactions;

    const txnlist = [];
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      const txreceipt = await web3.eth.getTransactionReceipt(transaction.hash);

      let fee = txreceipt.gasUsed * transaction.gasPrice;
      fee = fee / 1e18;

      txnlist.push({
        blockNumber,
        timeStamp: timestamp,
        txHash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value / 1e18,
        txFee: fee
      });
    }

    console.log('data: ', txnlist);
  } catch (e) {
    console.log('blocklist: we have a promblem: ', e); // Should dump errors here
  }
}

function getTransactionList(offset, count) { // eslint-disable-line

  web3.eth.getBlockNumber(async function (error, number) {
    if (!error) {
      try {
        console.log('last number ', number);

        const txnlist = [];
        for (let i = number; i > 0; i--) {
          const blockdata = await web3.eth.getBlock(i, true);

          const blocknumber = blockdata.number;
          const timestamp = blockdata.timestamp;
          const txn = blockdata.transactions.length;

          if (txn <= offset) {
            offset -= txn;
            continue;
          }

          for (let j = txn - 1; j > 0; j--) {
            offset--;
            if (offset > 0) continue;

            const transaction = blockdata.transactions[j];

            const hash = transaction.hash;
            // const from = transaction.from;
            // const to = transaction.to;
            // const value = transaction.value / 1e18;

            console.log(`tx=${hash}, gasprice=${transaction.gasprice}, gas=${transaction.gas}`);

            const txreceipt = await web3.eth.getTransactionReceipt(hash);

            console.log(`receipt gas=${txreceipt.gasUsed}`);

            let fee = txreceipt.gasUsed * transaction.gasPrice;
            fee = fee / 1e18;

            txnlist.push({
              blockNumber: blocknumber,
              timeStamp: timestamp,
              txHash: transaction.hash,
              from: transaction.from,
              to: transaction.to,
              value: transaction.value / 1e18,
              txFee: fee
            });

            count--;
            if (count <= 0) break;
          }

          if (count <= 0) break;
        }

        console.log('txnlist: ', txnlist);
      } catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
      }
    } else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
    }
  });
}

function getTransactionInfo(txHash) {

  web3.eth.getTransaction(txHash, async function (error, transaction) {
    if (!error) {
      try {
        const blocknumber = transaction.blockNumber;

        const blockdata = await web3.eth.getBlock(blocknumber, true);

        const timestamp = blockdata.timestamp;

        const txreceipt = await web3.eth.getTransactionReceipt(txHash);

        let fee = txreceipt.gasUsed * transaction.gasPrice;
        fee = fee / 1e18;

        const txinfo = {
          txHash: transaction.hash,
          timeStamp: timestamp,
          status: txreceipt.status,
          block: blocknumber,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value / 1e18,
          gasLimit: transaction.gas,
          gasUsedByTxn: txreceipt.gasUsed,
          gasPrice: transaction.gasPrice,
          actualTxCostFee: fee,
          nonce: transaction.nonce,
          inputData: transaction.input
        };

        console.log('txinfo: ', txinfo);
      } catch (e) {
        console.log('blocklist: we have a promblem: ', e); // Should dump errors here
      }
    } else {
      console.log('getBlockNumber: we have a promblem: ', error); // Should dump errors here
    }
  });
}

// getblockTest(3174639, 40);
// latestblocks(20);
// getblockdetail(3174639);
// getTransactions(3179897);
// getTransactionList(5, 20);
getTransactionInfo('0xcdcab7444862ccedbbe10409ef0de3c2a663283edf164ad04f4296012cd5949c');
