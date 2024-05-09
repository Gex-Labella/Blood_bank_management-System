import { ethers } from "hardhat";

async function main() {
    const BloodBankContract = await ethers.getContractFactory("BloodBankContract");
    const bloodBankContract = await BloodBankContract.deploy();

    console.log("BloodBankContract deployed to:", bloodBankContract.address);
    }

main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });