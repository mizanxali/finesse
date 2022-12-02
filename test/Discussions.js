const { expect } = require("chai");
const hre = require("hardhat");

describe("Discussions contract", function () {
  let Contract;
  let discussions;
  let owner;

  beforeEach(async function () {
    Contract = await ethers.getContractFactory("Discussions");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    discussions = await Contract.deploy();
  });

  describe("Discussions Tests", function () {
    it("Should add discussions under multiple songs", async function () {
      await discussions.postDiscussion(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b",
        "hello world"
      );
      let tweets = await discussions.getSongDiscussions(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b"
      );
      expect(tweets.length).to.equal(1);

      await discussions.postDiscussion(
        "0xD4c1CE14DabfAEdFdBAF2c1499FeA4414cE862C6",
        "hello world"
      );
      tweets = await discussions.getSongDiscussions(
        "0xD4c1CE14DabfAEdFdBAF2c1499FeA4414cE862C6"
      );
      expect(tweets.length).to.equal(1);

      await discussions.postDiscussion(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b",
        "hello world new"
      );
      tweets = await discussions.getSongDiscussions(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b"
      );
      expect(tweets.length).to.equal(2);

      tweets = await discussions.getSongDiscussions(
        "0xD4c1CE14DabfAEdFdBAF2c1499FeA4414cE862C6"
      );
      expect(tweets.length).to.equal(1);
    });

    it("Should like a discussion", async function () {
      await discussions.postDiscussion(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b",
        "hello world"
      );
      let tweets = await discussions.getSongDiscussions(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b"
      );
      expect(tweets[0].likes).to.equal(0);

      await discussions.likeDiscussion(tweets[0].id);
      tweets = await discussions.getSongDiscussions(
        "0xa06AdEA2e981B412561703e8e96C883D7caDc81b"
      );
      expect(tweets[0].likes).to.equal(1);
    });
  });
});
