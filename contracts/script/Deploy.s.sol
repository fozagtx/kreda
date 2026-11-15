// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Kreda} from "../src/Kreda.sol";

contract Deploy is Script {
    function run() external returns (Kreda kreda) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address musdToken = vm.envAddress("MUSD_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        kreda = new Kreda(musdToken);

        vm.stopBroadcast();
    }
}
