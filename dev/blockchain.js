const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain(){
	this.chain = [];
	this.pendingTransactions = [];
	this.currentNodeUrl = currentNodeUrl;
	//this.createNewBlock();
	this.networkNodes = [];
	this.createNewBlock(100, '0','0');









}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash){
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash,
	};
	this.pendingTransactions = [];
	this.chain.push(newBlock);
	return newBlock;

}

Blockchain.prototype.getLastBlock = function (){
	return this.chain[this.chain.length-1]
}
Blockchain.prototype.getLastIndex = function (){
	return this.chain.length;
}	
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient){
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join(''),
	};
	return newTransaction;

		//this.pendingTransactions.push(newTransaction);
		//return this.getLastIndex()+1;

}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
}
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while(hash.substring(0,2) !=='00'){
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		console.log(hash);
}
return nonce;

}
Blockchain.prototype.chainIsValid = function(blockchain) { 
	let validChain = true;
	for (var i = 1; i < blockchain.length; i++) {
		if (blockHash.substring(0, 2) !== '00') validChain = false;
		const currentBlock = blockchain[i];
		const prevBlock =blockchain[i - 1];
		const blockHash = this.hashBlock (prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce'] );
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false; 
		console.log('previousBlockHash =>', prevBlock [ 'hash']);
		console.log('currentBlockHash =>', currentBlock [ 'hash']);                         
	};
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};
Blockchain.prototype.getBlock = function(blockHash) {


	//flag variable
	let correctBlock = null;

	this.chain.forEach(block =>{
		if(block.hash === blockHash)
			correctBlock = block;

	});
	return correctBlock;

};

//Get a specific transaction by passing transactionId


Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};

Blockchain.prototype.getAddressData = function(address){


	const addressTransactions = [];
	//pushing all transactions associated with specific address in addressTransactions array
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address){
				addressTransactions.push(transaction);
			};
		});
	});

	//calculating balance of a specific address
	let balance = 0;
	addressTransactions.forEach(transaction => {
		if(transaction.recipient === address) balance += transaction.amount;
		else if(transaction.sender === address) balance -= transaction.amount;
	});
	return {       
		addressTransactions: addressTransactions,        
		addressBalance: balance
	};

};

module.exports = Blockchain;