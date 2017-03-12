import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ClickableList from './components/ClickableList';
import { draculaWordsPromise, globalSequence } from './utils';
import ImmutableSet from './ImmutableSet';

// const items = [
//     {id: 1001, value: 'Phillip J. Fry'},
//     {id: 1002, value: 'Bender Rodriguez'},
//     {id: 1003, value: 'Leela Turanga'},
//     {id: 1004, value: 'Zapp Brannigan'}
// ];

const filterCache = {};

class App extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            loading: true,
            filter: '',
            selectedItems: new ImmutableSet(),
        };
        this.init = this.init.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onClick = this.onClick.bind(this);
        this.deselectAll = this.deselectAll.bind(this);

        this.init();
    }
    init() {
        draculaWordsPromise
            .then(words => words.map(word => ({
                id: globalSequence(),
                value: word
            })))
            .then(words => this.setState({
                ...this.state,
                loading: false,
                items: words,
                filter: ''
            }));
    }
    setFilter(e) {
        const val = e.target.value;
        this.setState({
            ...this.state,
            filter: val
        });
    }
    onClick(id) {
        console.log('> clicked', id);
    }
    onSelect(id) {
        const { selectedItems } = this.state;
        const nextSelectedItems = selectedItems.contains(id) ? selectedItems.remove(id) : selectedItems.add(id);
        const nextState = Object.assign({}, this.state, {
            selectedItems: nextSelectedItems
        });

        this.setState(nextState);
    }
    deselectAll(e) {
        this.setState({
            ...this.state,
            selectedItems: new ImmutableSet()
        });
    }
    render() {
        console.time('>render app');
        const { items, loading, filter, selectedItems } = this.state;
        const loadingLabel = loading ? <span>please wait...</span> : null;
        const selectedListItems = selectedItems.map(id => <li key={id}><strong>{id}</strong></li>);
        console.time('>>filter');
        if (!filterCache[filter] && filter.length > 0) {
            filterCache[filter] = items.filter(item => item.value.toLowerCase().indexOf(filter) > -1);
        }
        const filteredItems = (filterCache[filter] || items);
        console.timeEnd('>>filter');
        const itemCountLabel = `Showing ${filteredItems.length} of ${items.length}`;

        const deselectAllButton = 
            selectedListItems.length > 0 ? 
                <button onClick={this.deselectAll}>Deselect All</button> : 
                null;

        console.timeEnd('>render app');
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                { loadingLabel }
                <div className="container">
                    <input type="text" className="filter-box" onChange={this.setFilter} />
                    <ClickableList 
                        items={filteredItems} 
                        onClick={this.onClick} 
                        onSelect={this.onSelect}
                        selectedItems={selectedItems}
                        makeLabel={item => `${item.value} (${item.id})`} />
                    <span className="count-label">{itemCountLabel}</span>
                </div>
                <div className="right-pane">
                    { deselectAllButton }
                    <ul>
                        { selectedListItems }
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;
