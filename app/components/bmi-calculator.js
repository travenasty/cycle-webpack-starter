import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import _ from 'lodash';
import makeSlider from './slider';

function makeBMICalculator(namespace) {
  const name = _.last(namespace);

  const model = (weightState$, heightState$) => {
    return Rx.Observable.combineLatest(weightState$, heightState$,
      (weightState, heightState) => {
        let heightMeters = heightState.value * 0.01;
        let bmi = Math.round(weightState.value / (heightMeters * heightMeters));
        return {bmi};
      })
      .shareReplay(1);
  };

  const view = (state$, weightVTree$, heightVTree$) => state$.map(({bmi}) => {
    return h('div' + name, [
      weightVTree$,
      heightVTree$,
      h('h2', 'BMI is ' + bmi),
    ]);
  });

  return function minimain(DOM) {
    const weightSlider = makeSlider(namespace.concat('.weight'));
    const heightSlider = makeSlider(namespace.concat('.height'));

    const weightProps$ = Rx.Observable.just(
      {label: 'Weight', unit: 'kg', initial: 75, min: 40, max: 150},
    );
    const heightProps$ = Rx.Observable.just(
      {label: 'Height', unit: 'cm', initial: 170, min: 130, max: 210},
    );

    const {
			DOM: weightVTree$,
			state$: weightState$,
		} = weightSlider(DOM, weightProps$);

    const {
			DOM: heightVTree$,
			state$: heightState$,
		} = heightSlider(DOM, heightProps$);

    return {
      DOM: view(model(weightState$, heightState$), weightVTree$, heightVTree$),
    };
  };
}

export default makeBMICalculator;
