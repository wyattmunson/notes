// REACT

/**
 * USE EFFECT with ASYNC CALL
 */

const [data, setData] = useState({ hits: [] });

useEffect(() => {
  const fetchData = async () => {
    const result = await axios("https://.com");

    setData(result.data);
  };

  fetchData();
}, []);

/**
 * IIFE
 */
(() => {
  console.log("HELLO THERE ");
})();
