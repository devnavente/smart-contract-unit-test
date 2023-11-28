const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();
    await faucet.waitForDeployment();

    const [owner, other] = await ethers.getSigners();

    let withdrawAmount = 50;

    console.log('Owner address: ', owner.address);
    console.log('Other address: ', other.address);

    return { faucet, owner, other, withdrawAmount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  // check that the require clause in the withdraw() function works as expected
  it('shouldn\'t allow users withdraw more than .1 ETH at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  })

  it('shouldn\'t allow someone instantly draining all of our funds', async function () {
    const { faucet, other } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.connect(other).withdrawAll()).to.be.reverted;
  })

  it('shouldn\'t allow someone to destroy faucet', async function () {
    const { faucet, other } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.connect(other).destroyFaucet()).to.be.reverted;
  })

  it('should allow owner withdraw all', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.withdrawAll()).to.not.be.reverted;
  })

  it('should allow owner destroy Faucet', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);
    const { target } = faucet;

    expect(await faucet.destroyFaucet()).to.not.be.reverted;

    // does the contract actually self destruct when the destroyFaucet() is called? 
    expect(await ethers.provider.getCode(target)).to.equal('0x');
  })

});
