import * as  bodyParser from 'body-parser';
import express, {Request, Response} from 'express';

import {Block, generateNextBlock, getBlockChain} from './blockchain';
import {connectToPeers, getSockets, initP2PServer} from './p2p';

const httpPort: number = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT): 3001;
const p2pPort: number = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 6001;


/*
An essential part of a node is to share and sync the blockchain with other nodes. The following rules are used to keep the network in sync.

When a node generates a new block, it broadcasts it to the network
When a node connects to a new peer it querys for the latest block
When a node encounters a block that has an index larger than the current known block, it either adds the block the its current chain or querys for the full blockchain.

We will be using websockets for Peer to peer communication

The user must be able to control the node in some way. This is done by setting up a HTTP server.
-the http server provides a REST API interface for users to control the blockchain node
*/

//We listen on myHTTPPort: Sets up API routes to interact with the blockchain node (e.g., getting the blockchain, mining new blocks, managing peers).
const initHTTPServer = (myHTTPPort: number) =>{

    //Adds middleware to parse incoming JSON request bodies. Particularly used for POST requests that send data.
    const app = express();
    app.use(bodyParser.json());

    //GET /blocks: returns the current state of the entire block chain as JSON
    app.get('/blocks', (req: Request, res: Response) =>{
        res.send(getBlockChain());
    });

    //POST/minceBlock: mines a new block using the data sent in the requets of req.body.data
    app.post('/mineBlock', (req: Request, res: Response) =>{
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });

    //GET /peers: returns a list of peer connections
    //getSockets() retrieves all active WebSocket connctions
    //Then, each peer's IP and port are returned
    app.get('/peers', (req: Request, res: Response) => {
        res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    app.post('/addPeer', (req: Request, res: Response) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(myHTTPPort, () => {
        console.log('Listening http on port: ' + myHTTPPort);
    });
}

initHTTPServer(httpPort);
initP2PServer(p2pPort);




