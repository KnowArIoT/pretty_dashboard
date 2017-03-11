import React, { Component } from 'react';
import Dashboard, { addWidget } from 'react-dazzle';

// App components
import Header from './Header';
import EditBar from './EditBar';
import Container from './Container';
import AddWidgetDialog from './AddWidgetDialog';
import CustomFrame from './CustomFrame';

// Widgets of the dashboard.
import BarChart from './widgets/BarChart';
import LineChart from './widgets/LineChart';
import U2LineChart from './widgets/U2LineChart';

import DoughnutChart from './widgets/DoughnutChart';
import AriotGoogleMaps from './widgets/AriotGoogleMaps';
// We are using bootstrap as the UI library
import 'bootstrap/dist/css/bootstrap.css';

// Default styes of dazzle.
import 'react-dazzle/lib/style/style.css';

// Our styles
import '../styles/custom.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Widgets that are available in the dashboard
      widgets: {
        EngineTelemetricsWidget: {
          type: BarChart,
          title: 'Engine',
        },
        PerformanceWidget: {
          type: DoughnutChart,
          title: 'Pollution right now',
        },
        UltraSound1: {
          type: LineChart,
          title: 'Ultrasound 1 graph. Distance to the ground on the y axis and a sample of a second on the x axis',
        },
        UltraSound2: {
          type: U2LineChart,
          title: 'Ultrasound 2 graph. Distance to the ground on the y axis and a sample of a second on the x axis',
        },
        CarPositions: {
          type: AriotGoogleMaps,
          title: 'Plots over recent pit holes found near you.',
        },
      },
      // Layout of the dashboard
      layout: {
        rows: [{
          columns: [{
            className: 'col-md-12 col-sm-12 col-xs-12',
            widgets: [{key: 'UltraSound1'}],
          }],
        },
        {
          columns: [{
            className: 'col-md-12 col-sm-12 col-xs-12',
            widgets: [{key: 'UltraSound2'}],
          }],
        },
        {
          columns: [
            {
              className: 'col-md-6 col-sm-6 col-xs-6',
              widgets: [{key: 'CarPositions'}],
            },
            {
              className: 'col-md-6 col-sm-6 col-xs-6',
              widgets: [{key: 'PerformanceWidget'}],
            },
            {
              className: 'col-md-6 col-sm-6 col-xs-6',
              widgets: [{key: 'PerformanceWidget'}],
            },
          ],
        }],
      },
      editMode: false,
      isModalOpen: false,
      addWidgetOptions: null,
    };
  }

  /**
   * When a widget is removed, the layout should be set again.
   */
  onRemove = (layout) => {
    this.setState({
      layout: layout,
    });
  }

  /**
   * Adds new widgget.
   */
  onAdd = (layout, rowIndex, columnIndex) => {
    // Open the AddWidget dialog by seting the 'isModalOpen' to true.
    // Also preserve the details such as the layout, rowIndex, and columnIndex  in 'addWidgetOptions'.
    //  This will be used later when user picks a widget to add.
    this.setState({
      isModalOpen: true,
      addWidgetOptions: {
        layout,
        rowIndex,
        columnIndex,
      },
    });
  }

  /**
   * When a widget moved, this will be called. Layout should be given back.
   */
  onMove = (layout) => {
    this.setState({
      layout: layout,
    });
  }

  /**
   * This will be called when user tries to close the modal dialog.
   */
  onRequestClose = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    return (
    <Container>
      <AddWidgetDialog widgets={this.state.widgets} isModalOpen={this.state.isModalOpen} onRequestClose={this.onRequestClose} onWidgetSelect={this.handleWidgetSelection}/>
      <Header />
      <EditBar onEdit={this.toggleEdit} />
      <Dashboard
        frameComponent={CustomFrame}
        onRemove={this.onRemove}
        layout={this.state.layout}
        widgets={this.state.widgets}
        editable={this.state.editMode}
        onAdd={this.onAdd}
        onMove={this.onMove}
        addWidgetComponentText="Add New Widget"
        />

    </Container>
    );
  }

  /**
   * Toggeles edit mode in dashboard.
   */
  toggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode,
    });
  };

  /**
   * When user selects a widget from the modal dialog, this will be called.
   * By calling the 'addWidget' method, the widget could be added to the previous requested location.
   */
  handleWidgetSelection = (widgetName) => {
    const {layout, rowIndex, columnIndex} = this.state.addWidgetOptions;

    /**
     * 'AddWidget' method gives you the new layout.
     */
    this.setState({
      layout: addWidget(layout, rowIndex, columnIndex, widgetName),
    });

    // Close the dialogbox
    this.onRequestClose();
  }
}

export default App;
