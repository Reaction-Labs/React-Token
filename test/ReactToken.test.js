const React = artifacts.require("ReactToken");

contract("ReactToken", accounts => {
    before(async () => {
        react = await React.deployed();
    })

    it("owner of token", async () => {
        let balance = await react.balanceOf(accounts[0]);
        balance = web3.utils.fromWei(balance, 'ether');
        assert.equal(balance, '500000000', 'balance should be 500M tokens for contract creator')
    })

    it("can transfer tokens between accounts", async () => {
        let amount = web3.utils.toWei('1000', 'ether');
        await react.transfer(accounts[1], amount, {
            from: accounts[0]
        });
        let balance = await react.balanceOf(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        assert.equal(balance, '1000', 'balance should be 1K token')
    })
})