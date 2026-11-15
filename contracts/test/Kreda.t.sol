// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Kreda} from "../src/Kreda.sol";

contract MockMUSD is ERC20 {
    constructor() ERC20("Mock MUSD", "MUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract FailingMUSD is ERC20 {
    constructor() ERC20("Failing MUSD", "MUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public pure override returns (bool) {
        return false;
    }
}

contract KredaTest is Test {
    Kreda public kreda;
    MockMUSD public musd;

    address public supplier = makeAddr("supplier");
    address public lender = makeAddr("lender");

    bytes32 public invoiceId = keccak256("invoice-001");

    uint256 public constant FACE_VALUE = 1_000 ether;
    uint256 public constant ADVANCE_AMOUNT = 800 ether;
    uint64 public constant DUE_DATE = uint64(2_000_000_000);

    function setUp() public {
        musd = new MockMUSD();
        kreda = new Kreda(address(musd));

        musd.mint(lender, FACE_VALUE);

        vm.startPrank(lender);
        musd.approve(address(kreda), type(uint256).max);
        vm.stopPrank();
    }

    function _registerInvoice(address caller) internal {
        vm.startPrank(caller);
        kreda.registerInvoice(
            invoiceId,
            FACE_VALUE,
            ADVANCE_AMOUNT,
            DUE_DATE
        );
        vm.stopPrank();
    }

    function testRegisterValidInvoice() public {
        _registerInvoice(supplier);

        (
            bytes32 storedId,
            address storedSupplier,
            ,
            uint256 faceValue,
            uint256 advanceAmount,
            uint64 dueDate,
            bool funded
        ) = kreda.invoices(invoiceId);

        assertEq(storedId, invoiceId);
        assertEq(storedSupplier, supplier);
        assertEq(faceValue, FACE_VALUE);
        assertEq(advanceAmount, ADVANCE_AMOUNT);
        assertEq(dueDate, DUE_DATE);
        assertFalse(funded);
        assertEq(kreda.getInvoiceCount(), 1);
    }

    function testRegisterExistingInvoiceIdReverts() public {
        _registerInvoice(supplier);

        vm.prank(supplier);
        vm.expectRevert("Invoice already registered");
        kreda.registerInvoice(
            invoiceId,
            FACE_VALUE,
            ADVANCE_AMOUNT,
            DUE_DATE
        );
    }

    function testRegisterZeroValueInvoiceReverts() public {
        vm.prank(supplier);
        vm.expectRevert("Face value must be positive");
        kreda.registerInvoice(
            invoiceId,
            0,
            ADVANCE_AMOUNT,
            DUE_DATE
        );
    }

    function testRegisterAdvanceGreaterThanFaceValueReverts() public {
        vm.prank(supplier);
        vm.expectRevert("Advance exceeds face value");
        kreda.registerInvoice(
            invoiceId,
            FACE_VALUE,
            FACE_VALUE + 1,
            DUE_DATE
        );
    }

    function testFundValidInvoice() public {
        _registerInvoice(supplier);

        vm.prank(lender);
        kreda.fundInvoice(invoiceId);

        assertEq(musd.balanceOf(supplier), ADVANCE_AMOUNT);
        assertEq(musd.balanceOf(lender), FACE_VALUE - ADVANCE_AMOUNT);

        (bytes32 storedId, , address storedLender, , , , bool funded) = kreda
            .invoices(invoiceId);
        assertEq(storedId, invoiceId);
        assertEq(storedLender, lender);
        assertTrue(funded);
    }

    function testSupplierFundsOwnInvoiceReverts() public {
        _registerInvoice(supplier);

        vm.prank(supplier);
        vm.expectRevert("Supplier cannot fund own invoice");
        kreda.fundInvoice(invoiceId);
    }

    function testFundAlreadyFundedInvoiceReverts() public {
        _registerInvoice(supplier);

        vm.prank(lender);
        kreda.fundInvoice(invoiceId);

        vm.prank(lender);
        vm.expectRevert("Invoice already funded");
        kreda.fundInvoice(invoiceId);
    }

    function testInsufficientMUSDAllowanceReverts() public {
        _registerInvoice(supplier);

        address poorLender = makeAddr("poorLender");
        musd.mint(poorLender, FACE_VALUE);

        vm.prank(poorLender);
        vm.expectRevert();
        kreda.fundInvoice(invoiceId);
    }

    function testTransferFailureRollsBackFundingState() public {
        FailingMUSD failingMusd = new FailingMUSD();
        Kreda failingKreda = new Kreda(address(failingMusd));

        failingMusd.mint(lender, FACE_VALUE);
        vm.startPrank(lender);
        failingMusd.approve(address(failingKreda), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(supplier);
        failingKreda.registerInvoice(
            invoiceId,
            FACE_VALUE,
            ADVANCE_AMOUNT,
            DUE_DATE
        );
        vm.stopPrank();

        vm.prank(lender);
        vm.expectRevert();
        failingKreda.fundInvoice(invoiceId);

        (bytes32 storedId, , address storedLender, , , , bool funded) = failingKreda
            .invoices(invoiceId);

        assertEq(storedId, invoiceId);
        assertEq(storedLender, address(0));
        assertFalse(funded);
    }
}
