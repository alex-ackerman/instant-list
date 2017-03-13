import React, { Component } from 'react';
import './ClickableList.css';
import ImmutableSet from '../ImmutableSet';

const minScrollHandleHeight = 25;

export default class ClickableList extends Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.renderScrollHandle = this.renderScrollHandle.bind(this);

        this.state = {
            startItem: 0,
            scrollHandleOffset: 0
        };
    }

    onClick(e) {
        const { onClick, onSelect } = this.props;
        const id = e.target.dataset.id;
        if (e.ctrlKey) {
            onSelect(id);
        } else {
            onClick(id);
        }
    }

    renderItem(item) {
        const { selectedItems, makeLabel } = this.props;
        const className = selectedItems.contains(item.id) ? 'selected' : '';
        return (
            <li key={item.id} className='list-item'>
                <button className={className} data-id={item.id} onClick={this.onClick}>{makeLabel(item)}</button>
            </li>
        );
    }

    onWheel(e) {
        const { items } = this.props;
        const { startItem } = this.state;
        let newStartItem = e.deltaY > 0 ? startItem + 1 : startItem - 1;
        newStartItem = newStartItem < 0 ? 0 : newStartItem;
        newStartItem = newStartItem > items.length - 1 ? items.length - 1 : newStartItem;
        
        const nextScrollHandleOffset = Math.floor(newStartItem / items.length * 540);

        this.setState({
            ...this.state,
            startItem: newStartItem,
            scrollHandleOffset: nextScrollHandleOffset
        });
    }

    renderScrollHandle() {
        const { scrollHandleOffset } = this.state;
        const style = { marginTop: scrollHandleOffset };
        return <div className="scroll-handle" style={style} />;
    }

    render() {
        const { items } = this.props;
        const { startItem } = this.state; 
        const listItems = items.slice(startItem, startItem + 12).map(this.renderItem);
        const scrollHandle = this.renderScrollHandle();

        return (
            <div>
                <div className="list-container">
                    <ul onWheel={this.onWheel} className="list">
                        { listItems }
                    </ul>
                    <div className="scroll-bar">
                        { scrollHandle }
                    </div>
                    <div className="clear-both" />
                </div>
            </div>
        );
    }

}

const { arrayOf, shape, number, string, func, instanceOf } = React.PropTypes;

ClickableList.propTypes = {
    items: arrayOf(shape({
        id: number,
        value: string
    })).isRequired,
    onClick: func.isRequired,
    onSelect: func.isRequired,
    selectedItems: instanceOf(ImmutableSet).isRequired
};

ClickableList.defaultProps = {
    makeLabel: item => item.value
};