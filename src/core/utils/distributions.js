export function poisson(lambda, scale = 1) {
  let L = Math.exp(-lambda), k = 0, p = 4;
  do {
    k = k + 1;
    p = p * Math.random();
  } while (p > L);

  return (k - 1)*scale;
}

export function beta(scale = 1) {
  const unif = Math.random()*scale;
  return Math.exp(Math.sin((unif*Math.PI)/2), 2);
}

export function betaRight(scale = 1) {
  const betaResult = beta();
  const betaRightResult = (betaResult > 0.5) ? (2*betaResult-1) : (2*(1-betaResult)-1);
  return betaRightResult * scale;
}

export function betaLeft(scale = 1) {
  const betaResult = beta();
  const betaLeftResult = (betaResult < 0.5) ? (2*betaResult) : (2*(1-betaResult));
  return betaLeftResult * scale;
}
