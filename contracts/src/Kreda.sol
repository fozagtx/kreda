// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Kreda is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Invoice {
        bytes32 invoiceId;
        address supplier;
        address lender;
        uint256 faceValue;
        uint256 advanceAmount;
        uint64 dueDate;
        bool funded;
    }

    IERC20 public immutable musdToken;
    mapping(bytes32 => Invoice) public invoices;
    bytes32[] private invoiceIds;

    event InvoiceRegistered(
        bytes32 indexed invoiceId,
        address indexed supplier,
        uint256 faceValue,
        uint256 advanceAmount,
        uint64 dueDate
    );

    event InvoiceFunded(
        bytes32 indexed invoiceId,
        address indexed supplier,
        address indexed lender,
        uint256 amount
    );

    constructor(address musdToken_) {
        require(musdToken_ != address(0), "Zero MUSD address");
        musdToken = IERC20(musdToken_);
    }

    function registerInvoice(
        bytes32 invoiceId,
        uint256 faceValue,
        uint256 advanceAmount,
        uint64 dueDate
    ) external {
        require(invoices[invoiceId].invoiceId == bytes32(0), "Invoice already registered");
        require(faceValue > 0, "Face value must be positive");
        require(advanceAmount > 0, "Advance amount must be positive");
        require(advanceAmount <= faceValue, "Advance exceeds face value");
        require(dueDate > block.timestamp, "Due date must be in the future");

        invoices[invoiceId] = Invoice({
            invoiceId: invoiceId,
            supplier: msg.sender,
            lender: address(0),
            faceValue: faceValue,
            advanceAmount: advanceAmount,
            dueDate: dueDate,
            funded: false
        });

        invoiceIds.push(invoiceId);

        emit InvoiceRegistered(
            invoiceId,
            msg.sender,
            faceValue,
            advanceAmount,
            dueDate
        );
    }

    function fundInvoice(bytes32 invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[invoiceId];

        require(invoice.invoiceId != bytes32(0), "Invoice not registered");
        require(!invoice.funded, "Invoice already funded");
        require(msg.sender != invoice.supplier, "Supplier cannot fund own invoice");

        invoice.funded = true;
        invoice.lender = msg.sender;

        musdToken.safeTransferFrom(
            msg.sender,
            invoice.supplier,
            invoice.advanceAmount
        );

        emit InvoiceFunded(
            invoiceId,
            invoice.supplier,
            msg.sender,
            invoice.advanceAmount
        );
    }

    function getInvoiceCount() external view returns (uint256) {
        return invoiceIds.length;
    }

    function getInvoiceAt(uint256 index) external view returns (Invoice memory) {
        require(index < invoiceIds.length, "Invoice index out of bounds");
        return invoices[invoiceIds[index]];
    }
}
