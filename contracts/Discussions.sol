// contracts/Discussions.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract Discussions is ERC2771Recipient {
    address private trustedForwarder;
    address payable public owner;

    struct Discussion {
        uint256 id;
        address payable author;
        string text;
        uint256 likes;
        uint256 createdAt;
    }

    uint256 private nextDiscussionId = 1;

    //map song token contract address to its discussion IDs
    mapping(address => uint256[]) songDiscussions;

    //map of ID to discussion
    mapping(uint256 => Discussion) private discussions;

    event DiscussionAdded(
        uint256 id,
        address indexed author,
        string text,
        uint256 createdAt
    );

    constructor(address _trustedForwarder) public {
        trustedForwarder = _trustedForwarder;
        owner = payable(_msgSender());
    }

    function postDiscussion(address _contractAddress, string calldata _text)
        external
    {
        discussions[nextDiscussionId] = Discussion(
            nextDiscussionId,
            payable(_msgSender()),
            _text,
            0,
            block.timestamp
        );
        songDiscussions[_contractAddress].push(nextDiscussionId);
        emit DiscussionAdded(
            nextDiscussionId,
            _msgSender(),
            _text,
            block.timestamp
        );
        nextDiscussionId++;
    }

    function likeDiscussion(uint256 _discussionId) external {
        Discussion storage comm = discussions[_discussionId];
        comm.likes++;
    }

    function getSongDiscussions(address _contractAddress)
        external
        view
        returns (Discussion[] memory)
    {
        uint256[] memory discussionIds = songDiscussions[_contractAddress];
        uint256 len = discussionIds.length;
        Discussion[] memory _discussions = new Discussion[](len);

        for (uint256 i = 0; i < len; i++) {
            Discussion storage comm = discussions[discussionIds[i]];
            _discussions[i] = Discussion(
                comm.id,
                comm.author,
                comm.text,
                comm.likes,
                comm.createdAt
            );
        }

        return _discussions;
    }

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
        trustedForwarder = _trustedForwarder;
    }

    function versionRecipient() external pure returns (string memory) {
        return "1";
    }

    modifier onlyOwner() {
        require(_msgSender() == owner, "Only owner can call this function");
        _;
    }
}
