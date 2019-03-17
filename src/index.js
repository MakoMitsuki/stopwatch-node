import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    
    ["lap", "updateTime", "reset", "toggle"].forEach((method) => {
    	this[method] = this[method].bind(this);
    });

    this.state = this.init = {
      running: false,
      lapTimes: [],
      timeElapsed: 0,
      stoppedAt: 0,
      startClass: 'start',
      lapClass: 'reset'
    };
  }
  
  // start and stop button onClick handler
  toggle() {
    this.setState({running: !this.state.running}, () => {
      this.state.running ? this.startTimer() : this.stopTimer();
    });
  }

  lap() {
    this.setState({lapTimes: this.state.lapTimes.concat(this.state.timeElapsed)});
  }

  reset() {
    clearTimeout(this.timer);
    this.setState(this.init);
  }
  
  stopTimer() {
    clearTimeout(this.timer);
    this.setState({
      stoppedAt: this.state.timeElapsed,
      startClass: 'start',
      lapClass: 'reset'
    });
  }

  startTimer() {
    // sets the start time of the clock to the time of button press
    this.startTime = Date.now();
    // sets timer interval to 10 milliseconds
    this.timer = setTimeout(this.updateTime, 10);
    // toggle class state
    this.setState({
      startClass: 'stop',
      lapClass: 'lap'
    });
  }
  
  // calculates and updates the current stopwatch time
  updateTime() {
    var ideal = Date.now() - this.startTime;
    this.setState({timeElapsed: ideal + this.state.stoppedAt});
    
    // adjust the timeout to account for delays due to setTimeout
    var realTime = this.state.timeElapsed - this.state.stoppedAt;
    var diff = ideal - realTime;
    this.timer = setTimeout(this.updateTime, 10 - diff);
  }

  render() {
    return (
      <div>
        <div className = "time"><Time id="timer" timeElapsed={this.state.timeElapsed} /></div>
        <button onClick={this.toggle} className={this.state.startClass}>{this.state.startClass}</button>
        <button onClick={this.state.running ? this.lap : this.reset}
	    disabled={!this.state.running && !this.state.timeElapsed}
	    className={this.state.lapClass}>
          {this.state.lapClass}
        </button>
        {this.state.lapTimes.length > 0 && <LapTimes lapTimes={this.state.lapTimes} />}
      </div>
    );
  }
}

class Time extends React.Component {
  // prepends a zero to single digit numbers
  formatTime(n) {
    if ((n + '').length > 2) {
	return n;
    }
    const padding = new Array(2).join('0');
    return (padding + n).slice(-2);
  };
  
  // parses the timeElapsed into hh:mm:hr:ss.ms
  getUnits() {
    const seconds = this.props.timeElapsed / 1000;
    var hr = Math.floor(seconds / 3600).toString();
    var min = Math.floor(seconds / 60).toString();
    var sec = Math.floor(seconds % 60).toString();
    var msec = (seconds % 1).toFixed(2).substring(2);
    
    return this.formatTime(hr) + ":" + this.formatTime(min) + ":" + this.formatTime(sec) + "." + msec;
  }
  
  // output time
  render() {
    return (
      <div id={this.props.id}>{this.getUnits()}</div>
    );
  }
}

class LapTimes extends React.Component { 
  render() {
    // fetches the laptimes list and outputs them into a list
    const rows = this.props.lapTimes.map((lapTime, index) =>
      <li key={++index} className = "laptime"><Time timeElapsed={lapTime} /></li>
    );
    
    return (
      <div id="lap-times" className = "laptime">
        <ol>{rows}</ol>
      </div>
    );
  }
}

// render DOM
ReactDOM.render(
  <Stopwatch />,
  document.getElementById('root')
);
