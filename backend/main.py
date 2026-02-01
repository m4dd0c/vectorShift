from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from collections import defaultdict, deque

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str


class Edge(BaseModel):
    source: str
    target: str


class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineData):
    """
    Parse pipeline and return:
    - num_nodes: number of nodes
    - num_edges: number of edges
    - is_dag: whether the graph is a Directed Acyclic Graph
    """

    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Check if the graph is a DAG using topological sort (Kahn's algorithm)
    is_dag = is_directed_acyclic_graph(nodes, edges)

    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": is_dag}


def is_directed_acyclic_graph(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Determine if the graph is a DAG using Kahn's algorithm (topological sort).
    Robustly handles disconnected components and filters invalid edges.
    """
    if not nodes:
        return True

    # 1. Collect all valid node IDs
    node_ids = {node.id for node in nodes}

    # 2. Build adjacency list and in-degree map
    # Only consider edges where BOTH source and target exist in the valid node set
    graph = defaultdict(list)
    in_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.source
        target = edge.target
        
        # Skip 'zombie' edges (edges pointing to/from non-existent nodes)
        if source in node_ids and target in node_ids:
            graph[source].append(target)
            in_degree[target] += 1

    # 3. Find all nodes with in-degree 0
    queue = deque([node_id for node_id in node_ids if in_degree[node_id] == 0])

    processed_count = 0

    # 4. Process nodes
    while queue:
        node = queue.popleft()
        processed_count += 1

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # 5. If we processed all nodes, it's a DAG
    return processed_count == len(node_ids)
