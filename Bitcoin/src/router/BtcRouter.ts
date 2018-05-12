import { Request, Response, Router } from 'express';

var moment = require('moment');

require('dotenv').config();
const config = require('../config/config').get(process.env.NODE_ENV);

var rpc = require('json-rpc2');
var client = rpc.Client.$create(config.BTC_RPC_PORT, config.BTC_RPC_HOST, config.BTC_RPC_USER, config.BTC_RPC_PASS);

var promisify = function promisify(fn, args) {
  return new Promise((resolve, reject) => {
    try {
      client.call(fn, args, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export class BtcRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public createAccount(req: Request, res: Response) {
    const account: string = req.body.account;

    try {
      client.call('getnewaddress', [account], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public associateAddresss(req: Request, res: Response) {
    const account: string = req.body.account;
    const address: string = req.body.address;

    try {
      client.call('setaccount', [address, account], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public setTxFee(req: Request, res: Response) {
    const fee: number = req.body.fee;

    try {
      client.call('settxfee', [fee], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getReceivedByAccount(req: Request, res: Response) {
    const account: string = req.body.account;
    const confirm: number = req.body.confirm;

    try {
      client.call('getreceivedbyaccount', [account, confirm], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getReceivedByAddress(req: Request, res: Response) {
    const address: string = req.body.address;
    const confirm: number = req.body.confirm;

    try {
      client.call('getreceivedbyaddress', [address, confirm], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getAccountBalance(req: Request, res: Response) {
    const account: string = req.params.account;

    try {
      client.call('getbalance', [account], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getAllTransactionsByAccount(req: Request, res: Response) {
    const address: string = req.params.address;

    try {
      client.call('listtransactions', [address], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getAccount(req: Request, res: Response) {
    const address: string = req.params.address;

    try {
      client.call('getaccount', [address], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getAccountAddress(req: Request, res: Response) {
    const account: string = req.params.account;

    try {
      client.call('getaccountaddress', [account], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getAccountByAddress(req: Request, res: Response) {
    const account: string = req.params.account;

    try {
      client.call('getaddressesbyaccount', [account], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getBlockCount(req: Request, res: Response) {
    try {
      client.call('getblockcount', [], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getBestBlockHash(req: Request, res: Response) {
    try {
      client.call('getbestblockhash', [], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getBlock(req: Request, res: Response) {
    const hash: string = req.params.hash;

    try {
      client.call('getblock', [hash], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getBlockHash(req: Request, res: Response) {
    const index: number = req.params.index;

    try {
      client.call('getblockhash', [Number(index)], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getTransaction(req: Request, res: Response) {
    const txid: string = req.params.txid;

    try {
      client.call('gettransaction', [txid], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getRawTransaction(req: Request, res: Response) {
    const txid: string = req.params.txid;

    try {
      client.call('getrawtransaction', [txid], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public listAccounts(req: Request, res: Response) {
    try {
      client.call('listaccounts', [], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public sendFrom(req: Request, res: Response) {
    const fromaccount: string = req.body.fromaccount;
    const toaddress: string = req.body.toaddress;
    const amount: number = req.body.amount;
    const confrim: number = req.body.confrim;

    try {
      client.call('sendfrom', [fromaccount, toaddress, amount, confrim], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public sendMany(req: Request, res: Response) {
    const fromaccount: string = req.body.fromaccount;
    const toaddresses: any = req.body.toaddresses;
    const confrim: number = req.body.confrim;

    try {
      client.call('sendmany', [fromaccount, toaddresses, confrim], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public sendToAddress(req: Request, res: Response) {
    const toaddress: string = req.body.toaddress;
    const amount: number = req.body.amount;
    const confrim: number = req.body.confrim;
    try {
      client.call('sendtoaddress', [toaddress, amount, confrim], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public listTransactions(req: Request, res: Response) {
    const account: string = req.body.account;
    const count: number = req.body.count;
    const from: number = req.body.from;
    try {
      client.call('listtransactions', [account, count, from], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public listSinceBlock(req: Request, res: Response) {
    const blockhash: string = req.params.blockhash;

    try {
      client.call('listsinceblock', [blockhash, 1], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  // Utility APIs
  public getBlocksLatest(req: Request, res: Response) {
    const count: number = req.params.count;

    try {
      // get block count
      client.call('getblockcount', [], async function (err, blockCount) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }

        var arrBlocks = [];
        for (var i = 1; i <= count; i++) {
          var index = blockCount - i;

          // promisify('getblockhash', [index])
          //   .then(result => console.log(result))
          //   .catch(e => console.log(e));

          var hash = await promisify('getblockhash', [index]);
          if (hash) {
            var block = await promisify('getblock', [hash]);
            if (block) arrBlocks.push(block);
          }
        }

        return res.json({ status: 200, msg: 'sccuess', data: arrBlocks });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public async getBlocks(req: Request, res: Response) {
    const height: number = req.query.height;
    const count: number = req.query.count;

    try {
      // get block count
      var arrBlocks = [];
      for (var i = 0; i < count; i++) {
        var index = height - i;

        var hash = await promisify('getblockhash', [index]);
        if (hash) {
          var block = await promisify('getblock', [hash]);
          if (block) arrBlocks.push(block);
        }
      }

      return res.json({ status: 200, msg: 'sccuess', data: arrBlocks });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public async getBlockHeight(req: Request, res: Response) {
    const height: number = req.params.height;

    try {
      var hash = await promisify('getblockhash', [Number(height)]);
      if (hash) {
        var block = await promisify('getblock', [hash]);
        if (block) return res.json({ status: 200, msg: 'sccuess', data: block });
      }

      return res.json({ status: 400, msg: 'errors', data: 'no existing block !' });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public getTransactionInfo(req: Request, res: Response) {
    const txid: string = req.params.txid;

    try {
      client.call('getrawtransaction', [txid, 1], function (err, result) {
        if (err) {
          return res.json({ status: 400, msg: 'errors', data: err });
        }
        return res.json({ status: 200, msg: 'sccuess', data: result });
      });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public async getBlockTransactions(req: Request, res: Response) {
    const height: number = req.params.height;

    try {
      var hash = await promisify('getblockhash', [Number(height)]);
      if (hash) {
        var block = await promisify('getblock', [hash]);
        var txs = block['tx'];
        var arrTxs = [];
        for (var i = 0; i < txs.length; i++) {
          var txInfo = await promisify('getrawtransaction', [txs[i], 1]);
          arrTxs.push(txInfo);
        }
        return res.json({ status: 200, msg: 'errors', data: arrTxs });
      }

      return res.json({ status: 400, msg: 'errors', data: 'no existing block !' });
    } catch (error) {
      return res.json({ status: 400, msg: 'errors', data: error });
    }
  }

  public routes() {
    this.router.post('/createaccount', this.createAccount);
    this.router.post('/associateaddress', this.associateAddresss);
    this.router.post('/settxfee', this.setTxFee);
    this.router.post('/getreceivedbyaccount', this.getReceivedByAccount);
    this.router.post('/getreceivedbyaddress', this.getReceivedByAddress);
    this.router.get('/getaccountbalance/:account', this.getAccountBalance);
    this.router.get('/getalltransactionsbyaccount/:address', this.getAllTransactionsByAccount);
    this.router.get('/getaccount/:address', this.getAccount);
    this.router.get('/getaccountaddress/:account', this.getAccountAddress);
    this.router.get('/getaddressesbyaccount/:account', this.getAccountByAddress);
    this.router.get('/getblockcount', this.getBlockCount);
    this.router.get('/getbestblockhash', this.getBestBlockHash);
    this.router.get('/getblock/:hash', this.getBlock);
    this.router.get('/getblockhash/:index', this.getBlockHash);
    this.router.get('/gettransaction/:txid', this.getTransaction);
    this.router.get('/getrawtransaction/:txid', this.getRawTransaction);
    this.router.get('/listaccounts', this.listAccounts);
    this.router.get('/listsinceblock/:blockhash', this.listSinceBlock);
    this.router.post('/sendfrom', this.sendFrom);
    this.router.post('/sendmany', this.sendMany);
    this.router.post('/sendtoaddress', this.sendToAddress);
    this.router.post('/listtransactions', this.listTransactions);

    // Utilty APIs
    this.router.get('/blocks/latest/:count', this.getBlocksLatest);
    this.router.get('/blocks', this.getBlocks);
    this.router.get('/block/:height', this.getBlockHeight);
    this.router.get('/transaction/:txid', this.getTransactionInfo);
    this.router.get('/block/transactions/:height', this.getBlockTransactions);
  }

}

const btcRoutes = new BtcRouter();
btcRoutes.routes();

export default btcRoutes.router;