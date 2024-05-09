// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BloodBankContract is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct PatientData {
        string ipfsUrl;
        string bloodGroup;
        string medicalHistory;
        // Add other patient data fields as needed
    }

    mapping(address => PatientData) public patientDataMap;
    mapping(uint256 => address) public consultationIdToPatient;

    event PatientDataStored(address patientAddress, string ipfsUrl);
    event ConsultationNFTMinted(uint256 tokenId, address patientAddress);

    constructor() ERC721("BloodBankNFT", "BBN") {}

    function storePatientData(
        string memory _ipfsUrl,
        string memory _bloodGroup,
        string memory _medicalHistory
    ) public {
        patientDataMap[msg.sender] = PatientData(
            _ipfsUrl,
            _bloodGroup,
            _medicalHistory
        );
        emit PatientDataStored(msg.sender, _ipfsUrl);
    }

    function mintConsultationNFT(address _patientAddress) public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(_patientAddress, tokenId);
        consultationIdToPatient[tokenId] = _patientAddress;
        emit ConsultationNFTMinted(tokenId, _patientAddress);
        return tokenId;
    }

    // Add other functions for wallet creation, access control, etc.
}