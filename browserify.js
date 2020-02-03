var lR = ALLEX.execSuite.libRegistry;

lR.register('social_profilepropertiesconsuminglib', require('./libindex')(
  ALLEX,
  lR.get('allex_jobondestroyablelib')
));
