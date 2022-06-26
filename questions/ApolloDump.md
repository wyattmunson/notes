// THE OKAYEST PATTERN
// useEffect(() => {
// (async () => {
// const { loading, error, data } = await useQuery(ORDER_QUERY, {
// variables: { id: uuid },
// });
// console.log('DATA GOT', data);
// })();
// }, []);

// THE GOOD ONE
// const [data, loading, error] = useApollo('QUERY_ORDER', '5d5c57bd-c14a-4d5e-9f79-1f094ec2a27a');

// if (loading) return <h1>Fetching...</h1>;

// if (!data) return <h1>No data yet, but not fetching...</h1>;

/////////////

    // const setOrderPayload = useStoreActions((actions) => actions.form.setOrderPayload);

// const { loading, error, data } = useQuery(queries.ORDER_QUERY, {
// variables: { id: uuid },
// });
// console.log(data);
// console.log('ERROR IS', error);

// setOrderPayload(data?.order);
// const getOrderById = useStoreActions((actions) => actions.form.getOrderById);

// const { orderId, order } = useStoreState((state) => state.form);

// useEffect(() => {
// getOrderById('5d5c57bd-c14a-4d5e-9f79-1f094ec2a27a');
// });

// console.log('ORID', orderId, 'ORD', order);

## Dubious Custom Hook for Apollo

```js
import { ORDER_QUERY } from "../apollo";
import { useState, useEffect } from "react";
import client from "../apollo";

const useApollo = (query: any, payload: any) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const queryString = getQueryString(query);
  if (!queryString) setError(true);

  useEffect(() => {
    const caller = async () => {
      setLoading(true);
      await client
        .query({
          query: queryString,
          variables: { id: "5d5c57bd-c14a-4d5e-9f79-1f094ec2a27a" },
        })
        .then((res) => {
          //   setData(res);
          console.log("SUCCESS", res);
        })
        .catch((err) => {
          setError(true);
          console.log("ERROR", err);
        });
      setLoading(false);
    };
    caller();
  }, []);

  return [data, loading, error];
};

const getQueryString = (query: string) => {
  switch (query) {
    case "QUERY_ORDER":
      return ORDER_QUERY;
    default:
      return ORDER_QUERY;
  }
};

export default useApollo;
```
