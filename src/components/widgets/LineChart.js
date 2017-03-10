import React, { Component } from 'react';
import { Line } from 'react-chartjs';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        labels: [],
        datasets: [
          {
            label: 'line',
            fillColor: '#038e42',
            strokeColor: '#038e42',
            pointColor: '#038e42',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: [],
            scales: {
              xAxes: [{
                type: 'time',
              }],
            },
          },
        ],
      },
    };
  }
  // milliseconds (x)
  // data (y)
  componentDidMount() {
    const refreshIntervalId = setInterval(() => {
//      this.state.data.datasets[1].data.shift();
  //    this.state.data.datasets[1].data.push(getRandomInt(0, 90));
      fetch('https://ariot.thuc.cloud/data/u1?count=10')
        .then(response => {
          response.json().then(array => {
            const sortedOnX = array.sort((a, b) => a.miliseconds - b.miliseconds);
            const labels = sortedOnX.map(a => a.miliseconds);
            const yaxis = sortedOnX.map(a => {
              return a.data;
            });
            const datasets = this.state.data.datasets;
            datasets[0] = {...datasets[0], data: yaxis};

            this.setState({data: {...this.state.date, labels, datasets}, refreshIntervalId});
          });
        });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }

  render() {
    console.log(this.state.data.datasets[0]);
    return (
      <div >
         <Line data={this.state.data} options={{responsive: true }} height="210" width="800"/>
       </div>
    );
  }
}

export default LineChart;
