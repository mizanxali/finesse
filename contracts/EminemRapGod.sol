// contracts/EminemRapGod.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract EminemRapGod is ERC20, ERC20Capped {
    address payable public owner;
    string public artistName;
    string public songName;
    string public geniusID;
    string public spotifyURI;
    address payable public artistAddress;
    string public unreleasedSongURL;
    bool public isArtistVerified;

    //constructor
    constructor()
        ERC20("EminemRapGod", "EMRG")
        ERC20Capped(100 * (10**decimals()))
    {
        owner = payable(msg.sender);
        artistName = "Eminem";
        songName = "Rap God";
        geniusID = "235729";
        spotifyURI = "6or1bKJiZ06IlK0vFvY75k";
        artistAddress = payable(address(0));
        isArtistVerified = false;
        _mint(owner, 100 * (10**decimals())); //mint 100 tokens(initial supply)
    }

    //overridden mint function
    function _mint(address account, uint256 amount)
        internal
        virtual
        override(ERC20Capped, ERC20)
    {
        require(
            ERC20.totalSupply() + amount <= cap(),
            "ERC20Capped: cap exceeded"
        );
        super._mint(account, amount);
    }

    //function to transfer ownership to actual artist after manual verification
    function transferOwnershipToArtist(address _artistAddress)
        public
        onlyOwner
    {
        artistAddress = payable(_artistAddress);
        isArtistVerified = true;
    }

    //function for the verifed artist to update their unreleasedSongURL
    function updateUnreleasedSongURL(string memory _unreleasedSongURL)
        public
        onlyArtist
    {
        unreleasedSongURL = _unreleasedSongURL;
    }

    //SOS - destroy contract function
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyArtist() {
        require(isArtistVerified == true, "Artist not verified yet");
        require(
            msg.sender == artistAddress,
            "Only verified aritst can call this function"
        );
        _;
    }
}
