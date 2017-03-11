import React, { Component } from 'react';

class TextWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshIntervalId: undefined,
    };
  }
  // milliseconds (x)
  // data (y)
  componentDidMount() {
    const refreshIntervalId = setInterval(() => {
//      this.state.data.datasets[1].data.shift();
  //    this.state.data.datasets[1].data.push(getRandomInt(0, 90));
      fetch('https://ariot.thuc.cloud/log?limit=10')
        .then(response => {
          response.json().then(array => {
            const newArray = array.map((entry) => {
              return {median: entry[entry.length - 1].data, title: entry[entry.length - 1].title};
            });
            this.setState({data: newArray, refreshIntervalId});
          });
        });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }

  render() {
    const data = this.state.data;
    if (data.length === 0) {
      return  <div className="data-label"><span>No log data found</span></div>;
    }
    const rows = data.map((r, index) => (
      <tr key={index}>
        <td>
          {r.title}
        </td>
        <td>
          {r.median}
        </td>
      </tr>
    ));
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>
              Sensor type
            </th>
            <th>
              Last level recieved
            </th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
       </table>
    );
  }
}

export default TextWidget;
