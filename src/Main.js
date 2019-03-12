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
  }

  state = {
    width: null,
    height: null
  };

  componentDidMount() {
    this.initialize();
    // If there are generated levels stored in localStorage, get them and put them in the state
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.gameState !== nextProps.gameState) {
      return true;
    }
    return false;
  }

  // componentDidUpdate() {
  //   console.log('Component Did Update!');
  // }

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

    // Also update scrollMin, scrollMax, but only if there's a level loaded.
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
    // Consider moving this function to a separate file
    const level = levels[levelId];
    const { matrix } = level;
    const { width, height } = this.props.stage;

    this.props.loadLevel(level);

    const chunkHomeDescriptor = matrix[level.start.y][level.start.x];
    const chunkHomeArray = chunkHomeDescriptor.split('');
    const padX = chunkHomeArray[chunkHomeArray.indexOf('@') + 1];
    const padY = chunkHomeArray[1];

    const stageScrollXBase = level.start.x * chunkSize + chunkSize / 2 + (padX * chunkSize) / 10 - chunkSize / 2;
    const stageScrollYBase = level.start.y * chunkSize + chunkSize / 2 + (padY * chunkSize) / 10 - chunkSize / 2;

    const stageScrollXMax = level.matrix[0].length * chunkSize - width / 2 - 1;
    const stageScrollXMin = width / 2;
    const stageScrollYMax = level.matrix.length * chunkSize - height / 2 - 1;
    const stageScrollYMin = height / 2;

    let stageScrollX = stageScrollXBase;
    let stageScrollY = stageScrollYBase;

    if (stageScrollXBase < stageScrollXMin) stageScrollX = stageScrollXMin;
    if (stageScrollYBase < stageScrollYMin) stageScrollY = stageScrollYMin;
    if (stageScrollXBase > stageScrollXMax) stageScrollX = stageScrollXMax;
    if (stageScrollYBase > stageScrollYMax) stageScrollY = stageScrollYMax;

    this.props.updateStageScroll({
      x: stageScrollX,
      y: stageScrollY,
      xMax: stageScrollXMax,
      yMax: stageScrollYMax,
      xMin: stageScrollXMin,
      yMin: stageScrollYMin
    });

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

    this.initializePlayer(stageScrollXBase, stageScrollYBase);
  };

  unloadLevel = () => {
    // Move this to same file as loadLevel?
    // Discard all chunks?
  };

  initializePlayer = (x, y) => {
    const ship = new Ship(x, y);
    this.props.initializeShip({ x: x, y: y });
    this.props.addObjectToStage(ship);
  };

  update = delta => {
    const { pressed } = this.props.input;
    const { tapped } = this.props.input;
    const { gameState } = this.props;
    const { objects, scrollX, scrollY, scrollXMax, scrollXMin, scrollYMax, scrollYMin, width, height } = this.props.stage;
    const shipX = this.props.ship.x;
    const shipY = this.props.ship.y;

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

    // Wait for pause
    if (gameState.current === gameStates.RUNNING) {
      if (tapped.esc) {
        this.props.resetTaps();
        this.pauseGame();
      }
    }

    // Update all the stuff
    if (gameState.current === gameStates.RUNNING) {
      objects.forEach(object => {
        object.update();
      });

      if (shipX - scrollX > width / 4 && scrollX < scrollXMax) {
        console.log('Scroll right');
        // Dispatch action here to move scrollX closer to shipX
      }
      if (shipX - scrollX < (width / 4) * -1 && scrollX > scrollXMin) {
        console.log('Scroll left');
        // Dispatch action here to move scrollX closer to shipX
      }
      if (shipY - scrollY > height / 4 && scrollY < scrollYMax) {
        console.log('Scroll down');
        // Dispatch action here to move scrollY closer to shipY
      }
      if (shipY - scrollY < (height / 4) * -1 && scrollY > scrollYMin) {
        console.log('Scroll up');
        // Dispatch action here to move scrollY closer to shipY
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
    stage: state.stage,
    ship: state.ship
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
    updateStageScroll: position => dispatch(actionCreators.updateStageScroll(position)),
    initializeShip: ship => dispatch(actionCreators.initializeShip(ship))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
