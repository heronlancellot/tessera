export const TesseraFeeSplitterFactory = {
  address: "0x2FC2A3c1A2c0526d405f31076b66336597624Df3",
  abi: [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "publisher",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "devs",
                "type": "address"
            },
            {
                "internalType": "uint16",
                "name": "publisherBps",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "devsBps",
                "type": "uint16"
            }
        ],
        "name": "createSplitter",
        "outputs": [
            {
                "internalType": "address",
                "name": "splitter",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "splitter",
                "type": "address"
            }
        ],
        "name": "SplitterCreated",
        "type": "event"
    }
]
}