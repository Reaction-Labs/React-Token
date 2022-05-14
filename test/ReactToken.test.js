const React = artifacts.require("ReactToken");

contract("ReactToken", accounts => {
    let react;

    it("initialize with correct values", function() {
        return React.deployed().then(function(instance) {
            react = instance;
            return react.name();
        }).then(function(name) {
            assert.equal(name, "Reaction", 'should have the correct name');
            return react.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, "React", 'should have the correct symbol');
            return react.decimals();
        }).then(function(decimals) {
            assert.equal(decimals, 18, 'should have correct decimals');
        })
    });

    it("transfers token ownership'", function() {
        return React.deployed().then(function(instance) {
            react = instance;
            return react.transfer.call(accounts[1], 1000, {
                from : accounts[0]
            });
        }).then(function(success) {
            assert.equal(success, true, "it should return true");
            return react.transfer(accounts[1], 1000, {
                from : accounts[0]
            });
        }).then(function(transactionHash) {
            assert.equal(transactionHash.logs.length, 1, 'triggers one event');
            assert.equal(transactionHash.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            return react.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 1000, 'adds number of token to receiver address');
        })
    });

    it("approves tokens for delegated transfer", function() {
        return React.deployed().then(function(instance) {
            react = instance;
            return react.approve.call(accounts[1], 1000);
        }).then(function(success) {
            assert.equal(success, true, 'it should return true');
            return react.approve(accounts[1], 1000, {
                from: accounts[0]
            })
        }).then(function(transactionHash) {
            assert.equal(transactionHash.logs.length, 1, 'triggers one event');
            assert.equal(transactionHash.logs[0].event, 'Approval', 'should be the "Approval" event');
            return react.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 1000, 'stores the allowance for delegated transfer');
        })
    })

    it('handles delegated token transfers', function() {
        return React.deployed().then(function(instance) {
            react = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return react.transfer(fromAccount, 100, { from: accounts[0] });
        }).then(function(transactionHash) {
            return react.approve(spendingAccount, 10, { from: fromAccount });
        }).then(function(transactionHash) {
            return react.transferFrom(fromAccount, toAccount, 200, { from: spendingAccount })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            return react.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            return react.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        })
    })
})