import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionTypes';
import styled from 'styled-components';
import MainLoop from 'mainloop.js';
import StylesSanitize from './styles/Sanitize';
import StylesBase from './styles/Base';

import * as gameStates from './data/gameStates';

import Canvas from './components/Canvas';
import InputManager from './components/InputManager';

import TitleScreen from './UI/TitleScreen';
import PauseScreen from './UI/PauseScreen';
import GameOverScreen from './UI/GameOverScreen';

// import layers from './data/layers';
// import * as GameStates from './data/gameStates';

class Game extends Component {
  constructor(props) {
    super(props);

    for (let layer of this.props.layers) {
      this[`${layer.name}CanvasRef`] = React.createRef();
    }
  }

  state = {
    input: new InputManager()
  };

  componentDidMount() {
    this.initialize();
  }

  componentWillUnmount() {
    window.RemoveEventListener('resize', this.handleResize);
    this.state.input.unsubscribe();
  }

  initialize = () => {
    this.setCanvasSize();
    this.state.input.subscribe();
    window.addEventListener('resize', this.handleResize);

    MainLoop.setUpdate(this.update)
      .setDraw(this.draw)
      .setEnd(this.end)
      .start();
  };

  setCanvasSize = () => {
    const width = window.innerWidth * 2;
    const height = window.innerHeight * 2;
    for (let layer of this.props.layers) {
      this[`${layer.name}CanvasRef`].current.width = width;
      this[`${layer.name}CanvasRef`].current.height = height;
      this[`${layer.name}RenderingContext`] = this[
        `${layer.name}CanvasRef`
      ].current.getContext('2d');
    }
  };

  handleResize = () => {
    this.setCanvasSize();
  };

  startGame = () => {
    this.props.setGameState(gameStates.RUNNING);
    // Load a level and initialize player
  };

  pauseGame = () => {
    this.props.setGameState(gameStates.PAUSED);
  };

  resumeGame = () => {
    this.props.setGameState(gameStates.RUNNING);
  };

  endGame = () => {};

  loadLevel = level => {
    console.log('Loading: ' + level);
  };

  resetTaps = () => {
    return this.state.input.resetTaps();
  };

  update = delta => {
    // console.log(this.state.input.tappedKeys);
    // console.log(this.props.gameState);

    // let keys = this.state.input.pressedKeys;
    let taps = this.state.input.tappedKeys;

    /*
     * TITLE
     */

    if (this.props.gameState === gameStates.TITLE && taps.enter) {
      taps = this.resetTaps();
      this.startGame();
    }

    /*
     * RUNNING
     */

    if (this.props.gameState === gameStates.RUNNING) {
      // Update all the stuff

      if (taps.esc) {
        taps = this.resetTaps();
        this.pauseGame();
      }
    }

    /*
     * PAUSED
     */

    if (this.props.gameState === gameStates.PAUSED) {
      if (taps.enter || taps.esc) {
        taps = this.resetTaps();
        this.resumeGame();
      }
    }

    /*
     * OVER
     */

    if (this.props.gameState === gameStates.OVER) {
      //Game over, friendo. Play again?
    }

    /*
     * FINISH UP
     */

    taps = this.resetTaps();
  };

  draw = () => {};

  end = () => {};

  render() {
    const { gameState } = this.props;
    const canvas = this.props.layers.map(layer => (
      <Canvas
        key={layer.name}
        ref={this[`${layer.name}CanvasRef`]}
        depth={layer.depth}
      />
    ));

    return (
      <>
        <StylesSanitize />
        <StylesBase />
        <GameContainer>
          <TitleScreen show={gameState === gameStates.TITLE} />
          <PauseScreen show={gameState === gameStates.PAUSED} />
          <GameOverScreen show={gameState === gameStates.OVER} />
          {canvas}
        </GameContainer>
      </>
    );
  }
}

const GameContainer = styled.div``;

const mapStateToProps = state => {
  return {
    layers: state.layers,
    gameState: state.gameState,
    previousGameState: state.previousGameState,
    stage: state.stage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setGameState: gameState =>
      dispatch({ type: actionTypes.SET_GAME_STATE, gameState: gameState }),
    addToStage: element =>
      dispatch({ type: actionTypes.ADD_TO_STAGE, element: element }),
    removeFromStage: id =>
      dispatch({ type: actionTypes.REMOVE_FROM_STAGE, id: id }),
    clearStage: id => dispatch({ type: actionTypes.CLEAR_STAGE })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
