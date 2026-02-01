import urllib.request
import json
import urllib.error

def test_pipeline(name, nodes, edges, expected_is_dag):
    url = "http://127.0.0.1:8000/pipelines/parse"
    payload = {
        "nodes": [{"id": n} for n in nodes],
        "edges": [{"source": e[0], "target": e[1]} for e in edges]
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            is_dag = result['is_dag']
            status = "✅ PASS" if is_dag == expected_is_dag else "❌ FAIL"
            print(f"Test '{name}': {status}")
            print(f"   Nodes: {len(nodes)}, Edges: {len(edges)}")
            print(f"   Expected is_dag: {expected_is_dag}, Got: {is_dag}")
            print("-" * 40)
    except urllib.error.URLError as e:
        print(f"Test '{name}': ❌ FAILED TO CONNECT")
        print(f"   Error: {e}")
        print("-" * 40)

print("Running Backend DAG Validation Tests...\n")

# Case 1: Simple DAG
# A -> B
test_pipeline(
    "Simple DAG",
    nodes=["1", "2"],
    edges=[("1", "2")],
    expected_is_dag=True
)

# Case 2: Cycle
# A -> B -> A
test_pipeline(
    "Simple Cycle",
    nodes=["1", "2"],
    edges=[("1", "2"), ("2", "1")],
    expected_is_dag=False
)

# Case 3: Disconnected components (Should be DAG)
# A -> B, C
test_pipeline(
    "Disconnected DAG",
    nodes=["1", "2", "3"],
    edges=[("1", "2")],
    expected_is_dag=True
)

# Case 4: The "Zombie Edge" (Regression Test)
# Nodes: [A]
# Edges: [A -> B] (B does not exist)
# Previous behavior: Might crash or count edge.
# New behavior: Should ignore the edge and return True (A is a DAG by itself).
test_pipeline(
    "Zombie Edge (Missing Target)",
    nodes=["1"],
    edges=[("1", "2")], # Node 2 missing
    expected_is_dag=True
)

# Case 5: Zombie Edge (Missing Source)
test_pipeline(
    "Zombie Edge (Missing Source)",
    nodes=["2"],
    edges=[("1", "2")], # Node 1 missing
    expected_is_dag=True
)
