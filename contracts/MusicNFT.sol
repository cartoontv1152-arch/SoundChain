// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct TrackInfo {
        string ipfsHash;
        address artist;
        uint256 royaltyPercentage;
        uint256 pricePerStream;
        uint256 totalStreams;
        uint256 createdAt;
    }

    mapping(uint256 => TrackInfo) public tracks;
    mapping(address => uint256[]) public artistTracks;

    uint256 public constant MAX_ROYALTY = 9500; // 95%
    uint256 public constant MIN_ROYALTY = 5000; // 50%

    event TrackMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string ipfsHash,
        uint256 royaltyPercentage
    );

    event StreamRecorded(
        uint256 indexed tokenId,
        address indexed listener,
        uint256 payment
    );

    constructor() ERC721("SoundChain Music", "SCM") Ownable(msg.sender) {}

    function mint(
        address to,
        string memory ipfsHash,
        uint256 royaltyPercentage,
        uint256 pricePerStream
    ) public returns (uint256) {
        require(
            royaltyPercentage >= MIN_ROYALTY && royaltyPercentage <= MAX_ROYALTY,
            "Royalty must be between 50% and 95%"
        );

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, string(abi.encodePacked("ipfs://", ipfsHash)));

        tracks[newTokenId] = TrackInfo({
            ipfsHash: ipfsHash,
            artist: to,
            royaltyPercentage: royaltyPercentage,
            pricePerStream: pricePerStream,
            totalStreams: 0,
            createdAt: block.timestamp
        });

        artistTracks[to].push(newTokenId);

        emit TrackMinted(newTokenId, to, ipfsHash, royaltyPercentage);

        return newTokenId;
    }

    function getTrackInfo(uint256 tokenId)
        public
        view
        returns (
            string memory ipfsHash,
            address artist,
            uint256 royaltyPercentage,
            uint256 pricePerStream,
            uint256 totalStreams
        )
    {
        require(_exists(tokenId), "Track does not exist");
        TrackInfo memory track = tracks[tokenId];
        return (
            track.ipfsHash,
            track.artist,
            track.royaltyPercentage,
            track.pricePerStream,
            track.totalStreams
        );
    }

    function getArtistTracks(address artist)
        public
        view
        returns (uint256[] memory)
    {
        return artistTracks[artist];
    }

    function recordStream(uint256 tokenId) external {
        require(_exists(tokenId), "Track does not exist");
        tracks[tokenId].totalStreams++;
    }

    function updatePricePerStream(uint256 tokenId, uint256 newPrice) external {
        require(_exists(tokenId), "Track does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "Only track owner can update price"
        );
        tracks[tokenId].pricePerStream = newPrice;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
