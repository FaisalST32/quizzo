import React, { Component } from 'react';

interface ISolutionState {}

class Solution extends Component<any, ISolutionState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    render() {
        return <div>Solution</div>;
    }
}

export default Solution;
