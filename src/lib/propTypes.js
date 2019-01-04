import PropTypes from 'prop-types';
import { requireAttributes } from './utils';
import { isValidEmail } from '../server/lib/utils';

PropTypes.nodeList = createChainableTypeChecker((props, propName, componentName) => {
  componentName = componentName || 'ANONYMOUS';
  const nodeList = props[propName];
  if (nodeList.__typename !== 'NodeListType') {
    return new Error(`${propName} in ${componentName} __typename is ${nodeList.__typename}, must be NodeListType`);
  }
  requireAttributes(
    nodeList,
    ['total', 'nodes'],
    missingAttr => `${propName} in ${componentName} is missing the ${missingAttr} attribute`,
  );
  // assume all ok
  return null;
});

PropTypes.email = createChainableTypeChecker((props, propName, componentName) => {
  componentName = componentName || 'ANONYMOUS';
  const email = props[propName];
  if (!isValidEmail(email)) {
    return new Error(`${propName} in ${componentName} is not a valid email address (${email})`);
  }
  return null;
});

PropTypes.nodeType = nodeType =>
  createChainableTypeChecker((props, propName, componentName) => {
    componentName = componentName || 'ANONYMOUS';
    const nodeList = props[propName];
    if (nodeList.__typename !== `${nodeType}Type`) {
      return new Error(`${propName} in ${componentName} __typename is ${nodeList.__typename}, must be ${nodeType}Type`);
    }
    requireAttributes(
      nodeList,
      ['total', 'nodes'],
      missingAttr => `${propName} in ${componentName} is missing the ${missingAttr} attribute`,
    );
    // assume all ok
    return null;
  });

let ReactPropTypeLocationNames = {};

if ('production' !== process.env.NODE_ENV) {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context',
  };
}

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location) {
    componentName = componentName || ANONYMOUS;
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new Error(
          'Required ' + locationName + ' `' + propName + '` was not specified in ' + ('`' + componentName + '`.'),
        );
      }
      return null;
    } else {
      return validate(props, propName, componentName, location);
    }
  }

  let chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

export default PropTypes;
