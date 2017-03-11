import React from 'react';
import { Doughnut } from 'react-chartjs-2';

class DoughnutChart extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          value: 50,
          color: '#F7464A',
          highlight: '#FF5A5E',
          label: 'Red',
        },
        {
          value: 50,
          color: '#00A840',
          highlight: '#00A840',
          label: 'Green',
        },
      ],
    };
  }

  componentDidMount() {
    const refreshIntervalId  = setInterval(() => {
      fetch('https://ariot.thuc.cloud/data/gas?count=10')
        .then(response => {
          response.json().then(array => {
            const allData = array.map(a => a.data);
            const medianGasLevel = allData.reduce((a, b) => a + b, 0) / allData.length;
            const oldValues = this.state.data;
            oldValues[0].value = medianGasLevel;
            oldValues[1].value = 1023 - medianGasLevel;
            this.setState({data: oldValues});
          });
        });
      this.setState({
        data: this.state.data,
        refreshIntervalId,
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }

  render() {
    return (
      <div className="polution">
         <Doughnut data={this.state.data} options={{ animationEasing: 'easeInSine', showTooltips: true }} height={200} width={350}/>
          <span>{`Current polution level (red) is ${this.state.data[0].value} of 1023`}</span>

       </div>
    );
  }
}

export default DoughnutChart;
