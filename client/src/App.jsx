import { PipelineToolbar } from "./components/toolbar";
import { PipelineUI } from "./components/ui";

function App() {
  return (
    <div className="min-h-screen bg-bg-dark">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;
