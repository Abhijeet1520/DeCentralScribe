// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenUtils {
    function createTokenId(
        address creator,
        uint256 articleId,
        bool isPaying
    ) public pure returns (uint256) {
        uint256 tokenId = (uint256(uint160(creator)) << 96) + (articleId << 1);
        if (isPaying) {
            tokenId += 1;
        }

        return tokenId;
    }

    // from a token id, returns the creator, the article number for this creator and whether is a paying article or not.
    
    function parseTokenId(
        uint256 tokenId
    ) public pure returns (address, uint256, bool) {
        return (
            address(uint160(tokenId >> 96)),
            uint96(tokenId) >> 1,
            (tokenId << 255) >> 255 == 1
        );
    }

    /// From a token id find the alternate id (switching the "isPaying" bit)
    function findAlternateId(uint256 tokenId) public pure returns (uint256) {
        (address creator, uint articleId, bool isPaying) = parseTokenId(
            tokenId
        );
        return createTokenId(creator, articleId, !isPaying);
    }
}
