# Finesse
A DeFi-powered ecosystem for fans to get exclusive access to their favorite songs and music artists.

## The problem Finesse solves
At the heart of the platform, are coins for different songs by various artists, in the form of ERC20 tokens on the Polygon blockchain. Fans can buy and sell these coins using MATIC on the Polygon testnet and enjoy special rewards as holders of these coins.

The trading of these coins is based on AMM using liquidity pools on UniswapV3. The prices of the song coins change based on 1. user supply and demand 2. song popularity (the Genius API is used to add more liquidity to the pools for every 100K views the song gets, via a cron script that runs at fixed intervals), thus creating 2-factor price movement. Fans can swap the song coins for MATIC on the platform itself using embedded Uniswap widgets.

As a holder of these coins, every fan is entitled to different privileges based on the amount of coins they hold. These privileges are split into 6 different tiers, ranging from Iron to Diamond. Each tier is progressively unlocked based on the amount of song coins a user holds, and the reward keeps on increasing in value. This set-in-stone tier system leaves no space for the artists to exploit the fans.

## Reward Tiers
- Iron: 10 coins - mint a personalized artist NFT.
- Bronze: 25 coins - mint free NFT ticket to artist’s next concert.
- Silver: 50 coins - access to one unreleased song from the artist.
- Gold: 100 coins - access to an exclusive livestream by the artist.
- Platinum: 250 coins - access to chat messaging with the artist.
- Diamond: 500 coins - 15 minute video call with the artist.

Besides these privileges, coin holders can also engage in on-chain discussions to interact with each other in a fully decentralised manner.

Every artist is initially allocated with 20 coins of each of their songs. They can put these coins into the liquidity pool at any point and trade them for MATIC depending on the current spot price of these coins. These coins are stored in the contract when the coins are first minted and are transferred to the artist after a verification process.

## Technologies I used
Next.js, Biconomy, Uniswap, Livepeer, Polygon, NFTPort, web3.Storage, Huddle01, Push Chat

## Contract Addresses
DrakeHotlineBling deployed at: [0xa06AdEA2e981B412561703e8e96C883D7caDc81b](https://mumbai.polygonscan.com/address/0xa06AdEA2e981B412561703e8e96C883D7caDc81b)

DrakeInMyFeelings deployed at: [0xD4c1CE14DabfAEdFdBAF2c1499FeA4414cE862C6](https://mumbai.polygonscan.com/address/0xD4c1CE14DabfAEdFdBAF2c1499FeA4414cE862C6)

EminemLoseYourself deployed at: [0x999951BFD435645A2936ce220D78b43D6D096C0F](https://mumbai.polygonscan.com/address/0x999951BFD435645A2936ce220D78b43D6D096C0F)

EminemRapGod deployed at: [0x7BAC355fF73C84A36BFf3f41C623658022FaB921](https://mumbai.polygonscan.com/address/0x7BAC355fF73C84A36BFf3f41C623658022FaB921)

TaylorSwiftBlankSpace deployed at: [0x4752cdD6e2E2fdE9EBeafaAa8aAcF664C65Afe18](https://mumbai.polygonscan.com/address/0x4752cdD6e2E2fdE9EBeafaAa8aAcF664C65Afe18)

TaylorSwiftShakeItOff deployed at: [0x98574c58e10ac5b42E19616F63B3AA3D3F7c2138](https://mumbai.polygonscan.com/address/0x98574c58e10ac5b42E19616F63B3AA3D3F7c2138)

Discussions deployed at: [0x8E81c13B639882e0F76b017Ca5D064D5DA3C81F7](https://mumbai.polygonscan.com/address/0x8E81c13B639882e0F76b017Ca5D064D5DA3C81F7)

## Project Gallery
<p align="center">
<img src="https://github.com/mizanxali/finesse/blob/main/screenshots/ss1.png" alt="drawing" width="700"/>
</p>
<p align="center">
<img src="https://github.com/mizanxali/finesse/blob/main/screenshots/ss2.png" alt="drawing" width="700"/>
</p>
<p align="center">
<img src="https://github.com/mizanxali/finesse/blob/main/screenshots/ss3.png" alt="drawing" width="700"/>
</p>
<p align="center">
<img src="https://github.com/mizanxali/finesse/blob/main/screenshots/ss4.png" alt="drawing" width="700"/>
</p>
<p align="center">
<img src="https://github.com/mizanxali/finesse/blob/main/screenshots/ss5.png" alt="drawing" width="700"/>
</p>

## BUIDL Partners
### Polygon
Finesse is built and deployed on the Polygon Mumbai testnet. All song coins are ERC20 tokens minted on Polygon. All smart contracts including the gasless transactions-compliant contract, are all deployed on Polygon testnet. The Uniswap liquidity pool are also on Polygon and users trade MATIC for the song coins on Finesse.

### Push Protocol
The Platinum Tier on Finesse gives fans access to one-on-one chat messaging with their favourite music artists. This is implemented using Push Chat (@pushprotocol/uiweb@0.2.3) on my frontend.

### NFTPort
The Iron and Bronze Tiers on Finesse allows users to mint special NFTs (a personalised artist NFT for the Iron Tier and an NFT concert ticket for the Bronze tier). I have used BannerBear to generate dynamic images and then used the NFTPort API to conveniently mint them at no cost for the users.

### Biconomy
I implement a decentralised discussion forum for each song on Finesse, using Biconomy gasless transactions. Users can post their thoughts and they are stored on-chain without them having to pay any gas fees for it.

### Livepeer
The Gold Tier on Finesse gives fans access to an exclusive live stream by their favourite music artists. These live streams are done using Livepeer Studio. I have created Stream objects for different artists on the dashboard and embedded Livepeer's video player on my platform so fans can watch the streams right there.

### IPFS
The Silver Tier on Finesse gives fans access to an exclusive unreleased song from their favourite music artist. This song is stored on IPFS using web3.storage. The artist uploads their song audio file and it is then retrieved by the fans.

### Huddle01
The Diamond Tier on Finesse gives fans access to an exclusive one-on-one video call with their favourite music artist. This is implemented using the Huddle01 iFrame and the video calls are embedded right on my platform.
