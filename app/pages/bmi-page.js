import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import _ from 'lodash';
import makeBMICalculator from '../components/bmi-calculator';

function makeBMIPage(namespace) {
  const name = _.last(namespace);

  const view = (calcVTree$) => Rx.Observable.just(
    h('div' + name, [
      calcVTree$,
    ])
  );

  return function minimain(DOM) {
    const calc = makeBMICalculator(namespace.concat('.bmi-calculator'));
    const calcVTree$ = calc(DOM).DOM;
    return {
      DOM: view(calcVTree$),
    };
  };
}

export default makeBMIPage;
