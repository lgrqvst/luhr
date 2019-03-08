import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/index';
import MainLoop from 'mainloop.js';

import styled from 'styled-components';
import StylesSanitize from './styles/Sanitize';
import StylesBase from './styles/Base';

import * as gameStates from './data/gameStates';
import levels from './data/levels';

import Canvas from './components/Canvas';
import TitleScreen from './components/UI/TitleScreen';
import PauseScreen from './components/UI/PauseScreen';
import GameOverScreen from './components/UI/GameOverScreen';

class Game extends Component {
  constructor(props) {
    super(props);

    for (let layer of this.props.layers) {
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

    window.addEventListener('keydown', ({ keyCode }) =>
      this.props.updateInput(keyCode, true)
    );
    window.addEventListener('keyup', ({ keyCode }) =>
      this.props.updateInput(keyCode, false)
    );

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
    // Check if a level matrix has been generated before and stored in the state
    // If no, generate it based on information in levels[level] and store generatedLevel in the state
    // Take the level data from the state and push it to the stage
    // The generatedLevel object should have information about what goes in the foreground and what goes in the background, as well as relevant parallax info
    // initializePlayer() to create the ship
    console.log('Loading: ' + level);
  };

  unloadLevel = () => {
    // Unload the current level
    // I.e. Remove it and the player from the stage.
    // It is assumed that when this function is called, loadLevel is also called with a new level.
  };

  initializePlayer = () => {
    // Check the state for the currently status of the ship (including cargo status, equipped upgrades, etc.) and generate a copy.
  };

  // resetTaps = () => {
  //   // return this.state.input.resetTaps();
  // };

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

    // this.props.resetTaps();
  };

  draw = () => {
    // Draw out everything that's in the stage array
  };

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
    layers: state.layers.layers,
    gameState: state.gameState,
    previousGameState: state.previousGameState,
    input: state.input
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setGameState: gameState => dispatch(actionCreators.setGameState(gameState)),
    updateInput: (keyCode, value) =>
      dispatch(actionCreators.updateInput(keyCode, value)),
    resetTaps: () => dispatch(actionCreators.resetTaps())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
