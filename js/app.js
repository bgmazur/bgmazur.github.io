const fields = 'A0 A1 B0 B1 C0 D0 D1'.split(' ');
const fieldsConnections = [
    ['A0', 'A1'],
    ['A0', 'C0'],
    ['A1', 'B0'],
    ['B0', 'B1'],
    ['B1', 'D0'],
    ['C0', 'D0'],
    ['D0', 'D1'],
];

const adjacencyList = new Map();
var graph;

var humanTo = "D1";
var humanFrom = "D1";

function addToAdjacencyList(node) {
    adjacencyList.set(node, []);
}

function addEdge(origin, destination) {
    adjacencyList.get(origin).push(destination);
    adjacencyList.get(destination).push(origin);
}

function initBoard(board, buttons) {
    fields.forEach(addToAdjacencyList);
    fieldsConnections.forEach(field => addEdge(...field));

    for (let i = 0; i < fields.length; i++) {
        const button = document.createElement('button')

        button.innerText = fields[i]
        button.setAttribute('id', fields[i])
        board.appendChild(button)
        button.classList.add('field')

        buttons.push(button)

        button.addEventListener('click', function (e) {
            click(button, buttons)
        })
    }

    buttons[buttons.length-1].classList.add('current');
}

function click(button, buttons) {
    let random = Math.floor(Math.random() * 3)
    console.log(random)

    if (random > 1 && button.id != humanTo) {
            humanFrom = humanTo;
            humanTo = button.id;

            console.log(humanFrom);
            console.log(humanTo);

            var newPath = bfs(humanFrom, humanTo);
            
            buttons.forEach((b)=>{
                b.classList="";
                if(newPath.includes(b.id)){
                    b.classList="";
                    b.classList.add('path');
                }
            })

            buttons.forEach(setNewPositions);

            graph.setupGraph(fields, adjacencyList);
    }
}

function moveHuman(buttons){

    var moveTo = fields[Math.floor(Math.random()*fields.length)];

    humanFrom = humanTo;
    humanTo = moveTo;

    console.log(humanFrom);
    console.log(humanTo);

    buttons.forEach((b)=>{
        b.classList="";});
    
    buttons.forEach(setNewPositions);

}

function setNewPositions(button){

    switch(button.id){
        case humanFrom:
            button.classList.add('previous');
            break;

        case humanTo:
            button.classList.add('current');
            break;

        default:
            if(button.classList!='path'){
                button.classList.add('field');
            }
            break;
    }
}

function bfs(from, to){
    var queue = [];
    var path = [];

    var start = graph.setStart(from);
    var end = graph.setEnd(to);

    start.searched = true;
    queue.push(start);

    while(queue.length>0){

        var current = queue.shift();

        if(current == end){
            console.log("Found "+current.value);
            break;
        }

        var neighbors = current.edges;

        for(var i=0; i<neighbors.length; i++){
            var neighbor = neighbors[i];

            if(!neighbor.searched){
                neighbor.searched = true;
                neighbor.parent = current;
                queue.push(neighbor);
            }
        }
    }

    path.push(end.value);
    var next = end.parent;

    console.log(end);

    while(next != null){
        path.push(next.value);
        next = next.parent;
    }

    path.shift();
    path.pop();
    //path.reverse();

    console.log(path);
    return path;

}

document.addEventListener('DOMContentLoaded', () => {

    const board = document.querySelector('.board');
    const buttons = [];
    graph = new Graph();

    initBoard(board, buttons);

    graph.setupGraph(fields, adjacencyList);

});

class Node {
    constructor(value) {
        this.value = value;
        this.edges = [];
        this.searched = false;
        this.parent = null;
    }

    addEdge(neighbor) {
        this.edges.push(neighbor);
        neighbor.edges.push(this);
    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.graph = {};
        this.start = null;
        this.end = null;
    }

    addNode(node) {
        this.nodes.push(node);
        var name = node.value;
        this.graph[name] = node;
    }

    getNode(node) {
        return this.graph[node];
    }

    setStart(node) {
        this.start = this.graph[node];
        return this.start;
    }

    setEnd(node) {
        this.end = this.graph[node];
        return this.end;
    }

    setupGraph(fieldList, dependencyMap) {

        for(var i=0; i<fieldList.length; i++){

            var fieldKey = fieldList[i];

            var node = new Node(fieldKey);
            var edgesArray = Array.from(dependencyMap.get(fieldKey));

            this.addNode(node);

            for (var j = 0; j < edgesArray.length; j++) {
                var edge = edgesArray[j];
                var edgeNode = this.getNode(edge);

                if (edgeNode == undefined) {
                    edgeNode = new Node(edge);
                }

                node.addEdge(edgeNode);
            }
        }
    }
}
