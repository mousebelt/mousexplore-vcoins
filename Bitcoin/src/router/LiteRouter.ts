import { Request, Response, Router } from 'express';

var moment = require('moment');

require('dotenv').config();
const config = require('../config/config').get(process.env.NODE_ENV);

var rpc = require('json-rpc2');
var client = rpc.Client.$create(config.LITE_RPC_PORT, config.LITE_RPC_HOST, config.LITE_RPC_USER, config.LITE_RPC_PASS);

export class LiteRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public createAccount(req: Request, res: Response) {
    const account: string = req.body.account;

    try {
      client.call('getnewaddress', [account],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public associateAddresss(req: Request, res: Response) {
    const account: string = req.body.account;
    const address: string = req.body.address;

    try {
      client.call('setaccount', [address, account],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public setTxFee(req: Request, res: Response) {
    const fee: number = req.body.fee;

    try {
      client.call('settxfee', [fee],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getReceivedByAccount(req: Request, res: Response) {
    const account: string = req.body.account;
    const confirm: number = req.body.confirm;

    try {
      client.call('getreceivedbyaccount', [account, confirm],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getReceivedByAddress(req: Request, res: Response) {
    const address: string = req.body.address;
    const confirm: number = req.body.confirm;

    try {
      client.call('getreceivedbyaddress', [address, confirm],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getAccountBalance(req: Request, res: Response) {
    const account: string = req.params.account;

    try {
      client.call('getbalance', [account],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getAllTransactionsByAccount(req: Request, res: Response) {
    const address: string = req.params.address;

    try {
      client.call('getbalance', [address],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getAccount(req: Request, res: Response) {
    const address: string = req.params.address;

    try {
      client.call('getaccount', [address],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getAccountAddress(req: Request, res: Response) {
    const account: string = req.params.account;

    try {
      client.call('getaccountaddress', [account],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getAccountByAddress(req: Request, res: Response) {
    const account: string = req.params.account;

    try {
      client.call('getaddressesbyaccount', [account],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getBlockCount(req: Request, res: Response) {
    try {
      client.call('getblockcount', [],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getBestBlockHash(req: Request, res: Response) {
    try {
      client.call('getbestblockhash', [],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getBlock(req: Request, res: Response) {
    const hash: string = req.params.hash;

    try {
      client.call('getblock', [hash],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getBlockHash(req: Request, res: Response) {
    const index: number = req.params.index;

    try {
      client.call('getblockhash', [index],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public getTransaction(req: Request, res: Response) {
    const txid: string = req.params.txid;

    try {
      client.call('gettransaction', [txid],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public listAccounts(req: Request, res: Response) {
    try {
      client.call('listaccounts', [],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public sendFrom(req: Request, res: Response) {
    const fromaccount: string = req.body.fromaccount;
    const toaddress: string = req.body.toaddress;
    const amount: number = req.body.amount;
    const confrim: string = req.body.confrim;

    try {
      client.call('setaccount', [fromaccount, toaddress, amount, confrim],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public sendMany(req: Request, res: Response) {
    const fromaccount: string = req.body.fromaccount;
    const toaddresses: any = req.body.toaddresses;
    const confrim: string = req.body.confrim;

    try {
      client.call('setaccount', [fromaccount, toaddresses, confrim],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public sendToAddress(req: Request, res: Response) {
    const toaddress: string = req.body.toaddress;
    const amount: number = req.body.amount;
    const confrim: number = req.body.confrim;
    try {
      client.call('sendtoaddress', [toaddress, amount, confrim],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public listTransactions(req: Request, res: Response) {
    const account: string = req.body.account;
    const count: number = req.body.count;
    const from: number = req.body.from;
    try {
      client.call('listtransactions', [account, count, from],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
    }
  }

  public listSinceBlock(req: Request, res: Response) {
    const blockhash: string = req.params.blockhash;

    try {
      client.call('listtransactions', [blockhash],  function (err, result) {
        if (err) {
          res.json({ err });
        }

        console.log(result);

        res.status(200).json({result});
      });
    } catch(error) {
      res.json({ error });
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
    this.router.get('/listaccounts', this.listAccounts);
    this.router.get('/listsinceblock/:blockhash', this.listSinceBlock);
    this.router.post('/sendfrom', this.sendFrom);
    this.router.post('/sendmany', this.sendMany);
    this.router.post('/sendtoaddress', this.sendToAddress);
    this.router.post('/listtransactions', this.listTransactions);
  }

}

const liteRoutes = new LiteRouter();
liteRoutes.routes();

export default liteRoutes.router;