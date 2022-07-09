//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

abstract contract IStaking {
    uint256 public quorum;

    struct Stake {
        uint256 balance;
        bool locked;
    }

    struct Challenge {
        uint256 start;
        bool resolved;
        uint256 votes;
        uint256 amount;
        address challenger;
        address[] stakers;
        address[] voters;
        mapping(address => bool) voted;
    }

    mapping(address => bool) jurors;
    mapping(address => Stake) stakes;
    mapping(bytes32 => Challenge) challenges;

    event tokenStaked(address staker, uint256 amount);
    event tokenWithdrawn(address staker, uint256 amount);
    event challenged(
        address stakerA,
        address stakerB,
        address challenger,
        bytes32 id
    );
    event challengeVoted(bytes32 id, address juror);
    event challengeFinalized(bytes32 id);

    modifier onlyJuror() {
        require(jurors[msg.sender], "Jurors only allowed here");
        _;
    }

    modifier challengeExists(bytes32 id) {
        require(
            !challenges[id].resolved &&
                challenges[id].challenger != address(0) &&
                challenges[id].amount > 0,
            "Challenge has been resolved"
        );
        _;
    }

    // stake
    function stake(uint256 amount) public virtual {}

    // unstake
    function unstake(uint256 amount) public virtual {}

    // challenge
    function challenge(address a, address b)
        public
        virtual
        returns (bytes32 id)
    {}

    // vote challenge
    function voteChallenge(bytes32 id) public virtual {}

    // penalize
    function finalizeChallenge(bytes32 id) public virtual {}

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
