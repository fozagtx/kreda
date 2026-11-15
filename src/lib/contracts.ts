import { KREDA_ADDRESS, MUSD_ADDRESS } from "./mezo";

export const musdAddress = MUSD_ADDRESS;

export const kredaAddress: `0x${string}` | undefined =
  KREDA_ADDRESS.length === 42 ? KREDA_ADDRESS : undefined;

export const musdAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const kredaAbi = [
  {
    type: "constructor",
    inputs: [{ name: "musdToken", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registerInvoice",
    stateMutability: "nonpayable",
    inputs: [
      { name: "invoiceId", type: "bytes32" },
      { name: "faceValue", type: "uint256" },
      { name: "advanceAmount", type: "uint256" },
      { name: "dueDate", type: "uint64" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "fundInvoice",
    stateMutability: "nonpayable",
    inputs: [{ name: "invoiceId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getInvoiceCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getInvoiceAt",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "invoiceId", type: "bytes32" },
          { name: "supplier", type: "address" },
          { name: "lender", type: "address" },
          { name: "faceValue", type: "uint256" },
          { name: "advanceAmount", type: "uint256" },
          { name: "dueDate", type: "uint64" },
          { name: "funded", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "invoices",
    stateMutability: "view",
    inputs: [{ name: "invoiceId", type: "bytes32" }],
    outputs: [
      { name: "invoiceId", type: "bytes32" },
      { name: "supplier", type: "address" },
      { name: "lender", type: "address" },
      { name: "faceValue", type: "uint256" },
      { name: "advanceAmount", type: "uint256" },
      { name: "dueDate", type: "uint64" },
      { name: "funded", type: "bool" },
    ],
  },
  {
    type: "event",
    name: "InvoiceRegistered",
    inputs: [
      { name: "invoiceId", type: "bytes32", indexed: true },
      { name: "supplier", type: "address", indexed: true },
      { name: "faceValue", type: "uint256", indexed: false },
      { name: "advanceAmount", type: "uint256", indexed: false },
      { name: "dueDate", type: "uint64", indexed: false },
    ],
  },
  {
    type: "event",
    name: "InvoiceFunded",
    inputs: [
      { name: "invoiceId", type: "bytes32", indexed: true },
      { name: "supplier", type: "address", indexed: true },
      { name: "lender", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;
