import { encodeAbiParameters, keccak256, toHex } from "viem";

function hashBusinessValue(value: string) {
  return keccak256(toHex(value.trim()));
}

export function computeInvoiceId(
  supplierBusinessRef: string,
  buyerBusinessRef: string,
  invoiceNumber: string,
) {
  return keccak256(
    encodeAbiParameters(
      [{ type: "bytes32" }, { type: "bytes32" }, { type: "bytes32" }],
      [
        hashBusinessValue(supplierBusinessRef),
        hashBusinessValue(buyerBusinessRef),
        hashBusinessValue(invoiceNumber),
      ],
    ),
  );
}
