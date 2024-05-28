import { useEffect, useState } from 'react';
import { createClient } from 'urql';
import './App.css';

function App() {
  const [assetAmounts, setAssetAmounts] = useState([]);
  const [error, setError] = useState(null); // State for error handling

  const QueryURL= "https://gateway-arbitrum.network.thegraph.com/api/97ef000bb2f2718e81ba066e7570c8be/subgraphs/id/H8PNJMWLiUY5LgCUhhyRP7ddhtZHaADgAiH9jWAzDbjw";

  const client = createClient({
    url: QueryURL
  });

  const query = `{
    assetAmounts(first: 5) {
      id
      asset {
        id
      }
      amount
      price
    }
    sharesBoughtEvents(first: 5) {
      id
      party {
        id
      }
      investmentCost {
        id
      }
      type
    }
  }`

  useEffect(() => {
    const getAssetAmounts = async () => {
      try {
        const { data } = await client.query(query).toPromise();
        console.log(data);
        if (data && data.assetAmounts) {
          setAssetAmounts(data.assetAmounts);
        } else {
          setError('Error: Data structure not as expected.');
        }
      } catch (error) {
        console.error(error);
        setError('Error fetching data.');
      }
    }
    getAssetAmounts();
  }, [client, query]);

  return (
    <>
      <div>
        <h1>AssetAmounts Information</h1>
        {error && <p>{error}</p>}
        {assetAmounts.length > 0 ? (
          assetAmounts.map((assetAmount) => {
            return (
              <div key={assetAmount.id}>
                <div><b>Id: </b>{assetAmount.asset.id}</div>
                <div><b>Amount: </b>{assetAmount.amount}</div>
                <div><b>Price: </b> {assetAmount.price}</div>
                <br></br>
              </div>
            );
          })
        ) : (
          <p>No asset amounts available.</p>
        )}
      </div>
    </>
  );
}

export default App;
