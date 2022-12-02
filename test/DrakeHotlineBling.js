const { expect } = require("chai");
const hre = require("hardhat");

describe("DrakeHotlineBling contract", function () {
  let Contract;
  let songToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Contract = await ethers.getContractFactory("DrakeHotlineBling");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    songToken = await Contract.deploy();
  });

  describe("Deployment Tests", function () {
    it("Should set the right owner", async function () {
      expect(await songToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await songToken.balanceOf(owner.address);
      expect(await songToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct artistName", async function () {
      const artistName = await songToken.artistName();
      expect(artistName).to.equal("Drake");
    });

    it("Should set the correct songName", async function () {
      const songName = await songToken.songName();
      expect(songName).to.equal("Hotline Bling");
    });

    it("Should set the correct geniusID", async function () {
      const geniusID = await songToken.geniusID();
      expect(geniusID).to.equal("2263723");
    });

    it("Should set the correct spotifyURI", async function () {
      const spotifyURI = await songToken.spotifyURI();
      expect(spotifyURI).to.equal("0PVLrYwxpQQts9CvEXLcWx");
    });

    it("Should set the correct artistAddress", async function () {
      const artistAddress = await songToken.artistAddress();
      expect(artistAddress).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("Should set the correct isArtistVerified", async function () {
      const isArtistVerified = await songToken.isArtistVerified();
      expect(isArtistVerified).to.equal(false);
    });

    it("unreleasedSongURL should be an empty string", async function () {
      const unreleasedSongURL = await songToken.unreleasedSongURL();
      expect(unreleasedSongURL.length).to.equal(0);
    });
  });

  describe("Transaction Tests", function () {
    it("Should transfer tokens between accounts", async function () {
      //transfer 50 tokens from owner to addr1
      await songToken.transfer(addr1.address, 50);
      const addr1Balance = await songToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      //transfer 50 tokens from addr1 to addr2
      await songToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await songToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await songToken.balanceOf(owner.address);

      //try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens)
      await expect(
        songToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      //owner balance shouldn't have changed
      expect(await songToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await songToken.balanceOf(owner.address);

      //transfer 100 tokens from owner to addr1
      await songToken.transfer(addr1.address, 100);

      //transfer another 50 tokens from owner to addr2
      await songToken.transfer(addr2.address, 50);

      //check balances
      const finalOwnerBalance = await songToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await songToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await songToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Transfer ownership to actual artist", function () {
    it("Should set artistAddress", async function () {
      await songToken.transferOwnershipToArtist(addr1.address);
      const artistAddress = await songToken.artistAddress();
      expect(artistAddress).to.equal(addr1.address);
    });

    it("Should set isArtistVerified to true", async function () {
      await songToken.transferOwnershipToArtist(addr1.address);
      const isArtistVerified = await songToken.isArtistVerified();
      expect(isArtistVerified).to.equal(true);
    });
  });

  describe("Update unreleased song URL", function () {
    it("Should transfer ownership to actual artist and then update their unreleasedSongURL", async function () {
      await songToken.transferOwnershipToArtist(addr1.address);
      await songToken.connect(addr1).updateUnreleasedSongURL("mydemourl");
      const x = await songToken.unreleasedSongURL();
      expect(x).to.equal("mydemourl");
    });
  });
});
