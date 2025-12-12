export const TesseraFeeSplitterFactory = {
  address: "0x49cCa62da01048b7b37F02e2fE4C61877784494f",
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