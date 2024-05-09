import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ipfsClient from 'ipfs-http-client';
import BloodBankContract from '../artifacts/contracts/BloodBankContract.sol/BloodBankContract.json';

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const contractAddress = "YOUR_CONTRACT_ADDRESS";

interface BloodBankProps {}

const Home: React.FC<BloodBankProps> = () => {
  const [account, setAccount] = useState<string>('');
  const [patientData, setPatientData] = useState<string>('');
  const [ipfsUrl, setIpfsUrl] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');

  useEffect(() => {
    initEthereum();
  }, []);

  const initEthereum = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BloodBankContract.abi,
        signer
      );
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      // Listen for PatientDataStored event
      contract.on("PatientDataStored", (patientAddress: string, url: string) => {
        if (patientAddress === accounts[0]) {
          setIpfsUrl(url);
          // Fetch patient data from IPFS
        }
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const added = await ipfs.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setIpfsUrl(url);
    }
  };

  const storePatientData = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BloodBankContract.abi,
        signer
      );
      await contract.storePatientData(ipfsUrl, bloodGroup, medicalHistory);
    }
  };

  return (
    <div>
      <h1>Blood Bank Management System</h1>
      <p>Connected account: {account}</p>
      <input type="file" onChange={handleUpload} />
      <input
        type="text"
        placeholder="Blood Group"
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
      />
      <input
        type="text"
        placeholder="Medical History"
        value={medicalHistory}
        onChange={(e) => setMedicalHistory(e.target.value)}
      />
      <button onClick={storePatientData}>Store Patient Data</button>
      {ipfsUrl && <p>IPFS URL: {ipfsUrl}</p>}
    </div>
  );
};

export default Home;