import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/index';
import MainLoop from 'mainloop.js';

import styled from 'styled-components';
import StylesSanitize from './styles/Sanitize';
import StylesBase from './styles/Base';

import layers from './data/layers';
import * as gameStates from './data/gameStates';
import levels from './data/levels';

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

  setCanvasSize = () => {
    const width = window.innerWidth * 2;
    const height = window.innerHeight * 2;
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

  loadLevel = level => {
    // # ground
    // . air
    // _ surface, y
    // - gentle slope, y[left], y[right]
    // | steep slope, x[top], x[bottom]
    // [ cliff to left, x[base], x[top], y[right]
    // ] cliff to right, y[left], x[top], x[base]
    // v pit, y[level], x, y[depth]
    // ^ hill, y[level], x, y[height]
    // @ landing pad, x
    // / small slope right, x, y
    // \ small slope left, y, x
    // ) small slope high right, x, y
    // ( small slope high left, y, x

    const levels = {
      area1: {
        id: 1,
        name: 'Area One',
        matrix: [
          ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
          ['.', '.', '.', '.', '.', '.', '^A5', '.', '.', '.', '.', '.', '.', '.', '/48', '85', '.', '.', '.', '.'],
          ['-63', ']345', '.', '.', '/57', '-70', '#', ')05', ']534', '.', '.', '/87', '_7', '-72', '(24', '|59', '.', '.', '/27', '_7'],
          ['#', '|58', '.', '[894', '(45', '#', '#', '#', '|47', '.', '.', '|48', '#', '#', '#', ')94', '-46', '_6', '(62', '#'],
          ['#', ')87', 'v73', '(78', '#', '#', '#', '#', ')75', '_5@8', '-52', '(24', '#', '#', '#', '#', '#', '#', '#', '#']
        ],
        width: 20,
        height: 5
      }
    };

    this.props.loadLevel(levels[level]);

    // console.log(levels[level].height, levels[level].width);

    // console.log('Loading: ' + level);
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
    level: state.level
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setGameState: gameState => dispatch(actionCreators.setGameState(gameState)),
    updateInput: (keyCode, value) => dispatch(actionCreators.updateInput(keyCode, value)),
    resetTaps: () => dispatch(actionCreators.resetTaps()),
    loadLevel: level => dispatch(actionCreators.loadLevel(level))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
