import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setprivateKey] = useState("");
  const [signature, setsignature] = useState("");

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function signMessage(msg) {
    const messageHash = hashMessage(msg);

    const signatureObj = secp256k1.sign(messageHash, privateKey);
    const signatureString = JSON.stringify(signatureObj);

    setsignature(signatureString);
  }

  // Generate a random 256-bit private key (64 hex digits)

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
        Enter Your Private Key
        {privateKey}
      </label>
      <label>
        Signature is:
        {signature}
      </label>
      <button onClick={() => signMessage(sendAmount)}>
        Generate Signature
      </button>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
