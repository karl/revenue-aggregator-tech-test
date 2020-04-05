import React, { useEffect, useState } from "react";
import "./App.css";

const createLogger = (name) => {
  const log = (level, message, extra) => {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    if (extra !== undefined) {
      console[level](`[${name}] ${message}`, extra);
    } else {
      console[level](`[${name}] ${message}`);
    }
  };

  return {
    info: (message, extra) => {
      log("info", message, extra);
    },
    warning: (message, extra) => {
      log("warn", message, extra);
    },
    error: (message, extra) => {
      log("error", message, extra);
    },
  };
};

const logger = createLogger("App");

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

const App = () => {
  const [state, setState] = useState({
    uiState: "LOADING",
    sortedProducts: undefined,
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        logger.info("Getting data");
        const results = await Promise.all([
          fetch("./api/branch1.json"),
          fetch("./api/branch2.json"),
          fetch("./api/branch3.json"),
        ]);
        const data = await Promise.all(results.map((result) => result.json()));
        logger.info("Got data", data);

        const products = data.map((branchData) => branchData.products).flat();
        logger.info("Products", products);

        const productsById = {};
        for (var product of products) {
          const existingProduct = productsById[product.id];
          if (existingProduct) {
            productsById[product.id] = {
              ...existingProduct,
              sold: existingProduct.sold + product.sold,
            };
          } else {
            productsById[product.id] = product;
          }
        }
        logger.info("Products by id", productsById);

        const sortedProducts = Object.values(productsById);
        sortedProducts.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        logger.info("Sorted products", sortedProducts);

        sortedProducts.forEach((product) => {
          product.revenue = product.sold * product.unitPrice;
        });

        setState({
          uiState: "READY",
          sortedProducts,
        });
      } catch (error) {
        logger.error("Failed to load products", error);
        setState({
          uiState: "ERROR",
          sortedProducts: undefined,
        });
      }
    };

    getData();
  }, []);

  const filteredProducts =
    state.uiState === "READY"
      ? state.sortedProducts.filter((product) =>
          product.name.toLowerCase().includes(filter.toLowerCase())
        )
      : undefined;

  const total =
    state.uiState === "READY"
      ? filteredProducts.reduce((acc, product) => acc + product.revenue, 0)
      : undefined;

  return (
    <section className="product-list">
      <input
        type="text"
        value={filter}
        onChange={(event) => {
          const newFilter = event.target.value;
          logger.info("Setting filter", newFilter);
          setFilter(newFilter);
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {state.uiState === "LOADING" && (
            <tr>
              <td colSpan="2" className="loading">
                Loading...
              </td>
            </tr>
          )}
          {state.uiState === "ERROR" && (
            <tr>
              <td colSpan="2" className="error">
                Error loading product list
              </td>
            </tr>
          )}
          {state.uiState === "READY" &&
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatNumber(product.revenue)}</td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{state.uiState === "READY" && formatNumber(total)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};

export default App;
