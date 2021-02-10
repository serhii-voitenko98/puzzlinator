const puzzles = [
	{
		id: 1,
		edges: {
			top: null,
			right: null,
			bottom: { edgeTypeId: 7, type: "outside" },
			left: { edgeTypeId: 5, type: "inside" },
		},
	},
	{
		id: 9,
		edges: {
			top: { edgeTypeId: 8, type: "inside" },
			right: { edgeTypeId: 15, type: "inside" },
			bottom: null,
			left: { edgeTypeId: 5, type: "outside" },
		},
	},
	{
		id: 5,
		edges: {
			top: null,
			right: { edgeTypeId: 2, type: "inside" },
			bottom: { edgeTypeId: 1, type: "inside" },
			left: null,
		},
	},
	{
		id: 4,
		edges: {
			top: { edgeTypeId: 34, type: "inside" },
			right: { edgeTypeId: 11, type: "outside" },
			bottom: { edgeTypeId: 7, type: "inside" },
			left: null,
		},
	},
	{
		id: 3,
		edges: {
			top: { edgeTypeId: 2, type: "outside" },
			right: null,
			bottom: { edgeTypeId: 4, type: "outside" },
			left: { edgeTypeId: 6, type: "inside" },
		},
	},
	{
		id: 2,
		edges: {
			top: { edgeTypeId: 3, type: "outside" },
			right: { edgeTypeId: 34, type: "outside" },
			bottom: null,
			left: null,
		},
	},
	{
		id: 8,
		edges: {
			top: null,
			right: { edgeTypeId: 15, type: "outside" },
			bottom: { edgeTypeId: 4, type: "inside" },
			left: null,
		},
	},
	{
		id: 7,
		edges: {
			top: { edgeTypeId: 3, type: "inside" },
			right: null,
			bottom: { edgeTypeId: 1, type: "outside" },
			left: { edgeTypeId: 10, type: "inside" },
		},
	},
	{
		id: 6,
		edges: {
			top: { edgeTypeId: 11, type: "inside" },
			right: { edgeTypeId: 10, type: "outside" },
			bottom: { edgeTypeId: 6, type: "outside" },
			left: { edgeTypeId: 8, type: "outside" },
		},
	},
];

const firstPuzzle = puzzles[0];
const rightId = findFirstRightEdgeTypeId(firstPuzzle.edges);
const bottomId = findFirstBottomEdgeTypeId(firstPuzzle.edges)

function solvePuzzle(list) {
	const results = [];
	results.push(firstPuzzle.id);
	list = list.filter(puzzle => puzzle.id !== firstPuzzle.id);

	chainPuzzles(results, list, rightId, bottomId);

	return results;
}

function chainPuzzles(results, source, nextPuzzleEdgeTypeId, newLinePuzzleEdgeTypeId) {
	if (source.length === 0) {
		return results;
	}

	const puzzle = findPuzzleWithSameEdgeTypeId(source, nextPuzzleEdgeTypeId);

	source = source.filter(sourcePuzzle => sourcePuzzle.id !== puzzle.id);
	results.push(puzzle.id);

	let oppositeEdgeTypeId;

	if (isPuzzleIncludesEdgeTypeId(puzzle, newLinePuzzleEdgeTypeId)) {
		oppositeEdgeTypeId = findOppositeEdgeTypeId(puzzle.edges, null);
	} else {
		oppositeEdgeTypeId = findOppositeEdgeTypeId(puzzle.edges, nextPuzzleEdgeTypeId);
	}

	if (!oppositeEdgeTypeId && source.length >= 1) {
		const newLinePuzzle = findPuzzleWithSameEdgeTypeId(source, newLinePuzzleEdgeTypeId);
		const foundNewLinePuzzleEdgeTypeId = findOppositeEdgeTypeId(newLinePuzzle.edges, newLinePuzzleEdgeTypeId);

		if (foundNewLinePuzzleEdgeTypeId) {
			chainPuzzles(results, source, newLinePuzzleEdgeTypeId, foundNewLinePuzzleEdgeTypeId);
		} else { // means that it's a first puzzle in a last row
			chainPuzzles(results, source, newLinePuzzleEdgeTypeId, newLinePuzzleEdgeTypeId);
		}
	} else {
		chainPuzzles(results, source, oppositeEdgeTypeId, newLinePuzzleEdgeTypeId);
	}
}

function findPuzzleWithSameEdgeTypeId(source, id) {
	return source.find(puzzle => {
		for (const edge of Object.keys(puzzle.edges)) {
			if (puzzle.edges[edge] && puzzle.edges[edge].edgeTypeId === id) {
				return true
			}
		}

		return false;
	})
}

function findFirstRightEdgeTypeId(edges) {
	if (!edges.top && !edges.right) {
		return edges.bottom.edgeTypeId;
	}

	if (!edges.top && !edges.left) {
		return edges.right.edgeTypeId;
	}

	if (!edges.bottom && !edges.left) {
		return edges.top.edgeTypeId;
	}

	if (!edges.bottom && !edges.right) {
		return edges.left.edgeTypeId;
	}
}

function findFirstBottomEdgeTypeId(edges) {
	if (!edges.top && !edges.right) {
		return edges.left.edgeTypeId;
	}

	if (!edges.top && !edges.left) {
		return edges.bottom.edgeTypeId;
	}

	if (!edges.bottom && !edges.left) {
		return edges.right.edgeTypeId;
	}

	if (!edges.bottom && !edges.right) {
		return edges.top.edgeTypeId;
	}
}

function findOppositeEdgeTypeId(edges, edgeTypeId) {
	if (edgeTypeId) {
		if (edges.top && edges.top.edgeTypeId === edgeTypeId) {
			return edges.bottom ? edges.bottom.edgeTypeId : null;
		} else if (edges.right && edges.right.edgeTypeId === edgeTypeId) {
			return edges.left ? edges.left.edgeTypeId : null;
		} else if (edges.bottom && edges.bottom.edgeTypeId === edgeTypeId) {
			return edges.top ? edges.top.edgeTypeId : null;
		} else if (edges.left && edges.left.edgeTypeId === edgeTypeId) {
			return edges.right ? edges.right.edgeTypeId : null;
		}
	} else {
		if (!edges.top) {
			return edges.bottom.edgeTypeId;
		} else if (!edges.bottom) {
			return edges.top.edgeTypeId;
		} else if (!edges.right) {
			return edges.left.edgeTypeId;
		} else if (!edges.left) {
			return edges.right.edgeTypeId;
		}
	}
}

function isPuzzleIncludesEdgeTypeId(puzzle, id) {
	const edges = puzzle.edges;
	const edgesKeys = Object.keys(edges);

	return !!edgesKeys.filter(edge => edges[edge] ? edges[edge].edgeTypeId === id : false).length;
}

console.log(solvePuzzle(puzzles))

