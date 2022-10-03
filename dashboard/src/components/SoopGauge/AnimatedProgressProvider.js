import React from "react";
import styled from "styled-components";
import { Animate } from "react-move";

const Test = styled.div`
  width: 100%;
  height: 100%;
`;

class AnimatedProgressProvider extends React.Component {
  interval = undefined;

  state = {
    isAnimated: false,
  };

  static defaultProps = {
    valueStart: 0,
  };

  componentDidMount() {
    this.setState({
      isAnimated: !this.state.isAnimated,
    });
  }

  render() {
    return (
      <Test>
        <Animate
          start={() => ({
            value: this.props.valueStart,
          })}
          update={() => ({
            value: [this.state.isAnimated ? this.props.valueEnd : this.props.valueStart],
            timing: {
              duration: this.props.duration * 1000,
              ease: this.props.easingFunction,
            },
          })}
        >
          {({ value }) => this.props.children(value)}
        </Animate>
      </Test>
    );
  }
}

export default AnimatedProgressProvider;
