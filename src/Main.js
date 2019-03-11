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

import Chunk from './classes/Chunk';
import Ship from './classes/Ship';

import Canvas from './components/Canvas';
import TitleScreen from './components/UI/TitleScreen';
import PauseScreen from './components/UI/PauseScreen';
import GameOverScreen from './components/UI/GameOverScreen';

class Main extends Component {
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
    this.props.updateStageSize({
      width: window.innerWidth * 2,
      height: window.innerHeight * 2
    });
  };

  setCanvasSize = () => {
    this.updateSize();
    const width = this.props.stage.width || window.innerWidth * 2;
    const height = this.props.stage.height || window.innerHeight * 2;

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
    const { width, height } = this.props.stage;

    this.props.loadLevel(level);

    // [x] Get the chunk with the landing pad
    // [x] Get the position of the landing pad
    // [x] Calculate how the chunk needs to be placed for the landing pad to end in the center of the stage
    // [x] Calculate viewport position (stage scroll position) based on that
    // [x] Calculate how many chunks need to be drawn to the left, right, top and bottom based on that scroll position
    // [x] Generate chunks
    // [x] Add all chunks to stage
    // [ ] Initialize ship in the position of the landing pad

    const chunkHomeDescriptor = matrix[level.start.y][level.start.x];
    const chunkHomeArray = chunkHomeDescriptor.split('');
    const padX = chunkHomeArray[chunkHomeArray.indexOf('@') + 1];
    const padY = chunkHomeArray[1];

    let stageScrollX = level.start.x * chunkSize + chunkSize / 2 + (padX * chunkSize) / 10 - chunkSize / 2;
    let stageScrollY = level.start.y * chunkSize + chunkSize / 2 + (padY * chunkSize) / 10 - chunkSize / 2;

    if (stageScrollX < width / 2) stageScrollX = width / 2;
    if (stageScrollY < height / 2) stageScrollY = height / 2;
    if (stageScrollX > level.matrix[0].length * chunkSize - width / 2 - 1) stageScrollX = level.matrix[0].length * chunkSize - width / 2 - 1;
    if (stageScrollY > level.matrix.length * chunkSize - height / 2 - 1) stageScrollY = level.matrix.length * chunkSize - height / 2 - 1;

    this.props.updateStageScroll({ x: stageScrollX, y: stageScrollY });

    const initialChunkLowX = Math.floor((stageScrollX - width / 2) / chunkSize);
    const initialChunkHighX = Math.floor((stageScrollX + width / 2) / chunkSize);
    const initialChunkLowY = Math.floor((stageScrollY - height / 2) / chunkSize);
    const initialChunkHighY = Math.floor((stageScrollY + height / 2) / chunkSize);

    for (let y = initialChunkLowY; y <= initialChunkHighY; y++) {
      for (let x = initialChunkLowX; x <= initialChunkHighX; x++) {
        let chunk = new Chunk(level.matrix[y][x], x, y);
        this.props.addChunk(chunk);
      }
    }

    // const shipY = stageScrollY - level.start.y * chunkSize + (padY * chunkSize) / 10;
    const shipY = stageScrollY - level.start.y * chunkSize + ((10 - padY) * chunkSize) / 10 - height / 2;
    console.log(shipY);
    console.log(((10 - padY) * chunkSize) / 10);

    this.initializePlayer(width / 2, shipY);
  };

  unloadLevel = () => {
    // Discard all chunks?
  };

  initializePlayer = (x, y) => {
    const ship = new Ship(x, y);
    this.props.addObjectToStage(ship);
  };

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
    const { width, height, chunks, objects } = this.props.stage;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    if (this.props.gameState.current === gameStates.RUNNING) {
      chunks.forEach(chunk => {
        chunk.draw(this.gameRenderingContext);
      });
      objects.forEach(object => {
        object.draw(this.gameRenderingContext);
      });
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
    discardChunk: id => dispatch(actionCreators.discardChunk(id)),
    addObjectToStage: object => dispatch(actionCreators.addObjectToStage(object)),
    removeObjectFromStage: id => dispatch(actionCreators.removeObjectFromStage(id)),
    updateStageSize: size => dispatch(actionCreators.updateStageSize(size)),
    updateStageScroll: position => dispatch(actionCreators.updateStageScroll(position))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
