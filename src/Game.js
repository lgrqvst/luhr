import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/index';
import MainLoop from 'mainloop.js';

import styled from 'styled-components';
import StylesSanitize from './styles/Sanitize';
import StylesBase from './styles/Base';

import layers from './data/layers';
import * as gameStates from './data/gameStates';
import { levels, chunkSize } from './data/levels';

import Canvas from './components/Canvas';
import TitleScreen from './components/UI/TitleScreen';
import PauseScreen from './components/UI/PauseScreen';
import GameOverScreen from './components/UI/GameOverScreen';

class Game extends Component {
  constructor(props) {
    super(props);

    for (let layer of layers) {
      this[`${layer.name}CanvasRef`] = React.createRef();
    }

    // this.canvasRef = React.createRef();
  }

  state = {
    width: null,
    height: null
  };

  componentDidMount() {
    this.initialize();
    // If there are generated levels stored in localStorage, get them and put them in the state
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.props.updateInput);
    window.removeEventListener('keyup', this.props.updateInput);
  }

  initialize = () => {
    this.setCanvasSize();
    window.addEventListener('resize', this.handleResize);

    window.addEventListener('keydown', ({ keyCode }) => this.props.updateInput(keyCode, true));
    window.addEventListener('keyup', ({ keyCode }) => this.props.updateInput(keyCode, false));

    MainLoop.setUpdate(this.update)
      .setDraw(this.draw)
      .setEnd(this.end)
      .start();
  };

  updateSize = () => {
    this.setState({
      width: window.innerWidth * 2,
      height: window.innerHeight * 2
    });
  };

  setCanvasSize = () => {
    this.updateSize();
    const width = this.state.width || window.innerWidth * 2;
    const height = this.state.height || window.innerHeight * 2;

    for (let layer of layers) {
      this[`${layer.name}CanvasRef`].current.width = width;
      this[`${layer.name}CanvasRef`].current.height = height;
      this[`${layer.name}RenderingContext`] = this[`${layer.name}CanvasRef`].current.getContext('2d');
    }

    // this.canvasRef.current.width = width;
    // this.canvasRef.current.height = height;
    // this.stage = this.canvasRef.current.getContext('2d');
  };

  handleResize = () => {
    this.setCanvasSize();
  };

  startGame = () => {
    this.props.setGameState(gameStates.RUNNING);
    this.loadLevel('area1');
  };

  pauseGame = () => {
    this.props.setGameState(gameStates.PAUSED);
  };

  resumeGame = () => {
    this.props.setGameState(gameStates.RUNNING);
  };

  endGame = () => {
    this.props.setGameState(gameStates.OVER);
  };

  loadLevel = levelId => {
    const level = levels[levelId];
    const { matrix } = level;

    this.props.loadLevel(level);

    // Get the chunk with the landing pad
    // Check the location of the landing pad in that chunk
    // Calculate how that chunk is positioned relative to the screen if the ship is in the middle
    // Calculate how many chunks need to be drawn to the left, right, top and bottom
    // Generate chunks
    // Add chunks to stage

    const chunkHome = matrix[level.start.y][level.start.x].split('');
    const padX = chunkHome[chunkHome.indexOf('@') + 1];
    console.log(padX);
  };

  unloadLevel = () => {};

  initializePlayer = () => {};

  update = delta => {
    const { pressed } = this.props.input;
    const { tapped } = this.props.input;
    const { gameState } = this.props;

    /*
     * TITLE
     */

    if (gameState.current === gameStates.TITLE && tapped.enter) {
      this.props.resetTaps();
      this.startGame();
    }

    /*
     * RUNNING
     */

    if (gameState.current === gameStates.RUNNING) {
      // Update all the stuff
      if (tapped.esc) {
        this.props.resetTaps();
        this.pauseGame();
      }
    }

    /*
     * PAUSED
     */

    if (gameState.current === gameStates.PAUSED) {
      if (tapped.enter || tapped.esc) {
        this.props.resetTaps();
        this.resumeGame();
      }
    }

    /*
     * OVER
     */

    if (gameState.current === gameStates.OVER) {
      //Game over, friendo. Play again?
    }

    /*
     * FINISH UP
     */

    if (tapped.enter || tapped.esc) {
      this.props.resetTaps();
    }
  };

  draw = () => {
    // Draw out everything that's in the stage array
    const ctx = this.gameRenderingContext;
    const { width, height } = this.state;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    if (this.props.gameState.current === gameStates.RUNNING) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width / 20, 0, Math.PI * 2);
      ctx.fillStyle = '#222222';
      ctx.fill();
    }
  };

  end = () => {};

  render() {
    const { gameState } = this.props;
    const canvas = layers.map(layer => <Canvas key={layer.name} ref={this[`${layer.name}CanvasRef`]} depth={layer.depth} />);

    // const canvas = <Canvas key="canvas" ref={this.canvasRef} depth={1} />;

    return (
      <>
        <StylesSanitize />
        <StylesBase />
        <GameContainer>
          <TitleScreen show={gameState.current === gameStates.TITLE} />
          <PauseScreen show={gameState.current === gameStates.PAUSED} />
          <GameOverScreen show={gameState.current === gameStates.OVER} />
          {canvas}
        </GameContainer>
      </>
    );
  }
}

const GameContainer = styled.div``;

const mapStateToProps = state => {
  return {
    gameState: state.gameState,
    previousGameState: state.previousGameState,
    input: state.input,
    level: state.level,
    stage: state.stage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setGameState: gameState => dispatch(actionCreators.setGameState(gameState)),
    updateInput: (keyCode, value) => dispatch(actionCreators.updateInput(keyCode, value)),
    resetTaps: () => dispatch(actionCreators.resetTaps()),
    loadLevel: level => dispatch(actionCreators.loadLevel(level)),
    addChunk: chunk => dispatch(actionCreators.addChunk(chunk)),
    discardChunk: id => dispatch(actionCreators.discardChunk(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
