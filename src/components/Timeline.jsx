import React, { PropTypes } from 'react';
import AudioTitleTime from './AudioTitleTime';
import ProgressBar from './ProgressBar';
import ProgressBarHandler from './ProgressBarHandler';
import style from '../styles/audioElements.css';

class Timeline extends React.Component {
  static propTypes = {
    appWidth: PropTypes.number,
    duration: PropTypes.number.isRequired
  };
  static defaultProps = {
    appWidth: 0
  };
  constructor(props) {
    super(props);
    this.state = {
      barWidth: props.appWidth / 2,
      translate: 0
    };
    this.holding = false;
    this.shouldTogglePlayPause = this.props.playing;
    this.onmousemoveSaver = null;
    this.onmouseupSaver = null;
    this.changeTranslate = this.changeTranslate.bind(this);
    this._onMouseDownProgressBar = this._onMouseDownProgressBar.bind(this);
    this._onMouseDownProgressBarHandler = this._onMouseDownProgressBarHandler.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.duration !== 0 && !this.holding) {
      const lengthPerSecond = this.state.barWidth / nextProps.duration;
      const length = nextProps.progress * lengthPerSecond;
      this.changeTranslate(length);
      this.shouldTogglePlayPause = nextProps.playing;
    }
  }
  _onMouseDownProgressBar(e) {
    e.stopPropagation();
    console.log('Timeline: _onMouseDownProgressBar');
    if (this.shouldTogglePlayPause) { this.props.togglePlayPause(); }
    const timelineDisToLeft = e.target.parentNode.getBoundingClientRect().left;
    const newTranslate = e.pageX - timelineDisToLeft;
    this.changeTranslate(newTranslate);
    this.holding = true;
    if (document.onmousemove) { this.onmousemoveSaver = document.onmousemove; }
    if (document.onmouseup) { this.onmouseupSaver = document.onmouseup; }
    document.onmousemove = this._onMouseMove(e.pageX, newTranslate);
    document.onmouseup = this._onMouseUp;
  }
  _onMouseDownProgressBarHandler(e) {
    e.stopPropagation();
    this.holding = true;
    if (this.shouldTogglePlayPause) { this.props.togglePlayPause(); }
    if (document.onmousemove) { this.onmousemoveSaver = document.onmousemove; }
    if (document.onmouseup) { this.onmouseupSaver = document.onmouseup; }
    document.onmousemove = this._onMouseMove(e.pageX, this.state.translate);
    document.onmouseup = this._onMouseUp;
  }
  _onMouseMove(mouseDownX, startTranslate) {
    return (event) => {
      if (this.holding) {
        const translate = (event.pageX - mouseDownX) + startTranslate;
        this.changeTranslate(translate);
      }
    };
  }
  _onMouseUp() {
    console.log('Timeline: _onMouseUp()');
    /* When the _onMouseUp() event happen really quick after the _onMouseDownProgressBar(),
       i.e. React hasn't called setState, enqueue a togglePlayPause() to the loop. */
    if (this.shouldTogglePlayPause && this.props.playing) { setTimeout(() => this.props.togglePlayPause(), 0); }
    // Normally, when this.shouldTogglePlayPause is true, this.props.playing should be false, except the case above.
    if (this.shouldTogglePlayPause && !this.props.playing) { this.props.togglePlayPause(); }
    document.onmousemove = this.onmousemoveSaver;
    document.onmouseup = this.onmouseupSaver;
    this.holding = false;
    this.props.setProgress((this.state.translate / this.state.barWidth) * this.props.duration);
  }
  changeTranslate(newTranslate) {
    let translate = newTranslate;
    const max = this.state.barWidth;
    if (translate < 0) { translate = 0; }
    if (translate > max) { translate = max; }
    this.setState({ translate });
  }
  render() {
    const handlerLength = 12;
    const containerWidth = this.state.barWidth + handlerLength;
    const barHeight = 4;
    return (
      <div className={style.timeLine} style={{ width: containerWidth }}>
        <AudioTitleTime
          title={this.props.title}
          progress={(this.state.translate / this.state.barWidth) * this.props.duration}
          duration={this.props.duration}
        />
        <ProgressBar
          width={containerWidth}
          height={handlerLength}
          barWidth={this.state.barWidth}
          barHeight={barHeight}
          translate={this.state.translate}
          onMouseDown={this._onMouseDownProgressBar}
        >
          <ProgressBarHandler
            length={handlerLength}
            translate={`translate(${this.state.translate})`}
            onMouseDown={this._onMouseDownProgressBarHandler}
          />
        </ProgressBar>
      </div>
    );
  }
  componentDidMount() {
    if (this.state.barWidth === 0) {
      this.setState({
        barWidth: Math.round(document.querySelector(`.${style.timeLine}`).parentNode.getBoundingClientRect().width / 2)
      });
    }
  }
}

export default Timeline;