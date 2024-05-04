// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DonationAggregator.sol";
import "./AccessControl.sol";
import "./IdTracker.sol";
import "./TokenUtils.sol";

contract DeCentralScribe is ERC1155, Ownable, DonationAggregator, IdTracker, TokenUtils, AccessControl {
    uint256 constant MAX_ARTICLE_ID = 1 << (96 - 1);

    uint256 public mintPrice;
    address public tokenReceiver; // the address that can call mintErc20

    struct ArticleMetadata {
        string title;
        string imageURL;
        string description;
        string[] attributes;
    }

    mapping(uint256 => ArticleMetadata) public articleMetadata;

    mapping(uint => bool) public tokensTracker;

    event ArticleMinted(address indexed creator, uint256 indexed articleId, uint256 tokenId);

    constructor(
        address initialOwner,
        address accessController,
        address _tokenReceiver,
        uint256 _mintPrice,
        string memory uri_
    )
        ERC1155(uri_)
        Ownable(initialOwner)
        AccessControl(accessController)
    {
        tokenReceiver = _tokenReceiver;
        mintPrice = _mintPrice;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintErc20(
        address minter,
        uint256 tokenId,
        uint256 paymentAmount,
        string memory title,
        string memory imageURL,
        string memory description,
        string[] memory attributes
    ) external {
        require(accessStatusTracker[minter] == AccessStatus.Authorized, "Minter not authorized");

        (address creator, uint articleId, bool isPaying) = parseTokenId(tokenId);

        if (creator == minter) {
            require(isValidId(creator, articleId), "Invalid article ID to mint");
            incrementTrackedId(creator);
            tokensTracker[tokenId] = true;
            _mint(minter, tokenId, 1, new bytes(0));
            articleMetadata[tokenId] = ArticleMetadata(title, imageURL, description, attributes);
            emit ArticleMinted(minter, articleId, tokenId);
        } else {
            require(idTracker[creator] > 0, "No articles by this author");
            require(articleId < idTracker[creator], "Invalid article ID");

            require(tokensTracker[tokenId], "Token ID does not exist");

            if (isPaying) {
                require(paymentAmount == mintPrice, "Invalid payment amount");
                aggregated[creator] += paymentAmount;
                _mint(minter, tokenId, 1, new bytes(0));
                emit ArticleMinted(minter, articleId, tokenId);
            } else {
                aggregated[creator] += paymentAmount;
                _mint(minter, tokenId, 1, new bytes(0));
                emit ArticleMinted(minter, articleId, tokenId);
            }
        }
    }

    function withdraw() public {
        uint256 amount = aggregated[msg.sender];
        require(amount > 0, "No funds to withdraw");
        _withdraw(msg.sender, amount, tokenReceiver);
    }
}
