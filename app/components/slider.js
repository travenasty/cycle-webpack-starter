//import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import _ from 'lodash';

function makeSlider(namespace) {
  const name = _.last(namespace);

  const intent = (DOM) => ({
    change$: DOM.get(`${namespace.join(' ')} input`, 'input')
      .map((ev) => ev.target.value),
  });

  const model = (actions, props$) => (
    props$.map(({initial}) => initial).first()
      .concat(actions.change$)
      .combineLatest(props$, (value, props) => ({
        value,
        unit: props.unit,
        min: props.min,
        max: props.max,
        label: props.label,
      }))
      .shareReplay(1)
  );

  const view = (state$) => state$.map(({value, unit, label, min, max}) => {
    return h(`div${name}`, [
      `${label} ${value}${unit}`,
      h('input', {type: 'range', min, max, value}),
    ]);
  });

  return function minimain(DOM, props$) {
    const state$ = model(intent(DOM), props$);
    return {
      DOM: view(state$),
      state$,
    };
  };
}

export default makeSlider;
