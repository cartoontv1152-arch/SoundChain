// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SoundChainV2 - All-in-one music platform contract
/// @notice Handles track registration, play tracking, tipping, and leaderboard
contract SoundChainV2 {
    struct TrackInfo {
        string trackId;
        address artist;
        uint256 totalPlays;
        uint256 totalTips;
        uint256 createdAt;
        bool exists;
    }

    struct ArtistInfo {
        uint256 totalEarnings;
        uint256 totalPlays;
        uint256 trackCount;
        uint256 tipCount;
        bool exists;
    }

    mapping(string => TrackInfo) public tracks;
    mapping(address => ArtistInfo) public artists;
    mapping(address => mapping(string => bool)) public hasPlayed;
    
    string[] public allTrackIds;
    address[] public allArtists;

    address public owner;

    event TrackRegistered(string trackId, address indexed artist);
    event PlayRecorded(string trackId, address indexed listener, uint256 newPlayCount);
    event TipSent(string trackId, address indexed tipper, address indexed artist, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerTrack(string calldata trackId, address artist) external {
        require(!tracks[trackId].exists, "Track already registered");
        require(artist != address(0), "Invalid artist address");

        tracks[trackId] = TrackInfo({
            trackId: trackId,
            artist: artist,
            totalPlays: 0,
            totalTips: 0,
            createdAt: block.timestamp,
            exists: true
        });

        allTrackIds.push(trackId);

        if (!artists[artist].exists) {
            artists[artist] = ArtistInfo({
                totalEarnings: 0,
                totalPlays: 0,
                trackCount: 0,
                tipCount: 0,
                exists: true
            });
            allArtists.push(artist);
        }
        artists[artist].trackCount++;

        emit TrackRegistered(trackId, artist);
    }

    function recordPlay(string calldata trackId) external {
        require(tracks[trackId].exists, "Track not registered");
        
        tracks[trackId].totalPlays++;
        artists[tracks[trackId].artist].totalPlays++;

        if (!hasPlayed[msg.sender][trackId]) {
            hasPlayed[msg.sender][trackId] = true;
        }

        emit PlayRecorded(trackId, msg.sender, tracks[trackId].totalPlays);
    }

    function tipArtist(string calldata trackId) external payable {
        require(tracks[trackId].exists, "Track not registered");
        require(msg.value > 0, "Tip must be > 0");

        address artist = tracks[trackId].artist;
        
        tracks[trackId].totalTips += msg.value;
        artists[artist].totalEarnings += msg.value;
        artists[artist].tipCount++;

        (bool success, ) = payable(artist).call{value: msg.value}("");
        require(success, "Transfer failed");

        emit TipSent(trackId, msg.sender, artist, msg.value);
    }

    function getTrack(string calldata trackId) external view returns (
        address artist,
        uint256 totalPlays,
        uint256 totalTips,
        uint256 createdAt
    ) {
        require(tracks[trackId].exists, "Track not registered");
        TrackInfo storage t = tracks[trackId];
        return (t.artist, t.totalPlays, t.totalTips, t.createdAt);
    }

    function getArtist(address artist) external view returns (
        uint256 totalEarnings,
        uint256 totalPlays,
        uint256 trackCount,
        uint256 tipCount
    ) {
        ArtistInfo storage a = artists[artist];
        return (a.totalEarnings, a.totalPlays, a.trackCount, a.tipCount);
    }

    function getTotalTracks() external view returns (uint256) {
        return allTrackIds.length;
    }

    function getTotalArtists() external view returns (uint256) {
        return allArtists.length;
    }

    function getTrackIds(uint256 offset, uint256 limit) external view returns (string[] memory) {
        uint256 end = offset + limit;
        if (end > allTrackIds.length) {
            end = allTrackIds.length;
        }
        if (offset >= allTrackIds.length) {
            return new string[](0);
        }
        
        string[] memory result = new string[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = allTrackIds[i];
        }
        return result;
    }

    function checkPlayed(address user, string calldata trackId) external view returns (bool) {
        return hasPlayed[user][trackId];
    }

    function getAllArtists() external view returns (address[] memory) {
        return allArtists;
    }
}
