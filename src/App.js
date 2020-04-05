import React, { Component } from "react";
import "./App.css";

// const formatNumber = (number) =>
//   new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

class App extends Component {
  render() {
    return (
      <section className="product-list">
        <input type="text" />
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </section>
    );
  }
}

export default App;
