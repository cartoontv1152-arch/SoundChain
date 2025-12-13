// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IMusicNFT {
    function getTrackInfo(uint256 tokenId)
        external
        view
        returns (
            string memory ipfsHash,
            address artist,
            uint256 royaltyPercentage,
            uint256 pricePerStream,
            uint256 totalStreams
        );
    
    function recordStream(uint256 tokenId) external;
}

contract StreamingPayment is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    IMusicNFT public musicNFT;

    uint256 public platformFee = 500; // 5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(uint256 => uint256) public trackStreamCount;
    mapping(uint256 => uint256) public trackEarnings;
    mapping(address => uint256) public artistEarnings;
    mapping(address => uint256) public artistWithdrawn;

    event StreamPayment(
        uint256 indexed trackId,
        address indexed listener,
        address indexed artist,
        uint256 amount,
        uint256 artistShare,
        uint256 platformShare
    );

    event ArtistWithdrawal(
        address indexed artist,
        uint256 amount
    );

    event PlatformWithdrawal(
        address indexed to,
        uint256 amount
    );

    constructor(address _usdcToken, address _musicNFT) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        musicNFT = IMusicNFT(_musicNFT);
    }

    function payForStream(uint256 trackId, uint256 amount) external nonReentrant {
        (
            ,
            address artist,
            uint256 royaltyPercentage,
            uint256 pricePerStream,
            
        ) = musicNFT.getTrackInfo(trackId);

        require(amount >= pricePerStream, "Insufficient payment");
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        uint256 platformShare = (amount * platformFee) / FEE_DENOMINATOR;
        uint256 artistShare = (amount * royaltyPercentage) / FEE_DENOMINATOR;

        artistEarnings[artist] += artistShare;
        trackEarnings[trackId] += artistShare;
        trackStreamCount[trackId]++;

        musicNFT.recordStream(trackId);

        emit StreamPayment(
            trackId,
            msg.sender,
            artist,
            amount,
            artistShare,
            platformShare
        );
    }

    function withdrawArtistEarnings() external nonReentrant {
        uint256 available = artistEarnings[msg.sender] - artistWithdrawn[msg.sender];
        require(available > 0, "No earnings to withdraw");

        artistWithdrawn[msg.sender] += available;
        require(usdcToken.transfer(msg.sender, available), "Transfer failed");

        emit ArtistWithdrawal(msg.sender, available);
    }

    function getArtistBalance(address artist) external view returns (uint256) {
        return artistEarnings[artist] - artistWithdrawn[artist];
    }

    function getTrackStats(uint256 trackId)
        external
        view
        returns (uint256 streams, uint256 earnings)
    {
        return (trackStreamCount[trackId], trackEarnings[trackId]);
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }

    function withdrawPlatformFees(address to) external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        uint256 artistTotal = 0;
        
        require(balance > artistTotal, "No platform fees available");
        uint256 platformBalance = balance - artistTotal;
        
        require(usdcToken.transfer(to, platformBalance), "Transfer failed");
        emit PlatformWithdrawal(to, platformBalance);
    }

    function setMusicNFT(address _musicNFT) external onlyOwner {
        musicNFT = IMusicNFT(_musicNFT);
    }

    function setUSDC(address _usdcToken) external onlyOwner {
        usdcToken = IERC20(_usdcToken);
    }
}
