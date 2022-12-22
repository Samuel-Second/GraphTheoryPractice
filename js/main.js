let configStorage = new ConfigStorage();

algorithmSlct.value         = configStorage.getAlgorithm();
adjcConfigMinEdge.value     = configStorage.getEdgeMin();
adjcConfigMaxEdge.value     = configStorage.getEdgeMax();
adjcConfigEdgeDensity.value = configStorage.getEdgeDensity();

let numOfNode = configStorage.getNumOfNode();

let graph = new Graph();

graph.generateGraph(numOfNode);